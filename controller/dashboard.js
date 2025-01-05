const topicModel = require('../models/topic');
const userModel = require('../models/user');
const dashboardLog = fileLogger("dashboard");

const dashboard = async (req, res, next) => {
    try {
        const { _id } = req.user;

        dashboardLog.info(`Fetching dashboard data for user ${_id}`);

        const user = await userModel.findOne({ _id });
        const topic = await topicModel.find();

        res.render('pages/dashboard', {
            title: 'Dashboard',
            topics: topic,
            completedTopics: user.completedTopics
        });
        dashboardLog.info(`Dashboard data rendered successfully for user ${_id}`);
    } catch (error) {
        dashboardLog.error("Error fetching dashboard data: ", error);
    }
};

module.exports = {
    dashboard
}