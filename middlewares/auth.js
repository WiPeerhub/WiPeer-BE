import { verifyToken } from "../utils/jwt.js";

export function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "토큰 없음" });

  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: "유효하지 않은 토큰" });
  }
}
