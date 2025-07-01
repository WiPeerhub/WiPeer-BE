const rooms = [];

const addRoom = ({ roomId, ip, title, description, password }) => {
  rooms.push({ roomId, ip, title, description, password });
};

const getRoomsByIP = (ip) => {
  return rooms.filter((room) => room.ip === ip);
};

const getAllRooms = () => rooms;

export default {
  addRoom,
  getRoomsByIP,
  getAllRooms,
};
