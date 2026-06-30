const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/Chat");

const getSecreteRoomId = (fromUserId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([fromUserId, targetUserId].sort().join("-"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, fromUserId, targetUserId }) => {
      const roomId = getSecreteRoomId(fromUserId, targetUserId);
      socket.join(roomId); //join the room id
    });

    socket.on(
      "sendMessage",
      async ({ firstName, fromUserId, targetUserId, text }) => {
        try {
          const roomId = getSecreteRoomId(fromUserId, targetUserId);
          let chat = await Chat.findOne({
            participants: { $all: [fromUserId, targetUserId] },
          });
          if (!chat) {
            chat = new Chat({
              participants: [fromUserId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: fromUserId,
            text,
          });

          await chat.save();
          io.to(roomId).emit("reciveMessage", { firstName, text });
        } catch (err) {
          console.log(err);
        }
      },
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
