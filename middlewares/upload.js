import multer from "multer";

const storage = multer.memoryStorage(); // Store images in memory as buffers

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB per image
});

export const uploadMultiple = upload.array("photos", 5); // Accept up to 5 images
