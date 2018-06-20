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
  delimiter: {
    open: {
      type: String,
      default: '${',
    },
    close: {
      type: String,
      default: '}',
    },
  },
  url: {
    type: String,
  },
  formType: {
    type: String,
  },
  approvers: {
    type: Array, // all approvers in the document
  },
  obj: [
    {
      approver: String, // selected approver for each component
      no: Number,
      placeholder: String,
      position: {
        x: Number,
        y: Number,
      },
      types: String,
      value: String,
      created: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

mongoose.model('docs', DocSchema);
