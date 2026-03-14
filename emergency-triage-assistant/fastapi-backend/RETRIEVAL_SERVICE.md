# Fast Retrieval Service Documentation

## Overview

High-performance retrieval service with in-memory index caching, targeting sub-100ms retrieval.

## Architecture

```
Query String
    ↓
Generate Embedding (~50ms)
    ↓
Load FAISS Index (cached, ~0ms)
    ↓
Vector Search (~5ms)
    ↓
Return Top K Chunks + Scores
    ↓
Total: < 100ms ⚡
```

## API Endpoint

### POST `/retrieve`

Retrieve most relevant chunks from patient index.

**Request:**
```json
{
  "patient_id": "patient-123",
  "query": "What cardiac medications is the patient taking?",
  "mode": "emergency"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "chunks": [
      {
        "chunk_id": 12,
        "text": "Current medications: Lisinopril 10mg daily, Metoprolol 75mg twice daily, Atorvastatin 40mg nightly...",
        "similarity_score": 0.8945,
        "distance": 0.1180
      },
      {
        "chunk_id": 34,
        "text": "Cardiac medications adjusted in 2023: Increased Metoprolol to 75mg...",
        "similarity_score": 0.8234,
        "distance": 0.2145
      },
      {
        "chunk_id": 8,
        "text": "Patient has been compliant with cardiac medication regimen...",
        "similarity_score": 0.7891,
        "distance": 0.2671
      }
    ],
    "mode": "emergency",
    "top_k": 3,
    "retrieval_time_ms": 67.45,
    "breakdown": {
      "load_ms": 0.12,
      "embedding_ms": 52.34,
      "search_ms": 4.89
    }
  }
}
```

## Mode Configurations

### Emergency Mode
- **top_k**: 3 chunks
- **Use Case**: Fast triage, immediate decisions
- **Target**: < 100ms
- **Typical Time**: 60-80ms

### Deep Analysis Mode
- **top_k**: 8 chunks
- **Use Case**: Comprehensive review, research
- **Target**: < 100ms
- **Typical Time**: 70-90ms

## Performance Optimization

### 1. Index Caching
Indexes loaded once and cached in memory:
```python
# First call: loads from disk (~50ms)
retrieve(patient_id="123", query="...")

# Subsequent calls: from cache (~0ms)
retrieve(patient_id="123", query="...")
```

### 2. Embedding Model Singleton
Model loaded once at startup, reused for all queries.

### 3. FAISS IndexFlatL2
Optimized for speed:
- No training required
- Direct L2 distance computation
- Sub-millisecond search for <10K vectors

### 4. Async Operations
Non-blocking I/O for concurrent requests.

## Performance Benchmarks

### Emergency Mode (top_k=3)
| Operation | Time |
|-----------|------|
| Load Index (cached) | 0.1ms |
| Generate Embedding | 50-55ms |
| FAISS Search | 3-5ms |
| **Total** | **60-70ms** ✅ |

### Deep Mode (top_k=8)
| Operation | Time |
|-----------|------|
| Load Index (cached) | 0.1ms |
| Generate Embedding | 50-55ms |
| FAISS Search | 5-8ms |
| **Total** | **70-80ms** ✅ |

### First Call (Cold Start)
| Operation | Time |
|-----------|------|
| Load Index (disk) | 40-50ms |
| Generate Embedding | 50-55ms |
| FAISS Search | 3-5ms |
| **Total** | **100-110ms** ⚠️ |

**Note**: First call may exceed 100ms due to disk I/O. Subsequent calls are cached.

## Usage Examples

### Python
```python
import requests

url = "http://localhost:8000/retrieve"

# Emergency mode
response = requests.post(url, json={
    "patient_id": "patient-123",
    "query": "What cardiac medications?",
    "mode": "emergency"
})

result = response.json()["data"]
print(f"Retrieved {len(result['chunks'])} chunks in {result['retrieval_time_ms']}ms")

for chunk in result['chunks']:
    print(f"Score: {chunk['similarity_score']:.4f}")
    print(f"Text: {chunk['text'][:100]}...")
```

### JavaScript
```javascript
const response = await fetch('http://localhost:8000/retrieve', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    patient_id: 'patient-123',
    query: 'What cardiac medications?',
    mode: 'emergency'
  })
});

const { data } = await response.json();
console.log(`Retrieved in ${data.retrieval_time_ms}ms`);
```

### cURL
```bash
curl -X POST http://localhost:8000/retrieve \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "patient-123",
    "query": "What cardiac medications?",
    "mode": "emergency"
  }'
```

## Similarity Scoring

### L2 Distance to Similarity
```python
similarity = 1 / (1 + distance)
```

- **Distance 0.0** → Similarity 1.0 (perfect match)
- **Distance 0.5** → Similarity 0.67
- **Distance 1.0** → Similarity 0.5
- **Distance 2.0** → Similarity 0.33

