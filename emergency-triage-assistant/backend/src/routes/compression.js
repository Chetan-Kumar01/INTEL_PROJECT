const express = require('express');
const router = express.Router();
const { compressPatientData } = require('../controllers/compressionController');

router.post('/', compressPatientData);

module.exports = router;
