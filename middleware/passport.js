const Session = require('../models/Session');
const User = require('../models/User');
const uaParser = require('ua-parser-js');
const { Strategy, ExtractJwt } = require('passport-jwt');
require('dotenv').config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // eslint-disable-next-line no-undef
  secretOrKey: process.env.jwtEncryptionKey,
};

module.exports = (passport) => {
  // JWT strategy
  passport.use(
    new Strategy(options, async (payload, done) => {
      try {
        const user = await User.findById(payload.userId);
        if (!user || !user.isVerified || user.status === 'inactive') {
          return done(null, false, { message: 'User not found or inactive' });
        }

        const allDetails = { ...user._doc, id: user._doc._id, sessionId: payload.sessionId };

        return done(null, allDetails);
      } catch (err) {
        // Handle errors during authentication
        return done(err, false, { message: 'Error during authentication' });
      }
    })
  );
};