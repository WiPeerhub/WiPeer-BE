let rooms = [];

const addRoom = ({
  roomId,
  ip,
  title,
  description,
  isPrivate,
  password,
  ownerId,
}) => {
  rooms.push({ roomId, ip, title, description, isPrivate, password, ownerId });
};

const getRoomsByIP = (ip) => {
  return rooms.filter((room) => room.ip === ip);
};

const getRoomById = (roomId) => rooms.find((room) => room.roomId === roomId);

const removeRoom = (roomId) => {
  rooms = rooms.filter((room) => room.roomId !== roomId);
};

const getAllRooms = () => rooms;

export default {
  addRoom,
  getRoomsByIP,
  removeRoom,
  getRoomById,
  getAllRooms,
};
