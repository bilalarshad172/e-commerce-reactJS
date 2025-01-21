// routes/uploadRoutes.js
import express from "express";
import upload from "../multerConfig.js";

const router = express.Router();

// Using upload.array('images', 5) to handle up to 5 images
router.post('/upload', upload.array('files', 5), (req, res) => {
    
//   try {
    // Since we're using "upload.array('images')", files are in req.files (array)
    console.log('Uploaded files:', req.files);

    // If no files uploaded, respond with an error
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files were uploaded.' });
    }

      // Multer-Cloudinary returns the cloud URL in file.path for each file
      console.log('Uploaded files:', req.files);
    const uploadedUrls = req.files.map(file => file.path);

    // Return all URLs in the response
    res.status(200).json({
      message: 'Images uploaded successfully!',
      urls: uploadedUrls, // An array of Cloudinary URLs
    });
//   } catch (error) {
//     console.error('Error in upload route:', error);
//     res.status(500).json({ 
//       error: 'Image upload failed', 
//       details: error.message 
//     });
//   }
});

export default router;
