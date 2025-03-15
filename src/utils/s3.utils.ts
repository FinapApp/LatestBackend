// import {
//   PutObjectCommand,
//   HeadObjectCommand,
//   ListObjectsV2Command,
//   DeleteObjectCommand,
// } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { s3Client } from "../../config/s3/s3.config";

// const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', ''];

// export const uploadMessagingImages = async (fileName: string, fileType: string , filePath :string= 'uploads/images/') => {
//     // Validate file type
//     if (!allowedImageTypes.includes(fileType)) {
//         throw new Error('Invalid file type. Only images are allowed.');
//     }

//     const command = new PutObjectCommand({
//         Bucket: process.env.R2_BUCKET!,
//         Key: `messaging/images/${fileName}`, // Optional: Organize images in an 'uploads/images' folder
//         ContentType: fileType
//     });

//     const url = await getSignedUrl(s3Client as any, command as any, { expiresIn: 3600 }); // URL valid for 1 hour
//     return url;
// };

