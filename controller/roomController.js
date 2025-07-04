import { v4 as uuidv4 } from "uuid";
import roomStore from "../models/roomStore.js";
import { getIO } from "../socket/socket.js";

// 방 생성: POST /room
export const createRoom = (req, res) => {
  const { ip, title, description, password, isPrivate, ownerId } = req.body;

  if (!ip) {
    return res.status(400).json({ error: "IP가 필요합니다." });
  }

  const roomId = uuidv4();
  roomStore.addRoom({
    roomId,
    ip,
    title,
    description,
    isPrivate,
    password: password || null,
    ownerId,
  });

  const io = getIO();
  io.emit("new-room-created", {
    roomId,
    ip,
    title,
    description,
    isPrivate,
    password: password || null,
    ownerId,
  });

  return res.status(201).json({ roomId });
};

// 방 삭제: DELETE /room/:roomId
export const deleteRoom = (req, res) => {
  const { roomId } = req.params;
  const { ownerId } = req.body;

  const room = roomStore.getRoomById(roomId);
  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  if (room.ownerId !== ownerId) {
    return res.status(403).json({ error: "삭제 권한이 없습니다." });
  }

  roomStore.removeRoom(roomId);

  const io = getIO();
  io.emit("room-deleted", roomId);

  return res.status(200).json({ success: true });
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
