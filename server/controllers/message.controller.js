import Conversation from "../dataBase/models/conversation.model.js";
import Message from "../dataBase/models/message.model.js";

const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status: status,
    message,
    data,
  });
};

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation)
      await Conversation.create({
        participants: [senderId, receiverId],
      });
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });
    if (newMessage) conversation.messages.push(newMessage._id);
    await Promise.all([conversation.save(), newMessage.save()]);

    //Implement socket.io for real time data transfer.
    return handleResponse(res, 200, "message sent", newMessage);
  } catch (error) {
    console.log(error);
    return handleResponse(res, 500, "something went wrong", error);
  }
};

export const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    const messages = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    })
      .sort({ createdAt: -1 })
      .populate("Message");

    if (!messages)
      return handleResponse(res, 404, "messages not found in these users");
    return handleResponse(res, 200, "fetched all messages", messages);
  } catch (error) {
    console.log(error);
    return handleResponse(res, 500, "something went wrong", error);
  }
};
