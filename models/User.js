const mongoose = require('mongoose');
const validator = require('validator');

const { Schema } = mongoose;

// Create Scheme
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 4, // should be 6 in production
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model('users', UserSchema);
