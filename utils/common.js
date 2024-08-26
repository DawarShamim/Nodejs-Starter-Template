/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
const Session = require('../models/Session');

function successResponse(res, StatusCode, message, data = {}) {
  return res.status(StatusCode).json({ success: true, message, ...data });
}

function failureResponse(res, StatusCode, message, error = {}) {
  return res.status(StatusCode).json({ success: false, message, ...error });
};

function getDocumentTotal(totalCount) {
  return (totalCount && totalCount.length > 0) ? totalCount[0].value : 0;
};

function paginationParam(currentPage, givenPageSize) {
  page = Number(currentPage) || 1;
  pageSize = Number(givenPageSize) || 10;
  const skip = (page - 1) * pageSize;
  return { page, pageSize, skip };
};
const pagination = ({ page, totalItems, limit }) => {
  const totalPages = Math.ceil(Number(totalItems) / Number(limit));
  return {
    currentPage: Number(page),
    totalPages,
    totalItems: Number(totalItems),
    itemsPerPage: Number(limit)
  };
};


async function generateToken(req, userData, keepLoggedIn = false) {
  const jwtKey = process.env.jwtEncryptionKey;
  let expiresIn = '1d';
  if (keepLoggedIn) {
    expiresIn = '30d';
  }

  // const userAgent = uaParser(req.headers['user-agent']);
  // console.log('userAgent', userAgent);
  // const ip = req.ip;

  const sessionExpiry = new Date(Date.now() + (keepLoggedIn ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)); // 30 days or 1 day

  const session = new Session({
    userId: userData._id,
    token: null, // Will be set after generating the JWT
    expiry: sessionExpiry,
    // deviceId: 'MAC Address',
    // ip,
    // userAgent: req.headers['user-agent']
  });

  await session.save();

  const token = jwt.sign(
    {
      userId: userData._id,
      userName: userData.username,
      userRole: userData.role,
      userSession: session._id
    },
    jwtKey,
    { expiresIn }
  );

  session.token = token;
  await session.save();
  return token;
}

function generateOTP() {
  return Math.floor(100000 + (Math.random() * 900000));
}

module.exports = {
  successResponse,
  failureResponse,
  getDocumentTotal,
  pagination,
  paginationParam,
  generateToken,
  generateOTP
};