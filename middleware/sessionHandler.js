// const Session = require('../models/Session');
// const User = require('../models/User');
// const uaParser = require('ua-parser-js');

// const sessionHandler = () => {
//     return (req, res, next) => {
//         const userAgentString = req.headers['user-agent'];
//         const userAgent = uaParser(userAgentString);

//         // Example validation: Ensure user agent contains necessary fields
//         if (!userAgent.browser.name || !userAgent.os.name) {
//             return res.status(400).json({ message: 'Invalid user-agent details' });
//         }

//         req.userAgent = userAgent; // Attach parsed user-agent to request object
//         next();
//     }

// };


// middleware/sessionHandler.js
const SessionModel = require('../models/Session');
const { failureResponse } = require('../utils/common');

function sessionHandler() {
  return async (req, res, next) => {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const session = await SessionModel.findById(req.user.sessionId).select('expiry activeStatus');
    if (!session || !session.activeStatus) {
      return failureResponse(res, 440, 'session expired');
    };
    if (session && session.expiry && session.expiry < currentTimestamp) {
      await SessionModel.findByIdAndUpdate(req.user.sessionId, { activeStatus: false });
      return failureResponse(res, 440, 'session expired');
    };
    next();
  };
};

module.exports = sessionHandler;
