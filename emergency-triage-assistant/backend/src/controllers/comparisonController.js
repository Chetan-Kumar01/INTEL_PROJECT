const { scaleDownCompress } = require('../services/scaleDown');
const { getStructuredRecommendation } = require('../services/structuredLLM');
const { verifyRecommendation } = require('../services/structuredVerification');
const { calculateStructuredConfidence } = require('../services/structuredConfidence');
const { countTokens } = require('../utils/tokenCounter');
const { logAnalytics } = require('../services/analyticsLogger');
const { validateTriageInput } = require('../utils/validation');
const { successResponse } = require('../utils/responseFormatter');
const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

const compareApproaches = asyncHandler(async (req, res) => {
  const { patientHistory, emergencyDescription } = req.body;
  const { scaleDown, llm } = req.apiKeys;

  validateTriageInput(patientHistory, emergencyDescription);

  const [naive, optimized] = await Promise.all([
    processNaive(patientHistory, emergencyDescription, llm),
    processOptimized(patientHistory, emergencyDescription, scaleDown, llm)
  ]);

  logAnalytics({
    originalTokens: naive.tokens,
    compressedTokens: optimized.tokens,
    reductionPercent: optimized.reduction_percent,
    compressionMs: null,
    recommendationMs: optimized.latency_ms,
    verificationMs: null,
    confidenceMs: null,
    totalMs: optimized.latency_ms,
    confidenceScore: optimized.confidence.score,
    verificationStatus: optimized.verification.status,
    mode: 'comparison'
  });

  logger.info('A/B comparison completed');
  res.json(successResponse({ naive, optimized }));
});

async function processNaive(patientHistory, emergencyDescription, llm) {
  const start = Date.now();
  const tokens = countTokens(`${emergencyDescription}\n${patientHistory}`);

  const recommendation = await getStructuredRecommendation(patientHistory, emergencyDescription, llm);
  const verification = verifyRecommendation(patientHistory, emergencyDescription, recommendation);
  const confidence = calculateStructuredConfidence(verification, recommendation, 0);

  return {
    tokens,
    recommendation,
    verification,
    confidence,
    latency_ms: Date.now() - start,
    estimated_cost: (tokens / 1000 * 0.0015).toFixed(4)
  };
}

async function processOptimized(patientHistory, emergencyDescription, scaleDownKey, llmKey) {
  const start = Date.now();
  
  const compression = await scaleDownCompress(patientHistory, emergencyDescription, scaleDownKey);
  const recommendation = await getStructuredRecommendation(compression.compressed_text, emergencyDescription, llmKey);
  const verification = verifyRecommendation(compression.compressed_text, emergencyDescription, recommendation);
  const confidence = calculateStructuredConfidence(verification, recommendation, compression.reduction_percent);

  return {
    tokens: compression.compressed_tokens,
    original_tokens: compression.original_tokens,
    reduction_percent: compression.reduction_percent,
    recommendation,
    verification,
    confidence,
    latency_ms: Date.now() - start,
    estimated_cost: (compression.compressed_tokens / 1000 * 0.0015).toFixed(4)
  };
}

module.exports = { compareApproaches };
