function calculateStructuredConfidence(verification, recommendation, tokenReduction) {
  const factors = [];
  let score = 50;

  if (verification.status === 'Verified') {
    score += 30;
    factors.push('All claims supported by source data');
  } else if (verification.status === 'Mostly Verified') {
    score += 15;
    factors.push('Most claims verified');
  } else {
    factors.push('Some unsupported claims detected');
  }

  if (recommendation.uncertainty_level === 'Low') {
    score += 20;
    factors.push('Low uncertainty in diagnosis');
  } else if (recommendation.uncertainty_level === 'Medium') {
    score += 10;
    factors.push('Moderate uncertainty');
  } else {
    factors.push('High uncertainty acknowledged');
  }

  if (tokenReduction > 50) {
    factors.push(`High compression (${tokenReduction}%) may reduce context`);
    score -= 5;
  }

  score = Math.max(0, Math.min(100, score));

  return {
    score: score.toFixed(2),
    reasoning: factors.join('. ') + '.'
  };
}

module.exports = { calculateStructuredConfidence };
