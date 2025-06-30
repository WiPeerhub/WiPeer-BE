const rooms = [];

const addRoom = ({ roomid, ip, title, description, password }) => {
  rooms.push({ roomid, ip, title, description, password });
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
