const rooms = [];

const addRoom = ({ roomid, ip, password }) => {
  rooms.push({ roomid, ip, password });
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
