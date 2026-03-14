function calculateConfidence(verificationScore, tokenReduction) {
  const verScore = parseFloat(verificationScore);
  const tokReduction = parseFloat(tokenReduction);
  
  const confidenceScore = (verScore * 0.7 + (100 - Math.min(tokReduction, 80)) * 0.3);
  
  return {
    score: confidenceScore.toFixed(2),
    level: confidenceScore > 75 ? 'High' : confidenceScore > 50 ? 'Medium' : 'Low'
  };
}

module.exports = { calculateConfidence };
