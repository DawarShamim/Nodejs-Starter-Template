
const User = require('../models/User');
const { successResponse, failureResponse } = require('../utils/common');
const { generateToken } = require('../utils/helpers/common');
const { logData } = require('../utils/logger');
const bcrypt = require('bcryptjs');

require('dotenv').config();

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).select('username password');

    if (!user) { return failureResponse(res, 404, 'User not found'); }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) { return failureResponse(res, 401, 'Invalid password'); }

    const token = await generateToken(user, req);
    return successResponse(res, 200, 'Login successful', token);
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const { username, password, confirmPassword } = req.body;
    if (password !== confirmPassword) { return failureResponse(res, 400, 'Both Passwords should be same'); }

    let newUser = await User.findOne({ username });

    if (!newUser) {
      newUser = new User({
        username,
        password,
        role: 'Anonymous'
      });

      await newUser.save();

      // verify  the account by sending a verification email to the registered Email ID of the user
      // business logic to be added
      const token = await generateToken(req, newUser);

      return successResponse(res, 200, 'Signup successful', token);
    } else {
      return failureResponse(res, 409, 'Username not available');
    }
  } catch (err) {
    next(err);
  }
};
