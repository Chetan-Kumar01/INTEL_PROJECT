const express = require('express');
const router = express.Router();
const { compareApproaches } = require('../controllers/comparisonController');

router.post('/', compareApproaches);

module.exports = router;
