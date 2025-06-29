export const getClientIP = (req) => {
  const forwardedIP = req.headers["x-forwarded-for"];
  const remoteIP = req.socket.remoteAddress;

  console.log("forwarded IP", forwardedIP);
  console.log("remote Ip", remoteIP);

  if (forwardedIP) {
    return forwardedIP.split(",")[0]; // 여러 IP가 있을 경우 첫번쨰가 클라이언트 IP
  }

  if (remoteIP === "::1" || remoteIP === "127.0.0.1") {
    return "localhost";
  }

  return remoteIP || null;
};
