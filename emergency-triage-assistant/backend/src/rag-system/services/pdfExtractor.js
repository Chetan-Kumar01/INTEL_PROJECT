const pdf = require('pdf-parse');

async function extractTextFromPDF(pdfBuffer) {
  try {
    const data = await pdf(pdfBuffer);
    return {
      text: data.text,
      pages: data.numpages,
      metadata: data.info
    };
  } catch (error) {
    throw new Error(`PDF extraction failed: ${error.message}`);
  }
}

module.exports = { extractTextFromPDF };
