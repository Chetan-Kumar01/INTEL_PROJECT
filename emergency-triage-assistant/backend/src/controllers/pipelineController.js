const { scaleDownCompress } = require('../services/scaleDown');
const { getStructuredRecommendation } = require('../services/structuredLLM');
const { verifyRecommendation } = require('../services/structuredVerification');
const { calculateStructuredConfidence } = require('../services/structuredConfidence');
const { logAnalytics } = require('../services/analyticsLogger');
const { validateTriageInput } = require('../utils/validation');
const { successResponse } = require('../utils/responseFormatter');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

const processMultiStageTriage = asyncHandler(async (req, res) => {
  const { patientHistory, emergencyDescription } = req.body;
  const { scaleDown, llm } = req.apiKeys;

  validateTriageInput(patientHistory, emergencyDescription);

  const performance = {};
  const startTotal = Date.now();

  const t1 = Date.now();
  const compressionResult = await scaleDownCompress(patientHistory, emergencyDescription, scaleDown);
  performance.compression_ms = Date.now() - t1;

  const t2 = Date.now();
  const recommendation = await getStructuredRecommendation(
    compressionResult.compressed_text,
    emergencyDescription,
    llm
  );
  performance.recommendation_ms = Date.now() - t2;

  const t3 = Date.now();
  const verification = verifyRecommendation(
    compressionResult.compressed_text,
    emergencyDescription,
    recommendation
  );
  performance.verification_ms = Date.now() - t3;

  const t4 = Date.now();
  const confidence = calculateStructuredConfidence(
    verification,
    recommendation,
    compressionResult.reduction_percent
  );
  performance.confidence_ms = Date.now() - t4;

  performance.total_ms = Date.now() - startTotal;

  const responseData = {
    compressed_history: compressionResult.compressed_text,
    recommendation,
    verification,
    confidence,
    performance
  };

  logAnalytics({
    originalTokens: compressionResult.original_tokens,
    compressedTokens: compressionResult.compressed_tokens,
    reductionPercent: compressionResult.reduction_percent,
    compressionMs: performance.compression_ms,
    recommendationMs: performance.recommendation_ms,
    verificationMs: performance.verification_ms,
    confidenceMs: performance.confidence_ms,
    totalMs: performance.total_ms,
    confidenceScore: confidence.score,
    verificationStatus: verification.status,
    mode: 'optimized'
  });

  logger.info(`Multi-stage triage completed in ${performance.total_ms}ms`);
  res.json(successResponse(responseData));
});

module.exports = { processMultiStageTriage };
