const { extractTextFromPDF } = require('../rag-system/services/pdfExtractor');
const { chunkText } = require('../rag-system/utils/chunker');
const embeddingService = require('../rag-system/services/embeddingService');
const faissIndex = require('../rag-system/services/faissIndex');
const { queryGroqLLM } = require('../rag-system/services/groqService');
const { successResponse } = require('../utils/responseFormatter');
const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

const uploadPDF = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF file uploaded' });
  }

  const { patientId } = req.body;
  if (!patientId) {
    return res.status(400).json({ error: 'Patient ID required' });
  }

  const startTime = Date.now();

  // Extract text from PDF
  const t1 = Date.now();
  const { text, pages } = await extractTextFromPDF(req.file.buffer);
  const extractionTime = Date.now() - t1;

  // Chunk text
  const t2 = Date.now();
  const chunks = chunkText(text, 300, 50);
  const chunkingTime = Date.now() - t2;

  // Generate embeddings
  const t3 = Date.now();
  const chunkTexts = chunks.map(c => c.text);
  const embeddings = await embeddingService.generateEmbeddings(chunkTexts);
  const embeddingTime = Date.now() - t3;

  // Create FAISS index
  const t4 = Date.now();
  await faissIndex.createIndex(patientId, chunks, embeddings);
  const indexingTime = Date.now() - t4;

  const totalTime = Date.now() - startTime;

  logger.info(`PDF indexed for patient ${patientId}: ${chunks.length} chunks in ${totalTime}ms`);

  res.json(successResponse({
    patientId,
    pages,
    chunks: chunks.length,
    processing_time: {
      extraction_ms: extractionTime,
      chunking_ms: chunkingTime,
      embedding_ms: embeddingTime,
      indexing_ms: indexingTime,
      total_ms: totalTime
    }
  }));
});

const queryRAG = asyncHandler(async (req, res) => {
  const { patientId, query, mode = 'emergency', topK = 5 } = req.body;
  const { groq } = req.apiKeys;

  if (!patientId || !query) {
    return res.status(400).json({ error: 'Patient ID and query required' });
  }

  const startTime = Date.now();

  // Generate query embedding
  const t1 = Date.now();
  const [queryEmbedding] = await embeddingService.generateEmbeddings([query]);
  const embeddingTime = Date.now() - t1;

  // Retrieve top K chunks
  const t2 = Date.now();
  const results = await faissIndex.search(patientId, queryEmbedding, topK);
  const retrievalTime = Date.now() - t2;

  // Build context
  const context = results.map((r, i) => 
    `[Citation ${i + 1}] ${r.text}`
  ).join('\n\n');

  // Query Groq LLM
  const t3 = Date.now();
  const llmResponse = await queryGroqLLM(context, query, mode, groq);
  const llmTime = Date.now() - t3;

  const totalTime = Date.now() - startTime;

  logger.info(`RAG query for patient ${patientId} completed in ${totalTime}ms`);

  res.json(successResponse({
    answer: llmResponse.answer,
    citations: results.map((r, i) => ({
      id: i + 1,
      text: r.text,
      similarity: r.similarity.toFixed(4)
    })),
    mode,
    latency: {
      embedding_ms: embeddingTime,
      retrieval_ms: retrievalTime,
      llm_ms: llmTime,
      total_ms: totalTime
    },
    tokens_used: llmResponse.tokens_used
  }));
});

module.exports = { uploadPDF, queryRAG };
