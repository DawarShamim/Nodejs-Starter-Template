/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
const Session = require('../../models/Session');
const uaParser = require('ua-parser-js');

function getOtp() {
  return Math.floor(1000 + (Math.random() * 9000));
};


async function generateToken(req, userData, keepLoggedIn = false) {
  const jwtKey = process.env.JWT_ENCRYPTION_KEY;
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
module.exports = { getOtp, generateToken };