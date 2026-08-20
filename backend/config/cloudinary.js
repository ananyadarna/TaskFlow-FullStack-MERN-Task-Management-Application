const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Dynamically create Multer storage using active environment variables
const getMulterUpload = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME ? process.env.CLOUDINARY_CLOUD_NAME.trim() : '';
  const apiKey = process.env.CLOUDINARY_API_KEY ? process.env.CLOUDINARY_API_KEY.trim() : '';
  const apiSecret = process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.trim() : '';

  if (cloudName && cloudName !== 'your_cloudinary_cloud_name') {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'task-attachments',
        resource_type: 'auto',
      },
    });

    return multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });
  }

  // Fallback to memory storage if credentials are missing
  return multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
};

module.exports = { cloudinary, getMulterUpload };
