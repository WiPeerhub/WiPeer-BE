import redis from "../config/redisClient.js";
const ROOM_HASH_KEY = "rooms";

const addRoom = async ({
  roomId,
  ip,
  title,
  description,
  isPrivate,
  password,
  ownerId,
}) => {
  const room = {
    roomId,
    ip,
    title,
    description,
    isPrivate,
    password,
    ownerId,
  };
  await redis.hset(ROOM_HASH_KEY, roomId, JSON.stringify(room));
};

const getRoomsByIP = async (ip) => {
  const rooms = await redis.hvals(ROOM_HASH_KEY);
  return rooms
    .map((roomStr) => JSON.parse(roomStr))
    .filter((room) => room.ip === ip);
};

const getRoomById = async (roomId) => {
  const data = await redis.hget(ROOM_HASH_KEY, roomId);
  return data ? JSON.parse(data) : null;
};

const removeRoom = async (roomId) => {
  await redis.hdel(ROOM_HASH_KEY, roomId);
};

const getAllRooms = async () => {
  const all = await redis.hvals(ROOM_HASH_KEY);
  return all.map((roomStr) => JSON.parse(roomStr));
};

export default {
  addRoom,
  getRoomsByIP,
  removeRoom,
  getRoomById,
  getAllRooms,
};
