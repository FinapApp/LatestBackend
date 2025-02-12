import express from 'express'
import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import cors from 'cors'
import * as dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-amz-date", "x-amz-content-sha256", "x-amz-security-token"],
  exposedHeaders: ["ETag"]
}));

export const S3 = new S3Client({
  endpoint: process.env.R2_ENDPOINT,
  region: process.env.R2_REGION,
  requestChecksumCalculation: 'WHEN_REQUIRED',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
// console.log(await S3.send(new ListBucketsCommand({})));
console.log(
  await S3.send(new ListObjectsV2Command({ Bucket: "test" })),
);

app.listen(3000, () => {
  console.log("listening on 3000 port");
});

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/s3-presigned-url", async (req, res) => {
  const s3Parms = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: req.query.filename,
    // ContentType: req.query.mimetype,
    // ACL: 'public-read',
  })
  const url = await getSignedUrl(S3, s3Parms, { expiresIn: 3600 });
  console.log("=====> url", url)
  res.json({ url });
});
