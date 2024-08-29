const OtpModel = require('../models/Otp');
const { logger } = require('../utils/logger');

exports.setOtp = async (userId) => {
  try {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + (Math.random() * 900000)).toString();

    const newOtp = await OtpModel.findOneAndUpdate(
      { userId },
      { otp },
      { new: true, upsert: true }
    );

    return { newOtp, error: null };
  } catch (error) {
    logger.error(error);
    return { newOtp: null, error };
  }
};