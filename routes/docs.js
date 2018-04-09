const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Load Doc Model
require('../models/Doc');

const Doc = mongoose.model('docs');

router.get('/', (req, res) => {
  Doc.find({})
    .sort({ date: 'desc' })
    .then((docs) => {
      res.render('docs/index', {
        docs,
      });
    });
});

module.exports = router;
