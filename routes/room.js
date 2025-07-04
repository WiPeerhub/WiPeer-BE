import express from "express";
import {
  createRoom,
  getRoomsByIP,
  deleteRoom,
} from "../controller/roomController.js";

const router = express.Router();

router.post("/", createRoom);
router.get("/", getRoomsByIP);
router.delete("/:roomId", deleteRoom);

export default router;
