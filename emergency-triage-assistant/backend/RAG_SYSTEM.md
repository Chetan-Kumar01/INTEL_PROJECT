# RAG System Documentation

## Overview

PDF-based Retrieval-Augmented Generation system with local embeddings and FAISS indexing.

## Architecture

```
PDF Upload → Text Extraction → Chunking (300 tokens) → Embeddings (local) → FAISS Index
                                                                                    ↓
User Query → Mode Switch → Retrieve Top K → Groq LLM → Answer + Citations + Latency
```

## API Endpoints

### POST `/api/rag/upload`

Upload and index patient PDF records.

**Request:**
```bash
curl -X POST http://localhost:5000/api/rag/upload \
  -H "X-Session-Id: your-session-id" \
  -F "pdf=@patient_record.pdf" \
  -F "patientId=patient-123"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "patientId": "patient-123",
    "pages": 20,
    "chunks": 67,
    "processing_time": {
      "extraction_ms": 450,
      "chunking_ms": 12,
      "embedding_ms": 2300,
      "indexing_ms": 45,
      "total_ms": 2807
    }
  }
}
```

### POST `/api/rag/query`

Query patient records using RAG.

**Request:**
```json
{
  "patientId": "patient-123",
  "query": "What cardiac medications is the patient taking?",
  "mode": "emergency",
  "topK": 5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "answer": "Based on the patient records, the patient is currently taking:\n1. Lisinopril 10mg daily for hypertension [Citation 1]\n2. Metoprolol 75mg twice daily for angina [Citation 2]\n3. Atorvastatin 40mg nightly for hyperlipidemia [Citation 1]",
    "citations": [
      {
        "id": 1,
        "text": "Current medications: Lisinopril 10mg daily, Metoprolol 75mg twice daily...",
        "similarity": "0.8945"
      }
    ],
    "mode": "emergency",
    "latency": {
      "embedding_ms": 180,
      "retrieval_ms": 25,
      "llm_ms": 1200,
      "total_ms": 1405
    },
    "tokens_used": {
      "prompt_tokens": 450,
      "completion_tokens": 85,
      "total_tokens": 535
    }
  }
}
```

## Query Modes

### Emergency Mode
- **Temperature**: 0.1 (more deterministic)
- **Max Tokens**: 500
- **Focus**: Immediate, actionable recommendations
- **Use Case**: Active emergencies requiring quick decisions

### Deep Mode
- **Temperature**: 0.3 (more creative)
- **Max Tokens**: 1000
- **Focus**: Comprehensive analysis
- **Use Case**: Detailed case review, research

## Setup

### 1. Install Python Dependencies

```bash
pip install sentence-transformers torch
```

### 2. Install Node Dependencies

```bash
npm install pdf-parse multer
```

### 3. Configure API Keys

Add Groq API key in Settings panel (optional, alongside OpenAI keys).

Get Groq key: https://console.groq.com/keys

### 4. Test Upload

```bash
curl -X POST http://localhost:5000/api/rag/upload \
  -H "X-Session-Id: your-session-id" \
  -F "pdf=@test.pdf" \
  -F "patientId=test-001"
```

## Technical Details

### Chunking Strategy
- **Chunk Size**: 300 tokens (~1200 characters)
- **Overlap**: 50 tokens (maintains context)
- **Method**: Word-based splitting

### Embedding Model
- **Model**: `all-MiniLM-L6-v2`
- **Dimensions**: 384
- **Speed**: ~100 chunks/second
- **Local**: No API calls, runs on CPU

### FAISS Index
- **Type**: JSON-based (simple implementation)
- **Search**: Cosine similarity
- **Storage**: Per-patient indexes in `data/faiss-indexes/`
- **Scalability**: Can be upgraded to actual FAISS library

### Groq LLM
- **Model**: `mixtral-8x7b-32768`
- **Context Window**: 32K tokens
- **Speed**: ~500 tokens/second
- **Cost**: Free tier available

## Performance

### Upload Performance
- **20-page PDF**: ~3 seconds
- **Breakdown**:
  - Extraction: 450ms
  - Chunking: 12ms
  - Embeddings: 2300ms (67 chunks)
  - Indexing: 45ms

### Query Performance
- **Total**: ~1.4 seconds
- **Breakdown**:
  - Query embedding: 180ms
  - Retrieval: 25ms
  - LLM generation: 1200ms

## Comparison: RAG vs ScaleDown

| Feature | RAG System | ScaleDown |
|---------|-----------|-----------|
| Input | PDF files | Text input |
| Processing | Chunking + Embeddings | Rule + LLM filtering |
| Storage | FAISS indexes | None |
| Retrieval | Vector search | N/A |
| Context | Top-K chunks | Compressed full text |
| Use Case | Document Q&A | Real-time triage |
| Latency | ~1.4s | ~2.8s |
| Setup | Python + embeddings | OpenAI only |

## Use Cases

### 1. Historical Record Search
```json
{
  "query": "Has the patient had any cardiac procedures?",
  "mode": "deep"
}
```

### 2. Medication Review
```json
{
  "query": "List all current medications",
  "mode": "emergency"
}
```

### 3. Risk Factor Analysis
```json
{
  "query": "What are the patient's cardiac risk factors?",
  "mode": "deep"
}
```

### 4. Emergency Context
```json
{
  "query": "Given chest pain, what's relevant from history?",
  "mode": "emergency"
}
```

## Limitations

1. **Embedding Quality**: Local model less accurate than OpenAI embeddings
2. **Index Size**: JSON storage not optimal for large datasets
3. **No Semantic Chunking**: Fixed token-based splitting
4. **Single Patient**: No cross-patient search
5. **No Caching**: Embeddings regenerated each upload

## Future Enhancements

1. **Actual FAISS**: Use `faiss-node` for true vector search
2. **Better Embeddings**: OpenAI `text-embedding-3-small`
3. **Semantic Chunking**: Paragraph/section-aware splitting
4. **Hybrid Search**: Combine keyword + vector search
5. **Caching**: Store embeddings, reuse for similar queries
6. **Multi-Modal**: Support images from PDFs
7. **Streaming**: Stream LLM responses for faster UX

## Error Handling

### Invalid PDF
```json
{
  "success": false,
  "error": "Only PDF files allowed"
}
```

### Patient Not Found
```json
{
  "success": false,
  "error": "Index not found for patient: patient-123"
}
```

### Embedding Failure
```json
{
  "success": false,
  "error": "Embedding generation failed: Python script error"
}
```

## Security

- PDFs processed in memory (not saved to disk)
- Indexes stored locally per patient
- No cross-patient data leakage
- Session-based authentication
- File size limit: 10MB

## Integration with Existing System

RAG system complements ScaleDown:

1. **Upload PDF**: Index patient history once
2. **Query RAG**: Get specific information quickly
3. **Use ScaleDown**: For real-time emergency triage
4. **Combine**: RAG for context + ScaleDown for compression

Both systems can run simultaneously for comprehensive medical AI support.
