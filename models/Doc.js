const mongoose = require('mongoose');

const { Schema } = mongoose;

// Create Scheme
const DocSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  file: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    originalname: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
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
