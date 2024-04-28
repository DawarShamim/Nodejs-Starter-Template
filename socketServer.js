
require("dotenv").config();
const jwt = require("jsonwebtoken");

const User = require('./models/User.js');

module.exports = (socketIO) => {
    socketIO.use((socket, next) => {
        // when testing with Postman
        // if (socket.handshake.query && socket.handshake.query.token) {
        // if (socket.handshake.auth && socket.handshake.auth.token) {
        //     jwt.verify(socket.handshake.auth.token, process.env.jwtEncryptionKey, (err, decoded) => {
        //         if (err) {
        //             return next(new Error('Authentication error'));
        //         }
        //         socket.userEmail = decoded.userEmail;
        //         socket.userId = decoded.userId;
        //         console.log("connected");
        //         next();
        //     });
        // }
        // else {
        //     console.log("access Denied");
        //     next(new Error('Authentication error'));
        // }
    })

        .on('connection', async (socket) => {
            console.log("user connected", socket.userId);
            const userData = await User.findByIdAndUpdate(socket.userId, { statusOnline: true, socketId: socket.id });
            // joining All rooms dedicated for each Group
            userData?.user_groups?.forEach(groupId => {
                socket.join(groupId);
            });

            socket.on('disconnect', async () => {
                console.log(`User disconnected: ${socket.id}`);
                await User.findByIdAndUpdate(socket.userId, { statusOnline: false });
            });

            socket.on('send-new-message', async (data) => {
                console.log('New-message event ', data);
                try {
                    const newConversation = new UserPrivateConversations({
                        user_id_1: data.recipient,
                        user_id_2: socket.userId,
                    });
                    const savedConversation = await newConversation.save();
                    data.conversationId = savedConversation._id;

                    const message = new Messages({
                        _id: data._id,
                        conversationId: data.conversationId,
                        sender: socket.userId,
                        recipient: data.recipient,
                        body: data.body,
                        sentAt: data.sentAt
                    });
                    await message.save();

                    const sendTo = await User.findById(data.recipient);
                    const senderResponse = await User.findById(socket.userId);

                    if (sendTo && sendTo?.socketId) {
                        socketIO.to(sendTo?.socketId).emit('receive-message', {
                            message
                        });
                    }

                    if (senderResponse && senderResponse?.socketId) {

                        socketIO.to(senderResponse?.socketId).emit('receive-new-message', {
                            conversationId: data.conversationId
                        });
                    }
                    // ack(null, { success: true, message: "Message sent Successfully" });
                } catch (error) {
                    console.error('Error saving message:', error);
                    // ack({ success: false, message: error });

                }
            });

            socket.on('send-message', async (data) => {
                console.log('send-message event ', data);
                if (data.body === '') return;

                try {
                    if (!data.conversationId || data.conversationId === "") {
                        throw new Error("Conversation not Found");
                    }
                    const message = new Messages({
                        _id: data._id,
                        conversationId: data.conversationId,
                        sender: socket.userId,
                        recipient: data.recipient,
                        body: data.body,
                        sentAt: data.sentAt
                    });
                    await message.save();

                    const sendTo = await User.findById(data.recipient);

                    if (sendTo && sendTo?.socketId) {
                        socketIO.to(sendTo?.socketId).emit('receive-message', {
                            message
                        });
                    }
                    // ack(null, { success: true, message: "Message sent Successfully" });
                } catch (error) {
                    console.error('Error sending message:', error);
                    // ack({ success: false, message: error });
                }
            });

            socket.on('send-group-message', async (data) => {
                console.log('send-group-message event ', data);
                try {
                    if (!data.groupId || data.groupId === "") {
                        throw new Error("Conversation not Found");
                    }
                    const groupMessage = new GroupMessages({
                        _id: data._id,
                        groupId: data.groupId,
                        sender: data.sender,
                        body: data.body,
                        sentAt: data.sentAt
                    });

                    await groupMessage.save();

                    socketIO.to(data.groupId).emit('receive-group-message', {
                        message: groupMessage
                    });
                    // ack(null, { success: true, message: "Message sent Successfully" });
                } catch (error) {
                    console.error('Error saving group message:', error);
                    // ack({ success: false, message: error });
                }
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
            console.log("herere at event");
            socketIO.to(socketId).emit(eventName, data);
        } else {
            console.error('Socket server is not initialized.');
        }
    }

    async function sendAttachment(isGroup, data) {
        if (isGroup) {
            console.log("Sending Group Attachment event")
            socketIO.to(data.groupId).emit('receive-group-message', {
                message: data
            });
            return;
        } else {
            console.log("Sending Private Attachment event")
            const sendTo = await User.findById(data.recipient);
            socketIO.to(sendTo?.socketId).emit('receive-message', {
                message: data
            });
            return;
        }
    }

    module.exports.socketEventEmitter = socketEventEmitter;
    module.exports.sendAttachment = sendAttachment;
};