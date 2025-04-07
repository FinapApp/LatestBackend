import express, { Express } from "express";
import protectedRoutes from "./routes/protected.routes";
import normalRoutes from "./routes/normal.routes"
import { connectDB } from "./config/database/config.database";
import { config } from "./config/generalconfig";
import { redis } from "./config/redis/redis.config";
import cors from 'cors';
import cluster from "cluster";
import helmet from "helmet";
// import { kafkaConnecter } from "./config/kafka/kafka.config";
import { isAuthenticatedUser } from "./middlewares/isAuthenticatedUser";
import BasicAuth from 'express-basic-auth'
import { specs, swaggerUi } from "./utils/swagger";
import mongoose from "mongoose";
import { SongSchema } from "./models/Song/song.model";
const redisInitalizer = redis;
const app: Express = express();

// SWAGGER
const swaggerUiOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2/swagger-ui.js',
  customJsUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2/swagger-ui-bundle.js',
  customJs: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2/swagger-ui-standalone-preset.js',
};
app.use("/flickstar/api-docs", BasicAuth({
  users: {
    'admin': 'shokhdevs11@'
  },
  challenge: true,
}),
  swaggerUi.serve,
  swaggerUi.setup(specs, swaggerUiOptions)
);
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
  app.use(cors({
    origin: "*",
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-amz-date", "x-amz-content-sha256", "x-amz-security-token"],
    exposedHeaders: ["ETag"]
  }));
  // app.use(cors({ credentials: true, origin: true }))
  app.use(helmet({ contentSecurityPolicy: false }))
  app.use("/api/v1", isAuthenticatedUser, protectedRoutes);
  app.use("/api", normalRoutes);
  mongoose.model("song" , SongSchema)
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
