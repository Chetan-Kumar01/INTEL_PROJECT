const keyStore = require('../utils/keyStore');
const { validateApiKeys } = require('../utils/validation');
const { successResponse } = require('../utils/responseFormatter');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const crypto = require('crypto');

const setApiKeys = asyncHandler(async (req, res) => {
  const { scaleDownKey, llmKey, groqKey } = req.body;

  validateApiKeys(scaleDownKey, llmKey, groqKey);

  const sessionId = crypto.randomBytes(32).toString('hex');
  keyStore.setKeys(sessionId, scaleDownKey, llmKey, groqKey);

  res.json(successResponse({ sessionId }, 'API keys configured successfully'));
});

const clearApiKeys = asyncHandler(async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  
  if (sessionId) {
    keyStore.deleteKeys(sessionId);
  }

  res.json(successResponse(null, 'API keys cleared'));
});

module.exports = { setApiKeys, clearApiKeys };
