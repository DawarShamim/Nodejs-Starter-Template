/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
const jwtEncryptionKey = process.env.jwtEncryptionKey;

function successResponse(res, message, code, data = {}) {
    return res.status(code).json({ success: true, message, data });
}

function failureResponse(res, message, code, error = {}) {
    return res.status(code).json({ success: false, message, error });
};

function getDocumentTotal(totalCount) {
    return (totalCount && totalCount.length > 0) ? totalCount[0].value : 0;
};

function paginationParam(page, pageSize) {
    page = Number(page) || 1;
    pageSize = Number(pageSize) || 10;
    const skipSize = (page - 1) * pageSize;
    return { page, pageSize, skipSize };
};

function generateToken(payload, keepMeLogin) {
    return keepMeLogin ? jwt.sign(payload, jwtEncryptionKey, { expiresIn: '7d' }) : jwt.sign(payload, jwtEncryptionKey, { expiresIn: '12h' });
}

function generateOTP() {
    return Math.floor(100000 + (Math.random() * 900000));
}

module.exports = {
    successResponse,
    failureResponse,
    getDocumentTotal,
    paginationParam,
    generateToken,
    generateOTP
};