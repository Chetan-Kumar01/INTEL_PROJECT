const { getRecentLogs } = require('../services/analyticsLogger');
const { successResponse } = require('../utils/responseFormatter');
const { asyncHandler } = require('../middleware/errorHandler');

const getLogs = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 10, 100);
  const logs = getRecentLogs(limit);
  
  res.json(successResponse({ count: logs.length, logs }));
});

module.exports = { getLogs };
