const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../../logs/analytics.json');

function ensureLogFile() {
  const logDir = path.dirname(LOG_FILE);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, JSON.stringify([], null, 2));
  }
}

function logAnalytics(data) {
  try {
    ensureLogFile();
    
    const logs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      token_counts: {
        original: data.originalTokens || null,
        compressed: data.compressedTokens || null,
        reduction_percent: data.reductionPercent || null
      },
      latency_metrics: {
        compression_ms: data.compressionMs || null,
        recommendation_ms: data.recommendationMs || null,
        verification_ms: data.verificationMs || null,
        confidence_ms: data.confidenceMs || null,
        total_ms: data.totalMs
      },
      confidence_score: data.confidenceScore,
      verification_status: data.verificationStatus,
      mode: data.mode || 'optimized'
    };
    
    logs.push(logEntry);
    
    if (logs.length > 100) {
      logs.shift();
    }
    
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
  } catch (error) {
    console.error('Failed to write analytics log:', error.message);
  }
}

function getRecentLogs(limit = 10) {
  try {
    ensureLogFile();
    const logs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
    return logs.slice(-limit).reverse();
  } catch (error) {
    console.error('Failed to read analytics logs:', error.message);
    return [];
  }
}

module.exports = { logAnalytics, getRecentLogs };
