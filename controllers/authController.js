
// eslint-disable-next-line no-undef
const secretKey = process.env.jwtEncryptionKey;
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const { successResponse, failureResponse } = require('../utils/common');

exports.verifyEmail = async (req, res, next) => {
  try {
    const token = req.params.token;

    if (!token) { return failureResponse(res, 400, 'Invalid Parameters'); }

    const decoded = jwt.verify(token, secretKey);

    if (!decoded) { return failureResponse(res, 412, 'Invalid Token'); }

    const existingUser = await UserModel.findById(decoded.userId);
    if (existingUser && existingUser.otp === decoded.otp) { return failureResponse(res, 403, 'Failed to authenticate.'); }

    if (existingUser.otpExpiry <= Date.now()) {
      await UserModel.findOneAndUpdate(
        { _id: decoded._id },
        { isVerified: true, otp: null, otpExpiry: null },
        { new: true, runValidators: true }
      );
      return failureResponse(res, 422, 'OTP Expired');
    }

    return successResponse(res, 201, 'Email Verified');
  
  } catch (err) {
    next(err);

  }
};
