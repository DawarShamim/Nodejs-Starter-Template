
const winston = require('winston');
require('winston-mongodb');
const mongoose = require("mongoose");

const { format } = require("winston");
const { combine, timestamp, json, errors } = winston.format;

require("dotenv").config();
// MongoDB connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const dbUrl = process.env.dbUrl;

mongoose.connect(dbUrl, options)
  .then(() => {
    console.log('Logger Connected to Database');
  })
  .catch((error) => {
    console.error('Error connecting to Database:', error);
  });


// Create a logger instance
const logger = winston.createLogger({
  level: "error",
  format: combine(
    format.errors({ stack: true }), // log the full stack
    timestamp(),
    format.metadata() // >>>> ADD THIS LINE TO STORE the ERR OBJECT IN META field
  ),
  transports: [
    new winston.transports.MongoDB({
      db: mongoose.connection, // Pass the MongoDB connection object
      options: options
    })
    // new winston.transports.File({ filename: 'logs/allLogs.log', format: winston.format.json() })
  ]
});

// function logData(key, data) {
//   try {
//     logger.info({ [key]: data });
//   } catch (err) {
//     logger.error(err);
//   }
// }

// logData()



// module.exports = { logData, logger };
module.exports = {logger};