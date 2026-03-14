const { compressText } = require('../services/compression');
const { getLLMRecommendation } = require('../services/llm');
const { verifyHallucination } = require('../services/verification');
const { calculateConfidence } = require('../services/confidence');
const { countTokens, calculateTokenReduction } = require('../utils/tokenCounter');
const logger = require('../utils/logger');

async function processOptimized(req, res) {
  const startTime = Date.now();
  const { caseDescription, apiKey } = req.body;

  if (!caseDescription || !apiKey) {
    return res.status(400).json({ error: 'Missing caseDescription or apiKey' });
  }

  try {
    const latency = {};
    
    const t1 = Date.now();
    const compressed = compressText(caseDescription);
    latency.compression = Date.now() - t1;

    const tokenStats = calculateTokenReduction(caseDescription, compressed);

    const t2 = Date.now();
    const recommendation = await getLLMRecommendation(compressed, apiKey);
    latency.llm = Date.now() - t2;

    const t3 = Date.now();
    const verification = verifyHallucination(caseDescription, recommendation);
    latency.verification = Date.now() - t3;

    const t4 = Date.now();
    const confidence = calculateConfidence(verification.score, tokenStats.reduction);
    latency.confidence = Date.now() - t4;

    latency.total = Date.now() - startTime;

    res.json({
      success: true,
      mode: 'optimized',
      data: {
        original: caseDescription,
        compressed,
        recommendation,
        tokenStats,
        verification,
        confidence,
        latency
      }
    });

    logger.info(`Optimized processing completed in ${latency.total}ms`);
  } catch (error) {
    logger.error(`Optimized processing error: ${error.message}`);
    res.status(500).json({ error: 'Processing failed', message: error.message });
  }
}

async function processNaive(req, res) {
  const startTime = Date.now();
  const { caseDescription, apiKey } = req.body;

  if (!caseDescription || !apiKey) {
    return res.status(400).json({ error: 'Missing caseDescription or apiKey' });
  }

  try {
    const latency = {};
    
    const t1 = Date.now();
    const recommendation = await getLLMRecommendation(caseDescription, apiKey);
    latency.llm = Date.now() - t1;

    const tokenStats = {
      originalTokens: countTokens(caseDescription),
      compressedTokens: countTokens(caseDescription),
      reduction: '0.00'
    };

    latency.total = Date.now() - startTime;

    res.json({
      success: true,
      mode: 'naive',
      data: {
        original: caseDescription,
        recommendation,
        tokenStats,
        latency
      }
    });

    logger.info(`Naive processing completed in ${latency.total}ms`);
  } catch (error) {
    logger.error(`Naive processing error: ${error.message}`);
    res.status(500).json({ error: 'Processing failed', message: error.message });
  }
}

module.exports = { processOptimized, processNaive };
