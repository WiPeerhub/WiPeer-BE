import express from "express";
import {
  getLastMessageByRoom,
  updateMessageById,
} from "../controller/chatController.js";

const router = express.Router();

router.get("/last-message/:roomId", getLastMessageByRoom);
router.patch("/:roomId/message/:messageId", updateMessageById);

export default router;
