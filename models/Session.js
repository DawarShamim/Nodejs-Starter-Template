const { MAX_ACTIVE_SESSIONS } = require('../constants');
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    // required: true
  },
  expiry: {
    type: Date,
    required: true
  },
  socketId: {
    type: String,
    // required: true
  },
  // deviceId: {
  //   type: String,
  //   required: true
  // },
  // deviceType: {
  //   type: String,
  //   required: true
  // },
}, {
  timestamps: true
});

sessionSchema.pre('save', async function (next) {

  const latestSessions = await Session.find({ userId: this.userId, activeStatus: true })
    .sort({ createdAt: -1 })
    .limit(MAX_ACTIVE_SESSIONS)
    .select('_id');

  const latestSessionIds = latestSessions.map(session => session._id);
  await Session.updateMany(
    { userId: this.userId, activeStatus: true, _id: { $nin: latestSessionIds } },
    { $set: { activeStatus: false } }
  );
  next();
});


const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;
