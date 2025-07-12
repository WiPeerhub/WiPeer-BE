import { getLastMessage, updateMessage } from "../models/chatStore.js";

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

  console.log("ownerId", ownerId);

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
