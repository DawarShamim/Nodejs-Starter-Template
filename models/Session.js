const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        // required: true
    },
    expiry: {
        type: Date,
        required: true
    },
    socketId: {
        type: String,
        // required: true
    },
    deviceId: {
        type: String,
        required: true
    },
    deviceType: {
        type: String,
        required: true
    },
    activeStatus: {
        type: Boolean,
        default: true
    },

}, {
    timestamps: true
});

const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;

