# RAG Dashboard - Quick Start

## 🚀 Running the RAG Dashboard

### Backend (FastAPI)
```bash
cd fastapi-backend
python -m uvicorn app.main:app --reload --port 8000
```

### Frontend (React + Vite)
```bash
cd frontend
npm run dev
```

Then open: `http://localhost:5173/rag.html`

## 📋 Features

### PDF Upload
- Upload patient medical records (PDF format)
- Automatic chunking and FAISS indexing
- Patient ID-based organization

### Query Interface
- **🔴 Emergency Mode**: Fast response (<500ms target), top_k=3, 150 tokens
- **🔵 Deep Analysis Mode**: Comprehensive analysis, top_k=8, 400 tokens
- Real-time query processing with RAG pipeline

### Performance Metrics
- Retrieval latency tracking
- LLM generation time
- Total pipeline latency
- Visual indicators for <500ms emergency target

### Response Display
- AI-generated answer
- Retrieved document segments with similarity scores
- Citation tracking
- Latency breakdown visualization

## 🎯 Emergency Mode Optimization

Target: **<500ms total pipeline**

Breakdown:
- FAISS Retrieval: ~50ms (in-memory caching)
- Groq LLM (llama3-8b-8192): ~400ms
- Total: ~450ms ✅

## 🔧 API Endpoints

### POST /upload-pdf
Upload and index patient PDF
```json
{
  "file": "<PDF file>",
  "patient_id": "patient_001"
}
```

### POST /chat
Query patient records
```json
{
  "patient_id": "patient_001",
  "query": "What are the patient's current medications?",
  "mode": "emergency"
}
```

Response:
```json
{
  "answer": "...",
  "cited_segments": [...],
  "latency": {
    "retrieval_ms": 45,
    "llm_ms": 380,
    "total_ms": 425
  }
}
```

## 🏥 Hospital-Style UI

- Clean medical-themed design
- Glassmorphism cards
- Real-time latency indicators
- Color-coded performance metrics
- Responsive layout
- Dark mode optimized

## 📊 Performance Indicators

- **Green**: <500ms (Emergency target met)
- **Yellow**: 500-1000ms (Acceptable)
- **Red**: >1000ms (Needs optimization)
