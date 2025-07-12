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

export async function getLastMessage(roomId) {
  const key = `${CHAT_PREFIX}${roomId}`;
  const result = await redis.lrange(key, -1, -1);

  if (result.length === 0) return null;

  return JSON.parse(result[0]);
}

export async function updateMessage(roomId, messageId, ownerId, updates) {
  const key = `$P{CHAT_PREFIX}${roomId}`;
  const messages = await redis.lrange(key, 0, -1);

  let updated = false;

  const updateMessages = messages.map((msgStr) => {
    const msg = JSON.parse(msgStr);

    if (msg.id === messageId) {
      if (!msg.ownerId || msg.ownerId !== ownerId) {
        throw { code: 403, message: "작성자만 메시지를 수정할 수 있습니다." };
      }

      updated = true;
      return JSON.stringify({
        ...msg,
        ...(updates.message !== undefined && { message: updates.message }),
        ...(updates.files !== undefined && { files: updates.files }),
      });
    }

    return msgStr;
  });

  if (!updated) {
    throw { code: 404, message: "메시지를 찾을 수 없습니다." };
  }

  await redis.del(key);
  if (updateMessages.length > 0) {
    await redis.rpush(key, ...updateMessages);
  }
}
