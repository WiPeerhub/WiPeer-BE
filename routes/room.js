import express from "express";
import { createRoom, getRoomsByIP } from "../controller/roomController.js";

const router = express.Router();

// POST /room : 방 생성
router.post("/", createRoom);

// GET /room?ip=xxx.xxx.xxx.xxx : 방 목록 조회
router.get("/", getRoomsByIP);

export default router;
