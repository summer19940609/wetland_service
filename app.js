const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const users = require('./routes/users');
const evaluation = require("./routes/evaluation");
const problem = require('./routes/problem');

const app = express();
const session = require('express-session')({
  // genid: function(req) {
  //   return genuuid() // use UUIDs for session IDs
  // },
  secret: 'etzr',
  resave: true,
  saveUninitialized: true
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//   extended: false
// }));
app.use(cookieParser());
app.use(session);
app.use(express.static(path.join(__dirname, 'public')));

// 静态文件地址设置
app.use('/wetland_service/static', express.static(path.join(__dirname, 'public')));
app.use('/wetland_service/img', express.static(path.join(__dirname, 'uploads')));

// 陆游拆分
// 用户
app.use('/wetland_service/user', users);
// 问题
app.use('/wetland_service/problem', problem);
app.use('/wetland_service/evaluation', evaluation);
// app.use("/uploadfile", uploadfile);
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;