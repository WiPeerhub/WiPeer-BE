import Redis from "ioredis";

const redisOptions = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  ...(process.env.REDIS_TLS === "true" ? { tls: {} } : {}),
};

export const pub = new Redis(redisOptions);
export const sub = new Redis(redisOptions);

pub.on("connect", () => console.log("Redis Pub connected"));
sub.on("connect", () => console.log("Redis Sub connected"));

pub.on("error", (err) => console.error("Redis Pub error:", err));
sub.on("error", (err) => console.error("Redis Sub error:", err));
