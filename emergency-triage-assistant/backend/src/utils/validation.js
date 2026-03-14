const { AppError } = require('../middleware/errorHandler');

function validateTriageInput(patientHistory, emergencyDescription) {
  if (!patientHistory || typeof patientHistory !== 'string') {
    throw new AppError('Patient history is required and must be a string', 400);
  }

  if (!emergencyDescription || typeof emergencyDescription !== 'string') {
    throw new AppError('Emergency description is required and must be a string', 400);
  }

  if (patientHistory.trim().length < 50) {
    throw new AppError('Patient history must be at least 50 characters', 400);
  }

  if (emergencyDescription.trim().length < 20) {
    throw new AppError('Emergency description must be at least 20 characters', 400);
  }

  if (patientHistory.length > 50000) {
    throw new AppError('Patient history exceeds maximum length of 50,000 characters', 400);
  }

  if (emergencyDescription.length > 5000) {
    throw new AppError('Emergency description exceeds maximum length of 5,000 characters', 400);
  }

  return true;
}

function validateApiKeys(scaleDownKey, llmKey, groqKey) {
  if (!scaleDownKey || !llmKey) {
    throw new AppError('ScaleDown and LLM API keys are required', 400);
  }

  if (typeof scaleDownKey !== 'string' || typeof llmKey !== 'string') {
    throw new AppError('API keys must be strings', 400);
  }

  if (!scaleDownKey.startsWith('sk-') || !llmKey.startsWith('sk-')) {
    throw new AppError('Invalid API key format', 400);
  }

  if (scaleDownKey.length < 20 || llmKey.length < 20) {
    throw new AppError('API keys appear to be invalid', 400);
  }

  if (groqKey && !groqKey.startsWith('gsk_')) {
    throw new AppError('Invalid Groq API key format (must start with gsk_)', 400);
  }

  return true;
}

module.exports = { validateTriageInput, validateApiKeys };
