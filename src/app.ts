import express, { Express } from "express";
import protectedRoutes from "./routes/protected.routes";
import normalRoutes from "./routes/normal.routes"
import { connectDB } from "./config/database/config.database";
import { config } from "./config/generalconfig";
import { redis } from "./config/redis/redis.config";
import cors from 'cors';
import cluster from "cluster";
import helmet from "helmet";
import { kafkaConnecter } from "./config/kafka/kafka.config";
import { isAuthenticatedUser } from "./middlewares/isAuthenticatedUser";
const redisInitalizer = redis;
const app: Express = express();
if (cluster.isPrimary) {
  for (let i = 0; i < 1; i++) {
    cluster.fork();
  }
  // kafkaConnecter()
  app.set("redis", redisInitalizer);
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  app.use(express.json());
  app.use(cors({ credentials: true, origin: true }))
  app.use(helmet({ contentSecurityPolicy: false }))
  app.use("/api/v1", isAuthenticatedUser, protectedRoutes);
  app.use("/api", normalRoutes);
  
  const startServer = async () => {
    try {
      await connectDB();
      app.listen(config.PORT, () => {
        console.log(`Server started on port ${config.PORT}`);
      });
    } catch (error) {
      console.error("Failed to start server", error);
    }
  };
  startServer();
}
