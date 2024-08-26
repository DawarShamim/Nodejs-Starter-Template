/* eslint-disable no-console */
/* eslint-disable no-undef */

require('dotenv').config();
const jwt = require('jsonwebtoken');

const User = require('./models/User.js');

module.exports = (socketIO) => {
  socketIO.use((socket, next) => {
    // when testing with Postman
    // if (socket.handshake.query && socket.handshake.query.token) {
    if (socket.handshake.auth && socket.handshake.auth.token) {
      jwt.verify(socket.handshake.auth.token, process.env.jwtEncryptionKey, (err, decoded) => {
        if (err) {
          return next(new Error('Authentication error'));
        }
        socket.userEmail = decoded.userEmail;
        socket.userId = decoded.userId;
        next();
      });
    }
    else {
      console.log('access Denied');
      next(new Error('Authentication error'));
    }
  })

    .on('connection', async (socket) => {
      console.log('user connected', socket.userId);
      const userData = await User.findByIdAndUpdate(socket.userId, { statusOnline: true, socketId: socket.id });
      // joining All rooms dedicated for each Group
      userData?.user_groups?.forEach(groupId => {
        socket.join(groupId);
      });

      socket.on('disconnect', async () => {
        console.log(`User disconnected: ${socket.id}`);
        await User.findByIdAndUpdate(socket.userId, { statusOnline: false });
      });

      socket.on('emit-typing', async (data) => {
        if (!data.conversationId) {
          return;
        }
        try {
          const sendTo = await User.findById(data.recipient);

          if (sendTo && sendTo?.socketId) {
            socketIO.to(sendTo?.socketId).emit('listen-typing', {
              conversationId: data.conversationId,
              sender: socket.userId,
              typing: true
            });
          }
        } catch (error) {
          console.error('Error saving message:', error);
        }
      });
    });

  function socketEventEmitter(eventName, socketId, data) {
    if (socketIO) {
      console.log('Emitting event');
      socketIO.to(socketId).emit(eventName, data);
    } else {
      console.error('Socket server is not initialized.');
    }
  }

  module.exports.socketEventEmitter = socketEventEmitter;
};