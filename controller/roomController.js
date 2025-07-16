import { v4 as uuidv4 } from "uuid";
import roomStore from "../models/roomStore.js";
import { getIO } from "../socket/socket.js";

export const createRoom = async (req, res) => {
  const { ip, title, description, password, isPrivate, ownerId, wifiId } =
    req.body;

  if (!ownerId) {
    return res.status(400).json({ error: "ownerId가 필요합니다." });
  }

  const roomId = uuidv4();
  await roomStore.addRoom({
    roomId,
    ip,
    title,
    description,
    isPrivate,
    password: password || null,
    ownerId,
    wifiId,
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
    wifiId,
  });

  return res.status(201).json({ roomId });
};

// 방 삭제
export const deleteRoom = async (req, res) => {
  const { roomId, ownerId } = req.params;
  console.log("roomId", roomId);
  console.log("ownerId", ownerId);

  const room = await roomStore.getRoomById(roomId, ownerId);
  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  if (room.ownerId !== ownerId) {
    return res.status(403).json({ error: "삭제 권한이 없습니다." });
  }

  await roomStore.removeRoom(roomId, ownerId);

  const io = getIO();
  io.emit("room-deleted", roomId);

  return res.status(200).json({ success: true });
};

export const getRoomsByIP = async (req, res) => {
  const ip = req.query.ip;
  console.log(ip);
  if (!ip) {
    return res.status(400).json({ error: "IP가 필요합니다." });
  }

  const rooms = await roomStore.getRoomsByIP(ip);
  return res.json({ rooms });
};

export const getUserVisitedRooms = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "userId가 필요합니다." });
  }

  const rooms = await roomStore.getUserRooms(userId);
  return res.json({ rooms });
};

export const updateRoomIP = async (req, res) => {
  const { ownerId, roomId } = req.params;
  const { ip } = req.body;

  if (!ownerId || !roomId || !ip) {
    return res.status(400).json({ error: "ownerId, roomId, ip가 필요합니다." });
  }

  const updatedRoom = await roomStore.updateRoomIPIfChanged(
    roomId,
    ownerId,
    ip
  );
  if (!updatedRoom) {
    return res.status(404).json({ error: "Room not found or unchanged." });
  }

  const io = getIO();
  io.emit("room-ip-updated", { updatedRoom });

  return res.json({ room: updatedRoom });
};

export const recordRoomVisit = async (req, res) => {
  const { ownerId, roomId } = req.params;
  const { userId } = req.body;

  if (!ownerId || !roomId || !userId) {
    return res
      .status(400)
      .json({ error: "ownerId, roomId, userId가 필요합니다." });
  }

  await roomStore.addRoomVisitor(roomId, ownerId, userId);

  const io = getIO();
  io.emit("room-visited", { roomId, userId });

  return res.status(200).json({ success: true });
};

export const getRoomDetail = async (req, res) => {
  const { ownerId, roomId } = req.params;

  if (!ownerId || !roomId) {
    return res.status(400).json({ error: "ownerId와 roomId가 필요합니다." });
  }

  try {
    const room = await roomStore.getRoomById(roomId, ownerId);

    if (!room) {
      return res.status(404).json({ error: "해당 방을 찾을 수 없습니다." });
    }

    return res.status(200).json({ room });
  } catch (error) {
    console.error("getRoomDetail error:", error);
    return res.status(500).json({ error: "서버 에러가 발생했습니다." });
  }
};

export const getRoomByRoomIdOnly = async (req, res) => {
  const { roomId } = req.params;
  console.log("roomID:", roomId);

  if (!roomId) {
    return res.status(400).json({ error: "roomId가 필요합니다." });
  }

  console.log(roomId);

  const allRooms = await roomStore.getAllRooms();
  const targetRoom = allRooms.find((room) => room.roomId === roomId);

  if (!targetRoom) {
    return res.status(404).json({ error: "Room not found" });
  }

  return res.json({ room: targetRoom });
};

export const getRoomsByOwner = async (req, res) => {
  const { ownerId } = req.params;

  console.log("ownerID", ownerId);

  if (!ownerId) {
    return res.status(400).json({ error: "ownerId가 필요합니다." });
  }

  try {
    const rooms = await roomStore.getRoomsByOwner(ownerId);
    return res.status(200).json({ rooms });
  } catch (error) {
    console.error("getRoomsByOwner error:", error);
    return res.status(500).json({ error: "서버 에러가 발생했습니다." });
  }
};
