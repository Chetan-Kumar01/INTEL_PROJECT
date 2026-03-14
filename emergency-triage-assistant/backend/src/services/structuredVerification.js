function verifyRecommendation(compressedHistory, emergencyDescription, recommendation) {
  const sourceText = `${emergencyDescription} ${compressedHistory}`.toLowerCase();
  const unsupportedClaims = [];
  
  const allText = JSON.stringify(recommendation).toLowerCase();
  const sentences = allText.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  sentences.forEach(sentence => {
    const words = sentence.split(/\s+/).filter(w => w.length > 4);
    const matchCount = words.filter(word => sourceText.includes(word)).length;
    
    if (matchCount < words.length * 0.3 && words.length > 3) {
      unsupportedClaims.push(sentence.trim().substring(0, 100));
    }
  });

  const status = unsupportedClaims.length === 0 ? 'Verified' : 
                 unsupportedClaims.length <= 2 ? 'Mostly Verified' : 'Needs Review';

  return {
    status,
    unsupported_claims: unsupportedClaims.slice(0, 3)
  };
}

module.exports = { verifyRecommendation };
