const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;

const router = express.Router();

// Load User Model
require('../models/User');

const User = mongoose.model('users');

// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Check Login Middleware
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};

// User Login Route
router.get('/login', (req, res) => {
  res.redirect('/');
});

// Login Form POST
router.post('/login', (req, res, next) => {
  console.log(req.body);
  passport.authenticate('local', {
    successRedirect: '/docs',
    failureRedirect: '/',
    failureFlash: true,
  })(req, res, next);
});

// User Logout Route
router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  res.redirect('/');
});

// User Register Route
router.get('/register', (req, res) => {
  res.render('users/register', {
    specialPage: true,
    title: 'Register',
  });
});

// Register Form POST
router.post('/register', (req, res, next) => {
  console.log(req.body);
  const errors = [];

  if (req.body.inputPassword !== req.body.inputPassword2) {
    errors.push({ text: 'Passwords do not match' });
  }

  if (req.body.inputPassword.length < 4) {
    errors.push({ text: 'Password must be at least 4 characters' });
  }

  if (errors.length > 0) {
    res.render('users/register', {
      specialPage: true,
      errors,
      name: req.body.inputName,
      email: req.body.inputEmail,
      password: req.body.inputPassword,
      password2: req.body.inputPassword2,
    });
  } else {
    User.findOne({ username: req.body.inputEmail }).then((user) => {
      if (user) {
        req.flash('error_msg', 'Email already registered');
        res.redirect('/users/register');
      } else {
        User.register(
          new User({
            name: req.body.inputName,
            username: req.body.inputEmail,
          }),
          req.body.inputPassword,
          (err) => {
            if (err) {
              console.log('error while user register!', err);
              req.flash('error_msg', err.message);
              return res.redirect('/users/register');
            }
            req.flash('success_msg', 'You are now registered and can log in');
            res.redirect('/');
          },
        );
        // const newUser = new User({
        //   name: req.body.inputName,
        //   email: req.body.inputEmail,
        //   password: req.body.inputPassword,
        // });
        // bcrypt.genSalt(10, (err, salt) => {
        //   bcrypt.hash(newUser.password, salt, (err2, hash) => {
        //     if (err2) throw err2;
        //     newUser.password = hash;
        //     newUser
        //       .save()
        //       .then((user2) => {
        //         req.flash('success_msg', 'You are now registered and can log in');
        //         res.redirect('/');
        //       })
        //       .catch(err3 => console.log(err3));
        //   });
        // });
      }
    });
  }
});

module.exports = router;
