/* eslint-disable no-undef */

const winston = require('winston');
require('winston-mongodb');

const { format } = require('winston');
const { combine, timestamp } = winston.format;

require('dotenv').config();

const options = {
  db: process.env.dbUrl,
  // options: { useNewUrlParser: true, useUnifiedTopology: true }
  options: { useUnifiedTopology: true }
};


// Create a logger instance
const logger = winston.createLogger({
  level: 'error',
  format: combine(
    format.errors({ stack: true }), // log the full stack
    timestamp(),
    format.metadata() // >>>> ADD THIS LINE TO STORE the ERR OBJECT IN META field
  ),
  transports: [
    new winston.transports.MongoDB(options)
    // ,new winston.transports.File({ filename: 'logs/allLogs.log', format: winston.format.json() })
  ]
});


module.exports = { logger };