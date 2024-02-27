const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { sequelize } = require('./models');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const additionRouter = require('./routes/add-ad');
const adminRouter = require('./routes/admin');
const searchRouter = require('./routes/search');




const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(
  session({
    secret: "keyboard cat",
    store: new SequelizeStore({
      db: sequelize,
    }),
    resave: false, // we support the touch method so per the express-session docs this should be set to false
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 } // milliseconds!
  })
);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/add-ad', additionRouter);
app.use('/admin', adminRouter);
app.use('/search', searchRouter);


const db = require('./models');

async function createAdmins() {
  const admins = [{ username: 'admin', password: 'admin' }, { username: 'admin2', password: 'admin2' }];
  admins.forEach(async (admin) => {
    const [user, created] = await db.User.findOrCreate({
      where: { username: admin.username },
      defaults: { username: admin.username, password: admin.password }
    });
    if (created) {
      console.log('Admin created');
    }
  });
}

db.sequelize.sync().then(() => {
  console.log('Database Synced');
}).then(() =>
  //create user only if not exists
  createAdmins()
    .then(() => {
      console.log('Admins created');
    })
).catch((err) => {
  console.log('Error: ', err);
});



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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
