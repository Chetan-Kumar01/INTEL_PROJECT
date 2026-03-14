function verifyHallucination(originalText, recommendation) {
  const keywords = originalText.toLowerCase().split(/\s+/);
  const recLower = recommendation.toLowerCase();
  
  let matchCount = 0;
  keywords.forEach(keyword => {
    if (keyword.length > 3 && recLower.includes(keyword)) {
      matchCount++;
    }
  });

  const score = Math.min((matchCount / Math.max(keywords.length * 0.3, 1)) * 100, 100);
  return {
    verified: score > 40,
    score: score.toFixed(2),
    status: score > 60 ? 'High Confidence' : score > 40 ? 'Medium Confidence' : 'Low Confidence'
  };
}

module.exports = { verifyHallucination };
