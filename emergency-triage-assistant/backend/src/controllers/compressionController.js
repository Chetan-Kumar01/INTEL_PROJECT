const { scaleDownCompress } = require('../services/scaleDown');
const logger = require('../utils/logger');

async function compressPatientData(req, res) {
  const { patientHistory, emergencyDescription, apiKey } = req.body;

  if (!patientHistory || !emergencyDescription || !apiKey) {
    return res.status(400).json({ 
      error: 'Missing required fields: patientHistory, emergencyDescription, apiKey' 
    });
  }

  try {
    const result = await scaleDownCompress(patientHistory, emergencyDescription, apiKey);
    
    res.json({
      success: true,
      data: result
    });

    logger.info(`Compression completed: ${result.reduction_percent}% reduction in ${result.compression_latency_ms}ms`);
  } catch (error) {
    logger.error(`Compression error: ${error.message}`);
    res.status(500).json({ 
      error: 'Compression failed', 
      message: error.message 
    });
  }
}

module.exports = { compressPatientData };
