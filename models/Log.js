const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  level: String,
  message: String,
  timestamp: Date,
  metadata: Object // Store additional metadata, such as the error object
}, { collection: 'log' });

// Create a Mongoose model for the log collection
const log = mongoose.model('log', logSchema);
module.exports = log;