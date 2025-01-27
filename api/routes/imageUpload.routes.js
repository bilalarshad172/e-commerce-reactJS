// routes/uploadRoutes.js
import express from "express";
import upload from "../multerConfig.js";

const router = express.Router();

// Using upload.array('images', 5) to handle up to 5 images
router.post('/upload', upload.array('files', 5), (req, res) => {

    // If no files uploaded, respond with an error
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files were uploaded.' });
    }
    const uploadedUrls = req.files.map(file => file.path);
    // Return all URLs in the response
    res.status(200).json({
      message: 'Images uploaded successfully!',
      urls: uploadedUrls, // An array of Cloudinary URLs
    });

});

export default router;
