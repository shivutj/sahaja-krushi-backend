const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to accept specific file types (documents + images + audio + video)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    '.pdf', '.doc', '.docx',
    '.jpg', '.jpeg', '.png', '.webp',
    '.mp3', '.m4a', '.aac', '.wav', '.ogg', '.amr',
    '.mp4', '.mov', '.mkv', '.3gp', '.avi'
  ];
  const fileExt = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX, JPG, JPEG, PNG, WEBP files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB per file limit
  }
});

// Middleware for single file upload
const uploadSingle = upload.single('document');

// Fields configuration for farmer documents and profile photo
const farmerUploadFields = upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'aadharCard', maxCount: 1 },
  { name: 'landProof', maxCount: 1 },
  { name: 'bankPassbook', maxCount: 1 },
  { name: 'farmerIdCard', maxCount: 1 },
]);

// Middleware wrapper to handle multer errors
const handleFileUpload = (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 10MB.'
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
};

module.exports = {
  handleFileUpload,
  upload,
  farmerUploadFields
};
