import redis from "../config/redisClient.js";
const CHAT_PREFIX = "chat:";

export async function saveMessage(roomId, messageObj) {
  const key = `${CHAT_PREFIX}${roomId}`;
  await redis.rpush(key, JSON.stringify(messageObj));
}

export async function getMessages(roomId) {
  const key = `${CHAT_PREFIX}${roomId}`;
  const messages = await redis.lrange(key, 0, -1);
  return messages.map((msg) => JSON.parse(msg));
}
