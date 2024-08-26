/* eslint-disable no-undef */
const multer = require('multer');
const path = require('path');
const logger = require('../utils/logger');

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'images'));
  },
  filename: (req, file, cb) => {
    const userId = req.user.id;

    const uniqueSuffix = userId;
    const fileExtension = path.extname(file.originalname);
    cb(null, `profile-${uniqueSuffix}${fileExtension}`);
  },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  },
}).single('Image');

const uploadImage = (req, res, next) => {
  imageUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {

      res.status(413).json({ error: 'File size limit exceeded. Maximum file size is 5MB.' });
    } else if (err) {
      logger.error(err);
      res.status(500).json({ error: 'An error occurred while uploading the file.' });
    } else {
      next();
    }
  });
};


module.exports = { imageUpload, pdfUpload, uploadImage, uploadFiles };