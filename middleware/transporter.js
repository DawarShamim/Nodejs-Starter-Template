/* eslint-disable no-undef */
const nodemailer = require('nodemailer');

const nodeMailerTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  }
});

module.exports = { nodeMailerTransporter };