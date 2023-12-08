const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
const { success, error } = require("consola");
const { isHttpError } = require("http-errors");
const logger = require('morgan');
const path = require('path');

const app = express();
require("dotenv").config();

const DBurl = process.env.dbUrl;
const Port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

app.use('/user', require('./routes/userRoutes'));

app.use('/public', express.static(path.join(__dirname, 'public/images/uploads-1694645444247-893258167.png')));

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
    res.status(404).json({ error: "404 Not Found" });
});


async function startApp() {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(DBurl);
        console.log("Connected to the database successfully");
        app.listen(Port, () => {
            console.log("Connected to Server on Port ", Port)
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