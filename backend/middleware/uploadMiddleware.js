const { upload } = require('../config/cloudinary');

// Wrapper middleware for parsing single file upload cleanly
const uploadSingleFile = (fieldName) => {
  return (req, res, next) => {
    const singleUpload = upload.single(fieldName);

    singleUpload(req, res, (err) => {
      if (err) {
        console.error('Multer File Parsing Error:', err);
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
