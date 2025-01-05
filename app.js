require('dotenv').config()

global.fileLogger = require('./services/logger');

const express = require('express');
const path = require('path');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expHbs = require('express-handlebars');
const flash = require('connect-flash');
const cors = require('cors');
const cookieSession = require('cookie-session');
const session = require('express-session')
const { mkdir } = require('fs');

const config = require('./config');
const { checkAuth, passport } = require('./functions/auth');
const validateEnv = require('./functions/validateEnv');

// Validate environment variables
validateEnv();

mkdir('logs', function (error, data) { });
global.errorLog = fileLogger('error');
require("./functions/responseFunction")(express);

var app = express();
app.use(cors())

require('./models/index');

// Ensure correct IP address handling
app.use(function (req, res, next) {
  let requestIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.headers['HTTP_CLIENT_IP'] || req.headers['X-Real-IP'] || req.headers['HTTP_X_FORWARDED_FOR'];
  if (requestIP.substr(0, 7) === "::ffff:") {
    requestIP = requestIP.substr(7)
  }
  requestIP = requestIP.split(',');
  req.headers['x-forwarded-for'] = requestIP[0].trim();
  req.ip = requestIP[0].trim();
  next();
});

app.use(cookieSession({
  secret: config.cookie.secret,
  key: config.cookie.key
}));

app.use(session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: true,
  maxAge: Date.now() + 30 * 86400 * 1000,
}));

app.use(flash());

// view engine setup
const hbsConfig = require('./helpers/handlebar');
app.engine('hbs', expHbs.engine(hbsConfig));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

passport(app);

logger.token('ip', function (req, res) { return req.headers['x-forwarded-for'] })
app.use(logger(':date[iso] | :ip | :method | :url | :status | :response-time ms'));

const { mCommon } = require('./middlewares/common');
app.use(mCommon);

app.use('/', require('./routes/index'));

app.use(checkAuth);
app.use('/dashboard', require('./routes/dashboard'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('pages/error/error', {
    title: "Error pages"
  });
});

module.exports = app;
