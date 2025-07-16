import express from "express";
import {
  createRoom,
  getRoomsByIP,
  getUserVisitedRooms,
  getRoomDetail,
  updateRoomIP,
  recordRoomVisit,
  deleteRoom,
  getRoomByRoomIdOnly,
} from "../controller/roomController.js";

const router = express.Router();

router.post("/", createRoom);

router.get("/", getRoomsByIP);

router.get("/user/:userId", getUserVisitedRooms);

router.get("/id/:roomId", getRoomByRoomIdOnly);

router.get("/:ownerId/:roomId", getRoomDetail);

router.patch("/:ownerId/:roomId/ip", updateRoomIP);

router.post("/:ownerId/:roomId/visit", recordRoomVisit);

router.delete("/:ownerId/:roomId", deleteRoom);

export default router;
