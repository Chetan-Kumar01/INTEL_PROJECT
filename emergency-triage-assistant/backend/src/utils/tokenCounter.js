function countTokens(text) {
  return Math.ceil(text.length / 4);
}

function calculateTokenReduction(original, compressed) {
  const originalTokens = countTokens(original);
  const compressedTokens = countTokens(compressed);
  const reduction = ((originalTokens - compressedTokens) / originalTokens * 100).toFixed(2);
  return { originalTokens, compressedTokens, reduction };
}

module.exports = { countTokens, calculateTokenReduction };
