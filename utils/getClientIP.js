export const getClientIP = (req) => {
  const forwardedIP = req.headers["x-forwarded-for"];
  const remoteIP = req.socket.remoteAddress;

  console.log("forwarded IP", forwardedIP);
  console.log("remote Ip", remoteIP);

  if (forwardedIP) {
    return forwardedIP.split(",")[0];
  }

  return remoteIP || null;
};
