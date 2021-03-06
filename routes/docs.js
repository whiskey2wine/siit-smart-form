const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const crypto = require('crypto');
const path = require('path');

const router = express.Router();

// Load Doc Model
require('../models/Doc');

// Get Mongo Connection
const conn = mongoose.connection;

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine
const storage = GridFsStorage({
  // url: 'mongodb://whiskey2wine:bacon007@ds253889.mlab.com:53889/online-form',
  // url: 'mongodb://localhost/online-form',
  // url: 'mongodb://35.198.231.158/online-form',
  url: `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@35.187.255.48/online-form`,
  file: (req, file) =>
    new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename,
          bucketName: 'uploads',
        };
        resolve(fileInfo);
      });
    }),
});

// Set Storage Engine
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './public/uploads');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
//   },
// });

// Check File Type
const imageFilter = function (req, file, cb) {
  // Allowed ext
  const filetypes = /jpg|jpeg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check MIME
  const mimeType = filetypes.test(file.mimetype);

  if (!mimeType || !extname) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Init Upload
const upload = multer({
  storage,
  limits: {
    fileSize: 10000000, // 10MB
  },
  fileFilter: (req, file, cb) => {
    imageFilter(req, file, cb);
  },
}).single('file-picker');

/**
 * Check Login Middleware
 * Add to every route that need to be logged in
 * Need to handle approver that doesn't have an account
 */

// const isLoggedIn = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect('/');
// };

const Doc = mongoose.model('docs');

router.get('/', (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
  Doc.find({ creator: req.user.id })
    .sort({ date: 'desc' })
    .then((docs) => {
      res.render('docs/index', {
        docs,
        user: req.user,
      });
    });
});

router.get('/edit/:id', (req, res) => {
  Doc.findOne({ creator: req.user.id, _id: req.params.id })
    .then((doc) => {
      res.render('docs/edit', {
        user: req.user,
        doc,
        edit: true,
      });
    })
    .catch((e) => {
      console.log(e);
      res.redirect('/');
    });
});

// http://localhost:3000/docs/filling/5b2a4c44e456300d4b0631b0/survey
router.get('/filling/:id/:appr', (req, res) => {
  Doc.findOne({ _id: req.params.id })
    .then((doc) => {
      if (doc.approvers.includes(req.params.appr)) {
        res.render('docs/edit', {
          doc,
        });
      } else {
        res.redirect('/');
      }
    })
    .catch((e) => {
      console.error(e);
      res.redirect('/');
    });
});

router.get('/get/:id', (req, res) => {
  Doc.findOne({ _id: req.params.id })
    .then((doc) => {
      console.log(doc);
      res.json({
        approvers: doc.approvers,
        delimiter: doc.delimiter,
        formType: doc.formType,
        obj: doc.obj,
        title: doc.title,
        url: doc.url,
      });
    })
    .catch((e) => {
      console.log(e);
    });
});

router.put('/save/:id', (req, res) => {
  console.log(req);
  Doc.findOneAndUpdate(
    { creator: req.user.id, _id: req.params.id },
    {
      $set: {
        formType: req.body.formType,
        approvers: req.body.approvers,
        obj: req.body.obj,
        url: req.body.url,
      },
    },
    {
      new: true,
    },
    (err, doc) => {
      if (err) {
        console.error(err);
      }
      res.send(doc);
    },
  );
});

router.delete('/:id', (req, res) => {
  Doc.findOneAndRemove({
    _id: req.params.id,
  }).then((doc) => {
    gfs.remove({ _id: doc.file.filename, root: 'uploads' }, (err, gridStore) => {
      if (err) {
        return res.status(404).json({ err });
      }
      res.redirect('/docs');
    });
  });
});

router.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      // res.send(err.message);
      // res.render('docs/index', err);
      res.redirect('/docs');
    } else {
      res.json({
        id: req.file.id,
        filename: req.file.filename,
        type: req.file.mimetype,
        originalname: req.file.originalname,
        size: req.file.size,
      });
    }
  });
});

router.post('/add', (req, res) => {
  // const approvers = Object.entries(req.body)
  //   .filter(val => val[0].substr(0, 4) === 'appr')
  //   .map(val => val[1]);

  const newDoc = {
    title: req.body.title,
    creator: req.user.id,
    file: {
      _id: req.body.id,
      originalname: req.body.originalname,
      filename: req.body.filename,
    },
    // approvers,
    // formType: req.body.formType ? 'Survey' : 'Form',
  };

  new Doc(newDoc).save().then((doc) => {
    console.log(doc);
    res.redirect(`/docs/edit/${doc.id}`);
  });
});

router.delete('/image/:id', (req, res) => {
  gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err });
    }
    res.send();
  });
});

router.get('/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists.',
      });
    }
    // Allowed ext
    const filetypes = /jpg|jpeg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.filename).toLowerCase());
    // Check MIME
    const mimeType = filetypes.test(file.contentType);

    if (!mimeType || !extname) {
      return res.status(404).json({
        err: 'Not an image',
      });
    }
    // Read output to browser
    const readstream = gfs.createReadStream(file.filename);
    readstream.pipe(res);
  });
});

module.exports = router;
