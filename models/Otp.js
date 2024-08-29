const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
    required: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: '5m',
    default: Date.now
  }
}, {
  timestamps: true
});


const Otp = mongoose.model('Otp', otpSchema);
module.exports = Otp;

