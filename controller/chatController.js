import { getLastMessage } from "../models/chatStore.js";

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
