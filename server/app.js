const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Load routes
const docs = require('../routes/docs');
const users = require('../routes/users');

// Connect to mongoose
mongoose
  // .connect('mongodb://whiskey2wine:bacon007@ds253889.mlab.com:53889/online-form')
  .connect('mongodb://localhost/online-form')
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Static folder
app.use(express.static(path.join(__dirname, '../public')));

// Handlebars Middleware
app.engine(
  '.hbs',
  exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
    // layoutsDir: 'public/views/layouts/',
    // partialsDir: 'public/views/partials',
  }),
);
app.set('view engine', '.hbs');
// app.set('views', 'public/views'); // change path of 'views' folder

// Body parser Middleware
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

// Method-override Middleware
app.use(methodOverride('_method'));

// Express session Middleware
app.use(session({
  secret: process.env.SESS_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60,
  }),
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash Middleware
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Index Route
app.get('/', (req, res) => {
  if (req.user) {
    return res.redirect('/docs');
  }
  res.render('users/login', {
    specialPage: true,
    title: 'Login',
    user: req.user,
  });
});

// Use routes
app.use('/docs', docs);
app.use('/users', users);

// Error handling page
app.use((req, res, next) => {
  res.status(404).render('page404', {
    layout: false,
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
