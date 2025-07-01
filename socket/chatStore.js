const roomMessages = new Map();

export function saveMessage(roomId, messageObj) {
  if (!roomMessages.has(roomId)) {
    roomMessages.set(roomId, []);
  }
  roomMessages.get(roomId).push(messageObj);
}

export function getMessages(roomId) {
  return roomMessages.get(roomId) || [];
}
