const mongoose = require('mongoose');

const { Schema } = mongoose;

// Create Scheme
const DocSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  creator: {
    type: String,
    required: true,
  },
  file: {
    // type: String, // if Buffer doesn't work then put img url here
    type: Buffer, // try to save picture in MongoDB
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  delimeter: {
    open: {
      type: String,
      default: '${',
    },
    close: {
      type: String,
      default: '}',
    },
  },
  obj: [
    {
      id: String,
      posX: Number,
      posY: Number,
      users: Array,
      types: String,
      created: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

mongoose.model('docs', DocSchema);
