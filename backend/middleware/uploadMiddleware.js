const { getMulterUpload } = require('../config/cloudinary');

// Wrapper middleware to handle single file upload dynamically
const uploadSingleFile = (fieldName) => {
  return (req, res, next) => {
    const upload = getMulterUpload();
    const singleUpload = upload.single(fieldName);

    singleUpload(req, res, (err) => {
      if (err) {
        console.error('Multer / Cloudinary Upload Error:', err);
        return res.status(400).json({
          message: err.message || 'File upload failed',
          error: err.message || err,
        });
      }
      next();
    });
  };
};

module.exports = { uploadSingleFile };
