import { Server } from "socket.io";
import { saveMessage, getMessages } from "./chatStore.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`${socket.id} joined room: ${roomId}`);

      const clientsInRoom = Array.from(
        io.sockets.adapter.rooms.get(roomId) || []
      );
      const otherUsers = clientsInRoom.filter((id) => id !== socket.id);

      socket.emit("all-users", otherUsers);

      const history = getMessages(roomId);
      socket.emit("chat-history", history);

      socket.to(roomId).emit("user-joined", socket.id);
    });

    socket.on("chat-message", ({ roomId, messageObj }) => {
      saveMessage(roomId, messageObj);
    });

    socket.on("offer", ({ target, sdp }) => {
      io.to(target).emit("offer", { sender: socket.id, sdp });
    });

    socket.on("answer", ({ target, sdp }) => {
      io.to(target).emit("answer", { sender: socket.id, sdp });
    });

    socket.on("ice-candidate", ({ target, candidate }) => {
      io.to(target).emit("ice-candidate", { sender: socket.id, candidate });
    });

    socket.on("leave-room", (roomId) => {
      socket.leave(roomId);
      socket.to(roomId).emit("user-left", socket.id);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

export const getIO = () => io;
