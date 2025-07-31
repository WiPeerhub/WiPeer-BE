import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  ...(process.env.REDIS_TLS === "true" ? { tls: {} } : {}),
});

redis.on("connect", () => {
  console.log("[Redis] 연결 성공");
});

redis.on("ready", () => {
  console.log("[Redis] 준비 완료 (ready)");
});

redis.on("error", (err) => {
  console.error("[Redis] 에러:", err);
});

redis.on("close", () => {
  console.warn("[Redis] 연결 닫힘 (close)");
});

redis.on("end", () => {
  console.warn("[Redis] 연결 종료 (end)");
});

export default redis;
