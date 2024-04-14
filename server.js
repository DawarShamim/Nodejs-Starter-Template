const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
const { success, error,  info } = require("consola");
const { isHttpError } = require("http-errors");
const logger = require('morgan');
const path = require('path');
const passport = require("passport");

const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig');


const Authentication = require("./Auth");
const app = express();
const swaggerApp = express();

require("dotenv").config();


const http = require('http').Server(app);
const swaggerHttp = require('http').Server(swaggerApp);


swaggerApp.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

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
const SwaggerPort = process.env.SwaggerPort || 5000;

app.use(logger('dev'));
app.use(express.json());

const socketServer = require("./socketServer");

app.use('/user', require('./routes/userRoutes'));

app.use('/public/', express.static(path.join(__dirname, 'public')));
app.use('/private/', Authentication, express.static(path.join(__dirname, 'private')));

socketServer(socketIO);

app.use((error, req, res, next) => {
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
    console.error("for unknown error", error);
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});

//For Unknown Endpoints
app.all("*", (req, res) => {
    res.status(404).json({ success: false, message: "URL not found", error: "404 Not Found" });
});

async function startApp() {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(DBurl);
        success("Connected to the database successfully");
        http.listen(Port, () => {
            success("Connected to Server on Port", Port)
        })
        swaggerHttp.listen(SwaggerPort, () => {
            info(`Documentation available at http://localhost:${SwaggerPort}/api-docs`)
        })
    } catch (err) {
        error({
            message: `Unable to connect with the database: ${err.message}`,
            badge: true,
        });
        startApp();
    }
};

startApp();