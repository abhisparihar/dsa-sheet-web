module.exports.mCommon = function (req, res, next) {
    const error = req.flash('error');
    const success = req.flash('success');
    if (success.length) {
        res.locals.flash = {
            type: 'success',
            message: success[0]
        };
    };

    if (error.length) {
        res.locals.flash = {
            type: 'error',
            message: error[0]
        };
    };
    if (req.user) {
        res.locals.userSession = req.user;
    };
    res.locals.currentUrl = unescape(req.url);
    next();
};