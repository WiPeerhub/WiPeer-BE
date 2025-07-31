import dotenv from "dotenv";

dotenv.config();
import express from "express";
import cors from "cors";
import http from "http";
import ipRouter from "./routes/ip.js";
import roomRouter from "./routes/room.js";
import uploadRouter from "./routes/upload.js";
import chatRouter from "./routes/chat.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import "./config/passport.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import mongoose from "mongoose";
import { initSocket } from "./socket/socket.js";

const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB 연결 성공"))
  .catch((err) => console.error("MongoDB 연결 실패", err));

app.use(cookieParser());
app.use(passport.initialize());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

app.use("/ip", ipRouter);
app.use("/room", roomRouter);
app.use("/upload", uploadRouter);
app.use("/", chatRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);

const server = http.createServer(app);

initSocket(server);

const PORT = process.env.PORT || 4000;

app.set("trust proxy", true);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
