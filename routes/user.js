import express from "express";
import { authenticateToken } from "../middlewares/auth.js";
import User from "../models/user.js";

const router = express.Router();

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user)
      return res
        .status(404)
        .json({ message: "사용자 정보를 찾을 수 없습니다." });

    const { _id, username, email, avatar } = user;
    res.json({ id: _id, username, email, avatar });
  } catch (err) {
    res.status(500).json({ message: "서버 에러", error: err.message });
  }
});

export default router;
