
import { config } from "../generalconfig";

const Redis = require("ioredis");

let redis = new Redis(config.REDIS);

redis.on("error", function (err: any) {
  throw err;
});

redis.on("connect", function () {
  console.log("Redis connected");
});
export { redis };
