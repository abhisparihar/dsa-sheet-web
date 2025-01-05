const authLog = fileLogger("auth");
const passport = require('passport');
const { responseMessages } = require('../constant');
const userModel = require('../models/user');

const getLogin = async (req, res, next) => {
    try {
        authLog.info("Rendering login page");
        res.render('pages/users/login', {
            layout: 'login',
            title: 'Login'
        });
    } catch (error) {
        authLog.error("Error rendering login page: ", error);
    }
};


const postLogin = async function (req, res, next) {
    passport.authenticate("local", function (err, user, info) {
        if (err) {
            authLog.error("Authentication error: ", err);
            return res.sendError();
        }
        //if user not found
        if (!user) {
            authLog.warn("Invalid user login attempt");
            return req.flash('error', responseMessages['invalidUser']);
        }
        //log in user
        req.logIn(user, async function (err) {
            if (err) {
                authLog.error("Error logging in user: ", err);
                return req.flash('error', responseMessages['invalidUser']);
            }
            authLog.info(`User logged in successfully: ${user.email}`);
            req.flash('success', responseMessages['login']);
            res.redirect('/dashboard');
        });
    })(req, res, next);
};

const logout = async function (req, res, next) {
    try {
        authLog.info(`User logging out: ${req.user ? req.user.email : 'Unknown user'}`);
        req.logout();
        req.flash("success", responseMessages['signOut']);
        res.redirect("/");
    } catch (error) {
        authLog.error("Error during logout: ", error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const { _id } = req.user; // User ID from authenticated user
        const { subtopicId } = req.body; // Subtopic ID to mark as completed

        authLog.info(`Updating user ${_id} with subtopic ${subtopicId}`);

        // Update the user's completedTopics with the new subtopic ID
        await userModel.updateOne({ _id }, { $addToSet: { completedTopics: subtopicId } });

        req.flash('success', responseMessages['updateUser']);
        res.status(200).send({ message: 'Subtopic marked as completed successfully' });
        authLog.info(`User ${_id} updated successfully`);

    } catch (error) {
        authLog.error("Error updating user: ", error);
        console.log("🚀 ~ postRegistration ~ error:", error);
    }
};

module.exports = {
    getLogin,
    postLogin,
    logout,
    updateUser
}