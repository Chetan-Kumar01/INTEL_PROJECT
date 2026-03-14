# AI Clinical Intelligence System - FastAPI Backend

Production-ready FastAPI backend with RAG, FAISS indexing, and Groq LLM.

## 🏗️ Architecture

```
FastAPI Backend
├── PDF Upload → Text Extraction → Chunking → Embeddings → FAISS Index
└── Chat Query → Embedding → Retrieval → LLM → Response + Citations
```

## 📁 Project Structure

```
fastapi-backend/
├── app/
│   ├── main.py              # FastAPI application
│   ├── config.py            # Environment configuration
│   ├── routes/
│   │   ├── upload.py        # PDF upload endpoint
│   │   └── chat.py          # RAG query endpoint
│   ├── services/
│   │   ├── pdf_service.py   # PDF extraction & chunking
│   │   ├── embedding_service.py  # Sentence-transformers
│   │   ├── retrieval_service.py  # FAISS indexing
│   │   └── llm_service.py   # Groq LLM integration
│   └── utils/
│       └── latency.py       # Performance tracking
├── requirements.txt
├── .env
└── README.md
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd fastapi-backend
pip install -r requirements.txt
```

### 2. Configure Environment

Edit `.env`:
```env
GROQ_API_KEY=your_groq_api_key_here
```

Get Groq API key: https://console.groq.com/keys

### 3. Run Server

```bash
# Development
uvicorn app.main:app --reload --port 8000

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

Server runs on: **http://localhost:8000**

## 📡 API Endpoints

### POST `/upload`

Upload and index patient PDF.

**Request:**
```bash
curl -X POST http://localhost:8000/upload \
  -F "pdf=@patient_record.pdf" \
  -F "patient_id=patient-123"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "patient_id": "patient-123",
    "pages": 20,
    "chunks": 67,
    "latency": {
      "extraction_ms": 450.23,
      "chunking_ms": 12.45,
      "embedding_ms": 2301.67,
      "indexing_ms": 45.89,
      "total_ms": 2810.24
    }
  }
}
```

### POST `/chat`

Query patient records using RAG.

**Request:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "patient-123",
    "query": "What cardiac medications is the patient taking?",
    "mode": "emergency",
    "top_k": 5
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "answer": "Based on the patient records, the patient is currently taking:\n1. Lisinopril 10mg daily [Citation 1]\n2. Metoprolol 75mg twice daily [Citation 2]\n3. Atorvastatin 40mg nightly [Citation 1]",
    "citations": [
      {
        "id": 1,
        "text": "Current medications: Lisinopril 10mg daily, Metoprolol 75mg...",
        "similarity": 0.8945
      }
    ],
    "mode": "emergency",
    "latency": {
      "embedding_ms": 180.45,
      "retrieval_ms": 25.67,
      "llm_ms": 1205.89,
      "total_ms": 1412.01
    },
    "tokens": {
      "prompt": 450,
      "completion": 85,
      "total": 535
    }
  }
}
```

### GET `/health`

Health check endpoint.

```bash
curl http://localhost:8000/health
```

## 🔧 Configuration

All settings in `.env`:

| Variable | Default | Description |
|----------|---------|-------------|
| GROQ_API_KEY | - | Groq API key (required) |
| OPENAI_API_KEY | - | OpenAI key (optional) |
| EMBEDDING_MODEL | all-MiniLM-L6-v2 | Sentence-transformers model |
| CHUNK_SIZE | 300 | Tokens per chunk |
| CHUNK_OVERLAP | 50 | Overlap between chunks |
| TOP_K | 5 | Number of chunks to retrieve |
| FAISS_INDEX_DIR | ./data/faiss_indexes | Index storage path |
| MAX_FILE_SIZE | 10485760 | Max PDF size (10MB) |

## 🎯 Query Modes

### Emergency Mode
- **Temperature**: 0.1 (deterministic)
- **Max Tokens**: 500
- **Use Case**: Immediate triage decisions

### Deep Mode
- **Temperature**: 0.3 (creative)
- **Max Tokens**: 1000
- **Use Case**: Comprehensive analysis

## ⚡ Performance

### Upload Performance (20-page PDF)
- **Extraction**: ~450ms
- **Chunking**: ~12ms
- **Embeddings**: ~2300ms (67 chunks)
- **Indexing**: ~45ms
- **Total**: ~2.8 seconds

### Query Performance
- **Embedding**: ~180ms
- **Retrieval**: ~25ms
- **LLM**: ~1200ms
- **Total**: ~1.4 seconds

## 🔒 Security Features

- ✅ File type validation (PDF only)
- ✅ File size limits (10MB)
- ✅ CORS enabled
- ✅ Environment variable secrets
- ✅ Async operations (non-blocking)
- ✅ Error handling with HTTP status codes

## 🧪 Testing

### Test Upload
```bash
curl -X POST http://localhost:8000/upload \
  -F "pdf=@test.pdf" \
  -F "patient_id=test-001"
```

### Test Query
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "test-001",
    "query": "What is the patient history?",
    "mode": "emergency"
  }'
```

## 📊 API Documentation

FastAPI auto-generates interactive docs:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🚀 Production Deployment

### Docker

```dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/ ./app/
COPY .env .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Run with Docker

```bash
docker build -t clinical-ai .
docker run -p 8000:8000 clinical-ai
```

### Environment Variables (Production)

```bash
export GROQ_API_KEY=your_key
export FAISS_INDEX_DIR=/data/indexes
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 🔄 Integration with Frontend

```javascript
// Upload PDF
const formData = new FormData();
formData.append('pdf', pdfFile);
formData.append('patient_id', 'patient-123');

const uploadResponse = await fetch('http://localhost:8000/upload', {
  method: 'POST',
  body: formData
});

// Query
const queryResponse = await fetch('http://localhost:8000/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    patient_id: 'patient-123',
    query: 'What medications?',
    mode: 'emergency'
  })
});
```

## 🐛 Troubleshooting

**Port already in use:**
```bash
uvicorn app.main:app --port 8001
```

**FAISS not found:**
```bash
pip install faiss-cpu
```

**Sentence-transformers slow:**
First run downloads model (~90MB). Subsequent runs use cache.

**Groq API errors:**
Verify API key at https://console.groq.com/keys

## 📈 Monitoring

Add logging:
```python
import logging
logging.basicConfig(level=logging.INFO)
```

Track metrics:
```python
from app.utils.latency import LatencyTracker
tracker = LatencyTracker()
```

## 🎓 Key Features

✅ **Async/Await**: Non-blocking operations
✅ **FAISS In-Memory**: Fast vector search
✅ **Sentence-Transformers**: Local embeddings
✅ **Groq LLM**: Fast inference (Mixtral-8x7b)
✅ **Structured Responses**: Consistent JSON
✅ **Latency Tracking**: Per-stage timing
✅ **CORS Enabled**: Frontend integration ready
✅ **Auto Documentation**: Swagger + ReDoc
✅ **Production Ready**: Error handling, validation

## 📝 License

MIT License

---

**Built for AI Clinical Intelligence System** 🏥
