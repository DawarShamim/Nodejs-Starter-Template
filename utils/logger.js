
const winston = require('winston');
require('winston-mongodb');

const { format } = require("winston");
const { combine, timestamp, json, errors } = winston.format;

const options = {
  db: process.env.dbUrl,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
};

// Create a logger instance
const logger = winston.createLogger({
  level: "error",
  format: combine(
    format.errors({ stack: true }), // log the full stack
    timestamp(), // get the time stamp part of the full log message
    format.metadata() // >>>> ADD THIS LINE TO STORE the ERR OBJECT IN META field
  ),
  transports: [
    new winston.transports.MongoDB(options),
    new winston.transports.File({ filename: 'logs/allLogs.log', format: winston.format.json() })
  ]
});

function logData(key, data) {
  try {
    console.log("data");
    logger.info({ [key]: data });
    console.lop(aa._id);
  } catch (err) {
    logger.error(err);
  }
}

logData()



module.exports = {  logData };