### Interpretation
- **> 0.8**: Highly relevant
- **0.6-0.8**: Relevant
- **0.4-0.6**: Somewhat relevant
- **< 0.4**: Low relevance

## Error Handling

### Patient Not Found
```json
{
  "detail": "Index not found for patient: patient-999"
}
```

### Invalid Mode
```json
{
  "detail": "Input should be 'emergency' or 'deep'"
}
```

### Retrieval Failed
```json
{
  "detail": "Retrieval failed: [error details]"
}
```

## Integration Example

Complete workflow:
```python
import requests

# 1. Upload PDF
upload_response = requests.post(
    'http://localhost:8000/upload_pdf',
    files={'file': open('patient.pdf', 'rb')},
    data={'patient_id': 'patient-123'}
)

# 2. Retrieve relevant chunks
retrieve_response = requests.post(
    'http://localhost:8000/retrieve',
    json={
        'patient_id': 'patient-123',
        'query': 'What medications?',
        'mode': 'emergency'
    }
)

chunks = retrieve_response.json()['data']['chunks']

# 3. Use chunks for LLM context
context = "\n\n".join([c['text'] for c in chunks])
```

## Optimization Tips

### 1. Warm Up Cache
Pre-load frequently accessed indexes:
```python
# On startup
for patient_id in frequent_patients:
    retrieval_service.load_index(patient_id)
```

### 2. Batch Queries
Process multiple queries in parallel:
```python
import asyncio

queries = [
    {"patient_id": "123", "query": "medications?"},
    {"patient_id": "123", "query": "allergies?"},
    {"patient_id": "123", "query": "history?"}
]

results = await asyncio.gather(*[
    retrieve(q) for q in queries
])
```

### 3. Index Compression
For large indexes (>100K chunks), use quantization:
```python
# Use IndexIVFFlat instead of IndexFlatL2
index = faiss.IndexIVFFlat(quantizer, dimension, nlist)
```

### 4. GPU Acceleration
For high-throughput scenarios:
```python
# Use GPU FAISS
import faiss
res = faiss.StandardGpuResources()
index = faiss.index_cpu_to_gpu(res, 0, index)
```

## Monitoring

Track retrieval performance:
```python
# Log slow retrievals
if retrieval_time_ms > 100:
    logger.warning(f"Slow retrieval: {retrieval_time_ms}ms for {patient_id}")

# Track cache hit rate
cache_hits = len(index_cache)
total_requests = request_count
hit_rate = cache_hits / total_requests
```

## Comparison: Emergency vs Deep

| Metric | Emergency | Deep |
|--------|-----------|------|
| Top K | 3 | 8 |
| Retrieval Time | 60-70ms | 70-80ms |
| Context Size | ~900 tokens | ~2400 tokens |
| Use Case | Fast triage | Comprehensive |
| Accuracy | High precision | High recall |

## Testing

Run test script:
```bash
python test_retrieval.py
```

Expected output:
```
==================================================
Testing Emergency Mode (top_k=3)
==================================================
✓ Success!
  Mode: emergency
  Top K: 3
  Retrieval Time: 67.45ms
  Breakdown:
    - Load: 0.12ms
    - Embedding: 52.34ms
    - Search: 4.89ms

  Retrieved 3 chunks:
    1. Score: 0.8945
       Text: Current medications: Lisinopril 10mg...
    2. Score: 0.8234
       Text: Cardiac medications adjusted...
    3. Score: 0.7891
       Text: Patient has been compliant...

==================================================
Testing Deep Analysis Mode (top_k=8)
==================================================
✓ Success!
  Mode: deep
  Top K: 8
  Retrieval Time: 78.23ms
  Retrieved 8 chunks
  ⚡ Target achieved: < 100ms
```

## Production Deployment

### Environment Variables
```env
EMBEDDING_MODEL=all-MiniLM-L6-v2
FAISS_INDEX_DIR=./data/indexes
```

### Docker
```dockerfile
FROM python:3.10-slim

RUN pip install sentence-transformers faiss-cpu

COPY app/ /app/
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0"]
```

### Load Balancing
For high traffic, use multiple workers:
```bash
uvicorn app.main:app --workers 4 --host 0.0.0.0
```

Each worker maintains its own index cache.

## Troubleshooting

**Retrieval > 100ms:**
- Check if index is cached (first call is slower)
- Verify embedding model is loaded
- Monitor CPU usage

**Out of memory:**
- Limit number of cached indexes
- Implement LRU cache eviction
- Use index compression

**Low similarity scores:**
- Check query phrasing
- Verify PDF text quality
- Consider re-chunking strategy

---

**Built for AI Clinical Intelligence System** 🏥⚡
