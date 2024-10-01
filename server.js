/* eslint-disable no-undef */
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { isHttpError } = require('http-errors');
const morganLogger = require('morgan');
const path = require('path');
const passport = require('passport');
const { logger } = require('./utils/logger');

const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig');

const Authentication = require('./Auth');
const app = express();

require('dotenv').config();

const http = require('http').Server(app);

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const redisAdapter = require('socket.io-redis');

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use(cors({
  origin: process.env.CORS
}));

const socketIO = require('socket.io')(http, {
  cors: {
    origin: process.env.CORS
  }
});

require('./middleware/passport')(passport);
app.use(passport.initialize());

const DBurl = process.env.dbUrl;
const Port = process.env.PORT || 3000;

app.use(morganLogger('dev'));
app.use(express.json());

const socketServer = require('./socketServer');

app.use('/api', require('./routes/index'));

app.use('/public/', express.static(path.join(__dirname, 'public')));
app.use('/private/', Authentication, express.static(path.join(__dirname, 'private')));


socketServer(socketIO);

app.use((error, req, res, next) => {
  let errorMessage = 'An unknown error occurred';
  let statusCode = 500;
  // eslint-disable-next-line no-console
  console.error(error);
  logger.error(error);
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

//For Unknown Endpoints
app.all('*', (req, res) => {
  res.status(404).json({ success: false, message: 'URL not found', error: '404 Not Found' });
});

let retryCount = 0;
async function startApp() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(DBurl);
    success('Connected to the database successfully');
    if (cluster.isPrimary) {
      // eslint-disable-next-line no-console
      console.log(`Primary ${process.pid} is running`);

      // Fork workers.
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker, code, signal) => {
        // eslint-disable-next-line no-console
        console.log(`Worker ${worker.process.pid} died\ncode: ${code}\nsignal: ${signal}`);
        cluster.fork(); // Restart the worker if it dies
      });
    } else {

      // socketIO.adapter(redisAdapter({ host: 'localhost', port: 6379 })); // Replace with your Redis server details

      http.listen(Port, () => {
        start('Connected to Server on Port', Port, process.pid);
      });
    }

    // in case of cluster removal uncomment below lines
    // http.listen(Port, () => {
    //   success('Connected to Server on Port', Port);
    //   info(`Documentation available at http://localhost:${Port}/api-docs`);
    // });
  } catch (err) {
    if (retryCount < 3) {
      console.error(`Unable to connect with the database: ${err.message}`);
      retryCount++;
      startApp();
    } else {
      console.error('Failed to start the application after 3 attempts. Exiting...');
    }
  };
};
startApp();