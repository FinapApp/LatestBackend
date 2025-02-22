import multer from 'multer';
export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 5MB limit for the file size
    },
});
