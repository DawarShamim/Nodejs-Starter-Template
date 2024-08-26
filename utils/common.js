/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
const jwtEncryptionKey = process.env.jwtEncryptionKey;

function successResponse(res, StatusCode, message, data = {}) {
  return res.status(StatusCode).json({ success: true, message, data });
}

function failureResponse(res, StatusCode, message, error = {}) {
  return res.status(StatusCode).json({ success: false, message, error });
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
  pagination,
  paginationParam,
  generateToken,
  generateOTP
};