
const { SocketEvent } = require('../constants');
const notificationModel = require('../models/Notification');
const { socketEventEmitter } = require('../socketServer');
const { logger } = require('../utils/logger');

exports.createNotification = async ({ userId, title, message, route = null, routeId = null, }) => {
  try {
    const newNotification = new notificationModel({
      userId,
      title,
      message,
      route,
      routeId,
    });
    await newNotification.save({});
    
    return true;
  } catch (err) {
    logger.error(err);
    return false;
  }
};
