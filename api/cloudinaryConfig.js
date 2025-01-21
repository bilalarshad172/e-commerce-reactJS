import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// Configure Cloudinary with your account details
cloudinary.config({
  cloud_name: 'dfp3sfyup',
  api_key: '584684633794496',
  api_secret: 'RXI2iDZ4M7vj05PSR5OodMveaCE',
});

export default cloudinary;