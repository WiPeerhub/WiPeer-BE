import {
  getLastMessage,
  removeMessage,
  updateMessage,
} from "../models/chatStore.js";
import { getIO } from "../socket/socket.js";

export async function getLastMessageByRoom(req, res) {
  const { roomId } = req.params;

  try {
    const message = await getLastMessage(roomId);

    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "메시지가 없습니다." });
    }

    res.json({ success: true, data: message });
  } catch (error) {
    console.error("getLastMessageByRoom error:", error);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
}

export async function updateMessageById(req, res) {
  const { roomId, messageId } = req.params;
  const { ownerId, newMessage, newFiles } = req.body;

  if (!ownerId) {
    return res
      .status(400)
      .json({ success: false, message: "ownerId가 필요합니다" });
  }

  try {
    const updatedMessage = await updateMessage(roomId, messageId, ownerId, {
      message: newMessage,
      files: newFiles,
    });

    res.status(200).json({
      success: true,
      message: "메시지가 수정되었습니다.",
      data: updatedMessage,
    });
  } catch (err) {
    if (err.code === 403) {
      return res.status(403).json({ success: false, message: err.message });
    }

    if (err.code === 404) {
      return res.status(404).json({ success: false, message: err.message });
    }

    console.error("updateMessageById error:", err);
    res
      .status(500)
      .json({ success: false, message: "서버 오류로 메시지 수정 실패" });
  }
}

export async function deleteMeessage(req, res) {
  const { roomId, messageId } = req.params;
  const { ownerId } = req.body;

  try {
    const result = await removeMessage(roomId, messageId, ownerId);

    const io = getIO();
    io.to(roomId).emit("message-deleted", messageId);

    return res.json({ message: "메시지 삭제 성공", result });
  } catch (err) {
    const status = err.code || 500;
    return res
      .status(status)
      .json({ message: err.message || "삭제 중 오류 발생" });
  }
}
