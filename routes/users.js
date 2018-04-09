const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const router = express.Router();

// Load User Model
require('../models/User');

const User = mongoose.model('users');

// User Login Route
router.get('/login', (req, res) => {
  res.redirect('/');
});

// User Register Route
router.get('/register', (req, res) => {
  res.render('users/register', {
    specialPage: true,
    title: 'Register',
  });
});

// Login Form POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true,
  })(req, res, next);
});

// Register Form POST
router.post('/register', (req, res) => {
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
    User.findOne({ email: req.body.inputEmail }).then((user) => {
      if (user) {
        req.flash('error_msg', 'Email already registered');
        res.redirect('/users/register');
      } else {
        const newUser = new User({
          name: req.body.inputName,
          email: req.body.inputEmail,
          password: req.body.inputPassword,
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err2, hash) => {
            if (err2) throw err2;
            newUser.password = hash;
            newUser
              .save()
              .then((user2) => {
                req.flash('success_msg', 'You are now registered and can log in');
                res.redirect('/');
              })
              .catch(err3 => console.log(err3));
          });
        });
      }
    });
  }
});

module.exports = router;
