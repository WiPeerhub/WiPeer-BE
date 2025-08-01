import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { saveMessage, getMessages } from "../models/chatStore.js";
import { pub, sub } from "../config/redisPubSub.js";

let io;

sub.psubscribe("chat:*");

sub.on("pmessage", (pattern, channel, messageStr) => {
  if (!channel || !messageStr) return;

  const roomId = channel.split(":")[1];
  const messageObj = JSON.parse(messageStr);

  io.to(roomId).emit("new-message", messageObj);
});

export const initSocket = async (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  const redisHost = process.env.REDIS_HOST;
  const redisPort = Number(process.env.REDIS_PORT);

  const pubClient = createClient({
    socket: { host: redisHost, port: redisPort },
  });
  const subClient = pubClient.duplicate();

  await pubClient.connect();
  await subClient.connect();

  io.adapter(createAdapter(pubClient, subClient));

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("join-room", async (roomId) => {
      socket.join(roomId);

      const clientsInRoom = Array.from(
        io.sockets.adapter.rooms.get(roomId) || []
      );
      const otherUsers = clientsInRoom.filter((id) => id !== socket.id);

      socket.emit("all-users", otherUsers);

      const history = await getMessages(roomId);
      socket.emit("chat-history", history);

      socket.to(roomId).emit("user-joined", socket.id);
    });

    socket.on("chat-message", async ({ roomId, messageObj }) => {
      await saveMessage(roomId, messageObj);
      await pub.publish(`chat:${roomId}`, JSON.stringify(messageObj));
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
