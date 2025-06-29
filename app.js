import express from "express";
import cors from "cors";
import http from "http";
import ipRouter from "./routes/ip.js";
import roomRouter from "./routes/room.js";
import { initSocket } from "./socket/socket.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/ip", ipRouter);
app.use("/room", roomRouter);

const server = http.createServer(app);

initSocket(server);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
