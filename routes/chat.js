import express from "express";
import { authenticateToken } from "../middlewares/auth.js";
import {
  getLastMessageByRoom,
  updateMessageById,
  deleteMeessage,
} from "../controller/chatController.js";

const router = express.Router();

router.get("/last-message/:roomId", getLastMessageByRoom);
router.patch("/:roomId/message/:messageId", updateMessageById);
router.delete("/:roomId/message/:messageId", deleteMeessage);

export default router;
