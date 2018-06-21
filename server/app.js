// @ts-check
const express = require('express');
const cors = require('cors');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Load routes
const docs = require('../routes/docs');
const users = require('../routes/users');

// Connect to mongoose
mongoose
  // .connect('mongodb://whiskey2wine:bacon007@ds253889.mlab.com:53889/online-form')
  // .connect('mongodb://localhost/online-form')
  // .connect('mongodb://35.198.231.158/online-form')
  .connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@35.187.255.48/online-form`)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Static folder
app.use(express.static(path.join(__dirname, '../public')));

app.use(cors());

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

// Presentation
app.get('/present', (req, res) => {
  const q = req.query;
  console.log(q);
  const num1 = q.c1 === 'true' ? 'ใช่' : 'ไม่ใช่';
  let num2;
  if (q.c5 === 'true') {
    num2 = 'น่าสนใจมาก';
  } else if (q.c4 === 'true') {
    num2 = 'พอใช้';
  } else {
    num2 = 'ไม่น่าสนใจ';
  }
  const num3 = q.c6;
  console.log(num1);
  console.log(num2);
  console.log(num3);

  fs.readFile(path.resolve(__dirname, '../data.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    }
    const file = JSON.parse(data);
    if (num1 && num2 && num3) {
      file.push({
        siit: num1,
        interest: num2,
        best: num3,
      });
    }
    const json = JSON.stringify(file);

    fs.writeFile(path.resolve(__dirname, '../data.json'), json, (error) => {
      if (error) throw error;
      console.log('The file has been saved!');
    });
    if (num1 && num2 && num3) {
      res.render('thanks', { layout: false });
    }
    res.json(file);
  });
});

app.get('/show', (req, res) => {
  fs.readFile(path.resolve(__dirname, '../data.json'), 'utf8', (err, data) => {
    if (err) throw err;
    res.render('show', {
      layout: false,
      data: JSON.parse(data),
    });
  });
});

app.get('/thanks', (req, res) => {
  res.render('thanks', {
    layout: false,
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
