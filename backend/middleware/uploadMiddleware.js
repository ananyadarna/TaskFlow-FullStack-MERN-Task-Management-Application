const { upload } = require('../config/cloudinary');

// Wrapper middleware to handle single file upload error formatting
const uploadSingleFile = (fieldName) => {
  return (req, res, next) => {
    const singleUpload = upload.single(fieldName);

    singleUpload(req, res, (err) => {
      if (err) {
        console.error('File Upload Error:', err.message);
        return res.status(400).json({
          message: 'File upload failed',
          error: err.message,
        });
      }
      next();
    });
  };
};

module.exports = { uploadSingleFile };
