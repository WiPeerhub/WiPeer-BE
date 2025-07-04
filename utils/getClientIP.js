export const getClientIP = (req) => {
  const forwardedIP = req.headers["x-forwarded-for"];
  const remoteIP = req.socket.remoteAddress;

  if (forwardedIP) {
    return forwardedIP.split(",")[0];
  }

  return remoteIP || null;
};
