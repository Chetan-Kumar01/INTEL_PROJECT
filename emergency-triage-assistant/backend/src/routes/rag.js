const express = require('express');
const multer = require('multer');
const router = express.Router();
const { uploadPDF, queryRAG } = require('../controllers/ragController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files allowed'));
    }
  }
});

router.post('/upload', upload.single('pdf'), uploadPDF);
router.post('/query', queryRAG);

module.exports = router;
