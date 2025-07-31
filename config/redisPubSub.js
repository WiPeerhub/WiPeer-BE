import Redis from "ioredis";

const redisOptions = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  ...(process.env.REDIS_TLS === "true" ? { tls: {} } : {}),
};

export const pub = new Redis(redisOptions);
export const sub = new Redis(redisOptions);

pub.on("connect", () => console.log("[Redis Pub] 연결 성공"));
sub.on("connect", () => console.log("[Redis Sub] 연결 성공"));

pub.on("ready", () => console.log("[Redis Pub] 준비 완료"));
sub.on("ready", () => console.log("[Redis Sub] 준비 완료"));

pub.on("error", (err) => console.error("[Redis Pub] 에러:", err));
sub.on("error", (err) => console.error("[Redis Sub] 에러:", err));

pub.on("end", () => console.warn("[Redis Pub] 연결 종료"));
sub.on("end", () => console.warn("[Redis Sub] 연결 종료"));
