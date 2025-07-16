import redis from "../config/redisClient.js";

const ROOM_HASH_KEY = "rooms";
const ROOM_IP_SET_PREFIX = "ip:";
const ROOMS_BY_OWNER_PREFIX = "roomsByOwner:";
const ROOM_VISITORS_PREFIX = "roomVisitors:";
const USER_VISITED_ROOMS_PREFIX = "userRooms:";

const getRoomKey = (ownerId, roomId) => `${ownerId}:${roomId}`;

const addRoom = async ({
  roomId,
  ip,
  title,
  description,
  isPrivate,
  password,
  ownerId,
  wifiId,
}) => {
  const room = {
    roomId,
    ip,
    title,
    description,
    isPrivate,
    password,
    ownerId,
    wifiId,
  };

  console.log("New room", room);
  const roomKey = getRoomKey(ownerId, roomId);

  await redis.hset(ROOM_HASH_KEY, roomKey, JSON.stringify(room));

  await redis.sadd(`${ROOM_IP_SET_PREFIX}${ip}`, roomKey);

  await redis.sadd(`${ROOMS_BY_OWNER_PREFIX}${ownerId}`, roomKey);
};

const getRoomsByIP = async (ip) => {
  const roomKeys = await redis.smembers(`${ROOM_IP_SET_PREFIX}${ip}`);
  const roomData = await redis.hmget(ROOM_HASH_KEY, ...roomKeys);
  return roomData.filter(Boolean).map((roomStr) => JSON.parse(roomStr));
};

const getRoomById = async (roomId, ownerId) => {
  const roomKey = getRoomKey(ownerId, roomId);
  const data = await redis.hget(ROOM_HASH_KEY, roomKey);
  return data ? JSON.parse(data) : null;
};

const removeRoom = async (roomId, ownerId) => {
  const roomKey = getRoomKey(ownerId, roomId);
  const room = await getRoomById(roomId, ownerId);
  console.log("find room", roomKey);
  if (!room) return;
  console.log("find room", room);
  await redis.hdel(ROOM_HASH_KEY, roomKey);
  await redis.srem(`${ROOM_IP_SET_PREFIX}${room.ip}`, roomKey);
  await redis.srem(`${ROOMS_BY_OWNER_PREFIX}${ownerId}`, roomKey);
};

const addRoomVisitor = async (roomId, ownerId, userId) => {
  const roomKey = getRoomKey(ownerId, roomId);

  await redis.sadd(`${ROOM_VISITORS_PREFIX}${roomId}`, userId);
  await redis.sadd(`${USER_VISITED_ROOMS_PREFIX}${userId}`, roomKey);
};

const getUserRooms = async (userId) => {
  const roomKeys = await redis.smembers(
    `${USER_VISITED_ROOMS_PREFIX}${userId}`
  );
  const roomData = await redis.hmget(ROOM_HASH_KEY, ...roomKeys);
  return roomData.filter(Boolean).map((roomStr) => JSON.parse(roomStr));
};

const updateRoomIPIfChanged = async (roomId, ownerId, newIP) => {
  const roomKey = getRoomKey(ownerId, roomId);
  const room = await getRoomById(roomId, ownerId);
  if (!room || room.ip === newIP) return null;

  await redis.srem(`${ROOM_IP_SET_PREFIX}${room.ip}`, roomKey);

  await redis.sadd(`${ROOM_IP_SET_PREFIX}${newIP}`, roomKey);

  const updatedRoom = { ...room, ip: newIP };
  await redis.hset(ROOM_HASH_KEY, roomKey, JSON.stringify(updatedRoom));

  return updatedRoom;
};

const getAllRooms = async () => {
  const all = await redis.hvals(ROOM_HASH_KEY);
  return all.map((roomStr) => JSON.parse(roomStr));
};

const getRoomsByOwner = async (ownerId) => {
  const roomKeys = await redis.smembers(`${ROOMS_BY_OWNER_PREFIX}${ownerId}`);
  const roomData = await redis.hmget(ROOM_HASH_KEY, ...roomKeys);
  return roomData.filter(Boolean).map((roomStr) => JSON.parse(roomStr));
};

export default {
  addRoom,
  getRoomsByIP,
  getRoomById,
  removeRoom,
  addRoomVisitor,
  getUserRooms,
  updateRoomIPIfChanged,
  getAllRooms,
  getRoomsByOwner,
};
