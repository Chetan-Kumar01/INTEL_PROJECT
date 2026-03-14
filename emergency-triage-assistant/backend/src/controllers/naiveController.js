const { getStructuredRecommendation } = require('../services/structuredLLM');
const { verifyRecommendation } = require('../services/structuredVerification');
const { calculateStructuredConfidence } = require('../services/structuredConfidence');
const { countTokens } = require('../utils/tokenCounter');
const logger = require('../utils/logger');

async function processNaiveApproach(req, res) {
  const { patientHistory, emergencyDescription } = req.body;
  const { llm } = req.apiKeys;

  if (!patientHistory || !emergencyDescription) {
    return res.status(400).json({ 
      error: 'Missing required fields: patientHistory, emergencyDescription' 
    });
  }

  const performance = {};
  const startTotal = Date.now();

  try {
    const fullText = `${emergencyDescription}\n\nPatient History:\n${patientHistory}`;
    const tokens = countTokens(fullText);

    const t1 = Date.now();
    const recommendation = await getStructuredRecommendation(
      patientHistory,
      emergencyDescription,
      llm
    );
    performance.recommendation_ms = Date.now() - t1;

    const t2 = Date.now();
    const verification = verifyRecommendation(
      patientHistory,
      emergencyDescription,
      recommendation
    );
    performance.verification_ms = Date.now() - t2;

    const t3 = Date.now();
    const confidence = calculateStructuredConfidence(verification, recommendation, 0);
    performance.confidence_ms = Date.now() - t3;

    performance.total_ms = Date.now() - startTotal;

    res.json({
      success: true,
      data: {
        tokens,
        recommendation,
        verification,
        confidence,
        performance
      }
    });

    logger.info(`Naive approach completed in ${performance.total_ms}ms`);
  } catch (error) {
    logger.error(`Naive approach error: ${error.message}`);
    res.status(500).json({ 
      error: 'Processing failed', 
      message: error.message 
    });
  }
}

module.exports = { processNaiveApproach };
