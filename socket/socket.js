import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`Joined room: ${roomId}`);
      socket.to(roomId).emit("user-joined", socket.id);
    });

    socket.on("offer", ({ roomId, sdp }) => {
      socket.to(roomId).emit("offer", { sender: socket.id, sdp });
    });

    socket.on("answer", ({ roomId, sdp }) => {
      socket.to(roomId).emit("answer", { sender: socket.id, sdp });
    });

    socket.on("ice-candidate", ({ roomId, candidate }) => {
      socket.to(roomId).emit("ice-candidate", { sender: socket.id, candidate });
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
