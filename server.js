const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
const { success, error, info } = require("consola");
const { isHttpError } = require("http-errors");
const morganLogger = require('morgan');
const path = require('path');
const passport = require("passport");
const { logger } = require("./utils/logger");


const basicAuth = require('express-basic-auth');
const logsModel = require("./models/Log")

const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig');

const Authentication = require("./Auth");
const app = express();
const internalApp = express();

require("dotenv").config();

const http = require('http').Server(app);
const internalHttp = require('http').Server(internalApp);

const internalUsers = {
    'Dawar2001': process.env.AuthPassword
};

const authMiddleware = basicAuth({
    users: internalUsers,
    challenge: true, // Sends a 401 Unauthorized response if authentication fails
    unauthorizedResponse: { message: 'Unauthorized access' }
});


internalApp.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

internalApp.get('/errorLog', authMiddleware, async (req, res) => {
    try {
        const page = req.query.page || 1;
        const pageSize = req.query.pageSize || 10;
        const skipSize = (page - 1) * pageSize;
        let sortOrder = -1;

        if (req.query.sort === 'asc') { sortOrder = 1; }
        logger.info("acessing logs");
        const allLogs = await logsModel.find({ level: "error" })
            .skip(skipSize)
            .limit(pageSize)
            .sort({ 'timestamp': sortOrder }
            );

        return res.status(200).json({ success: true, message: 'Logs retrieved', allLogs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, err })
    }
});

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
const InternalPort = process.env.InternalPort || 5000;

app.use(morganLogger('dev'));
app.use(express.json());

const socketServer = require("./socketServer");

app.use('/user', require('./routes/userRoutes'));

app.use('/public/', express.static(path.join(__dirname, 'public')));
app.use('/private/', Authentication, express.static(path.join(__dirname, 'private')));


socketServer(socketIO);

app.use((error, req, res, next) => {
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
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
        internalHttp.listen(InternalPort, () => {
            info(`Documentation available at http://localhost:${InternalPort}/api-docs`)
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