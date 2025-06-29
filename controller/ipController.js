import { getClientIP } from "../utils/getClientIP.js";

export const getClientIPHandler = (req, res) => {
  const ip = getClientIP(req);

  res.json({ ip });
};
