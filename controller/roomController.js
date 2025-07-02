import { v4 as uuidv4 } from "uuid";
import roomStore from "../models/roomStore.js";
import { getIO } from "../socket/socket.js";

// 방 생성: POST /room
export const createRoom = (req, res) => {
  const { ip, title, description, password } = req.body;

  if (!ip) {
    return res.status(400).json({ error: "IP가 필요합니다." });
  }

  const roomId = uuidv4();
  roomStore.addRoom({
    roomId,
    ip,
    title,
    description,
    password: password || null,
  });

  const io = getIO();
  io.emit("new-room-created", {
    roomId,
    ip,
    title,
    description,
    password: password || null,
  });

  console.log(roomId, ip, title, description, password);
  return res.status(201).json({ roomId });
};

// 방 목록 조회: GET /room?ip=xxx.xxx.xxx.xxx
export const getRoomsByIP = (req, res) => {
  const ip = req.query.ip;

  if (!ip) {
    return res.status(400).json({ error: "IP가 필요합니다." });
  }

  const rooms = roomStore.getRoomsByIP(ip);
  return res.json({ rooms });
};
