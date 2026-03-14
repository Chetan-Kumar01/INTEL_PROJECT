function compressText(text) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\b(the|a|an|is|are|was|were|be|been|being)\b/gi, '')
    .replace(/[,;:]/g, '')
    .trim();
}

module.exports = { compressText };
