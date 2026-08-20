const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary SDK with environment variables
const configureCloudinary = () => {
  const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || '').trim();
  const apiKey = (process.env.CLOUDINARY_API_KEY || '').trim();
  const apiSecret = (process.env.CLOUDINARY_API_SECRET || '').trim();

  if (cloudName && cloudName !== 'your_cloudinary_cloud_name') {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    return true;
  }
  return false;
};

// Always configure Cloudinary
configureCloudinary();

// Standard Memory Storage Multer Uploader
// Avoids empty-stream 400 errors when forms are submitted without a file
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

module.exports = { cloudinary, upload };
