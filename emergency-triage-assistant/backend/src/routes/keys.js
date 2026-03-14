const express = require('express');
const router = express.Router();
const { setApiKeys, clearApiKeys } = require('../controllers/keyController');

router.post('/set', setApiKeys);
router.post('/clear', clearApiKeys);

module.exports = router;
