import express from "express";
import {
  getLastMessageByRoom,
  updateMessageById,
  deleteMeessage,
  updateReactionsById,
} from "../controller/chatController.js";

const router = express.Router();

router.get("/last-message/:roomId", getLastMessageByRoom);
router.patch("/:roomId/message/:messageId", updateMessageById);
router.delete("/:roomId/message/:messageId", deleteMeessage);
router.patch("/:roomId/message/:messageId/reactions", updateReactionsById);

export default router;
