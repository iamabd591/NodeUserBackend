const Redis = require("ioredis");
const redis = new Redis({
  host: process.env.REDISHOST,
  port: process.env.REDISPORT,
});

redis.on("connect", () => console.log("Redis Connected"));
redis.on("error", (err) => console.log("Redis Error", err));

module.exports = redis;
