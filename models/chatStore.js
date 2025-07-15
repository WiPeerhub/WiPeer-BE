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
  const message = await redis.lrange(key, -1, -1);

  if (message.length === 0) return null;

  return JSON.parse(message[0]);
}

export async function updateMessage(roomId, messageId, ownerId, updates) {
  const key = `${CHAT_PREFIX}${roomId}`;
  const messages = await redis.lrange(key, 0, -1);

  console.log("updates.reactions:", updates.reactions);

  let updatedMessage = null;

  const updateMessages = messages.map((msgStr) => {
    const msg = JSON.parse(msgStr);
    if (msg.id === messageId) {
      if (updates.message || updates.files) {
        if (!msg.ownerId || msg.ownerId !== ownerId) {
          throw { code: 403, message: "작성자만 메시지를 수정할 수 있습니다." };
        }
      }

      updatedMessage = {
        ...msg,
        ...(updates.message !== undefined && { message: updates.message }),
        ...(updates.files !== undefined && { files: updates.files }),
        ...(updates.reactions !== undefined && {
          reactions: updates.reactions,
        }),
      };

      return JSON.stringify(updatedMessage);
    }

    return msgStr;
  });

  if (!updatedMessage) {
    throw { code: 404, message: "메시지를 찾을 수 없습니다." };
  }

  await redis.del(key);
  if (updateMessages.length > 0) {
    await redis.rpush(key, ...updateMessages);
  }

  return updatedMessage;
}

export async function removeMessage(roomId, messageId, ownerId) {
  const key = `${CHAT_PREFIX}${roomId}`;
  const messages = await redis.lrange(key, 0, -1);

  let found = false;

  const filteredMessages = messages.filter((msgStr) => {
    const msg = JSON.parse(msgStr);

    if (msg.id === messageId) {
      if (!msg.ownerId || msg.ownerId !== ownerId) {
        throw { code: 403, message: "작성자만 메시지를 삭제할 수 있습니다." };
      }

      found = true;
      return false;
    }

    return true;
  });

  if (!found) {
    throw { code: 404, message: "메시지를 찾을 수 없습니다." };
  }

  await redis.del(key);
  if (filteredMessages.length > 0) {
    await redis.rpush(key, ...filteredMessages);
  }
}
