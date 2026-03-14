const keyStore = require('../utils/keyStore');

function validateApiKey(key) {
  return key && typeof key === 'string' && key.startsWith('sk-') && key.length > 20;
}

function apiKeyMiddleware(req, res, next) {
  const sessionId = req.headers['x-session-id'];
  
  // Try session-based keys first (optional override)
  if (sessionId) {
    const keys = keyStore.getKeys(sessionId);
    if (keys && validateApiKey(keys.scaleDown) && validateApiKey(keys.llm)) {
      req.apiKeys = { scaleDown: keys.scaleDown, llm: keys.llm };
      return next();
    }
  }

  // Fall back to .env key
  const envKey = process.env.OPENAI_API_KEY;
  if (envKey && validateApiKey(envKey)) {
    req.apiKeys = { scaleDown: envKey, llm: envKey };
    return next();
  }

  return res.status(401).json({ error: 'No API keys available. Set OPENAI_API_KEY in .env or configure via API.' });
}

module.exports = { apiKeyMiddleware, validateApiKey };
