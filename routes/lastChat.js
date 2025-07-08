import express from "express";
import { getLastMessageByRoom } from "../controller/chatController.js";

const router = express.Router();

router.get("/:roomId", getLastMessageByRoom);

export default router;
