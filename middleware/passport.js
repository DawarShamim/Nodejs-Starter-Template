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
    passport.use(
        new Strategy(options, async (payload, done) => {
            try {
                const user = await User.findById(payload.userId);
                if (!user) {
                    return done(null, false);
                }
                user.sessionId = payload.userSession;
                return done(null, user);
            } catch (err) {
                return done(err, false);
            }
        })
    );
};    