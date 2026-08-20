const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary v2 SDK
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

// Create Multer instance
const getMulterUpload = () => {
  const isCloudinaryConfigured = configureCloudinary();

  if (isCloudinaryConfigured) {
    try {
      const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
          folder: 'task-attachments',
          resource_type: 'auto',
        },
      });
      return multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });
    } catch (err) {
      console.error('Cloudinary Storage Init Warning:', err.message);
    }
  }

  // Memory fallback storage
  return multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
};

module.exports = { cloudinary, getMulterUpload };
