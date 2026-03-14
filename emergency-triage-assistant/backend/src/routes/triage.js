const express = require('express');
const router = express.Router();
const { processOptimized, processNaive } = require('../controllers/triageController');

router.post('/optimized', processOptimized);
router.post('/naive', processNaive);

module.exports = router;
