const express = require('express');
const router = express.Router();
const { processMultiStageTriage } = require('../controllers/pipelineController');

router.post('/', processMultiStageTriage);

module.exports = router;
