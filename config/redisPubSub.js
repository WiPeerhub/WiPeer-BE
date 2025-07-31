import Redis from "ioredis";

export const pub = new Redis();
export const sub = new Redis();

pub.on("connect", () => console.log("Redis Pub connected"));
sub.on("connect", () => console.log("Redis Sub connected"));

pub.on("error", (err) => console.error("Redis Pub error:", err));
sub.on("error", (err) => console.error("Redis Sub error:", err));
