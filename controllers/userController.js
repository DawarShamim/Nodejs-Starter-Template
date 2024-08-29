
const UserModel = require('../models/User');
const { successResponse, failureResponse, paginationParam, getDocumentTotal, pagination } = require('../utils/common');
const { generateToken } = require('../utils/common');
const sendEmail = require('../services/sendEmail');
const bcrypt = require('bcryptjs');
const otpController = require('./otpController');
const { userNotFound, emailSub, emailTemplate, SUCCESS } = require('../constants');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

// eslint-disable-next-line no-undef
const EncryptionKey = process.env.jwtEncryptionKey;
// eslint-disable-next-line no-undef
const backend_url = process.env.BACKEND_URL;

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username }).select('username password');

    if (!user) { return failureResponse(res, 404, 'User not found'); }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) { return failureResponse(res, 401, 'Invalid password'); }

    const token = await generateToken(req, user);
    return successResponse(res, 200, 'Login successful', { token });
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { username, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) { return failureResponse(res, 400, 'Both Passwords should be same'); }

    let newUser = await UserModel.findOne({ username }).session(session);

    if (newUser) { return failureResponse(res, 409, 'Username not available'); }

    newUser = new UserModel({
      username,
      password,
      email,
      role: 'Anonymous'
    });

    await newUser.save({ session });
    const { newOtp, error } = await otpController.setOtp(newUser._id);

    if (error || !newOtp) { throw error; }

    const verificationToken = jwt.sign(
      {
        userId: newUser._id,
        otp: newOtp.otp,
      },
      EncryptionKey,
    );

    const verificationLink = `${backend_url}user/verifyEmail?token=${verificationToken}`;

    await sendEmail(newUser.email, emailSub.VERIFY_EMAIL, emailTemplate.VERIFY_EMAIL, { firstName: 'hello', verificationLink });

    const token = await generateToken(req, newUser);
    await session.commitTransaction();
    session.endSession();

    return successResponse(res, 200, SUCCESS, { token });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const userDetails = await UserModel.findOne({ email });

    if (!userDetails) { return failureResponse(res, 404, userNotFound); }

    const { newOtp, error } = await otpController.setOtp(userDetails._id);

    if (error || !newOtp) { throw error; }

    await sendEmail(email, emailSub.RESET_PASSWORD, emailTemplate.RESET_PASSWORD, { otp: newOtp.otp });

    return successResponse(res, 200, SUCCESS);
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const { page, pageSize, skip } = paginationParam(req.query.page, req.query.pageSize);

    const [result] = await UserModel.aggregate([
      {
        '$facet': {
          documents: [{ $skip: skip }, { $limit: pageSize }],
          totalCount: [{ $count: 'value' }]
        }
      }
    ]);

    const { documents, totalCount } = result;
    const totalItems = getDocumentTotal(totalCount);
    const paginated = pagination({ page, totalItems, limit: pageSize });

    return successResponse(res, 200, SUCCESS, { documents, paginated });


  } catch (err) {
    next(err);
  }
};