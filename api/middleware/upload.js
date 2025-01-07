import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// If using ES modules, __dirname is not available, so you have to reconstruct it:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the folder where images will be stored
    cb(null, path.join(__dirname, "../uploads")); // e.g., backend/uploads
  },
  filename: (req, file, cb) => {
    // Generate a unique filename for the image
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // e.g. 1674469736580-123456789.jpg
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

// Only allow image uploads
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 2 MB limit (adjust as needed)
  },
});
