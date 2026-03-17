# 🚀 Emergency Triage Assistant - Groq Powered

## ✅ All Services Now Use Groq API

Both backends have been updated to use **Groq API (llama3-8b-8192)** instead of OpenAI.

## 🎯 Quick Start

### Option 1: Run Everything (Recommended)
```bash
cd emergency-triage-assistant
start-all.bat
```

This starts:
- Node.js Backend (port 5000) - Main triage app
- FastAPI Backend (port 8000) - RAG system
- React Frontend (port 5173)

### Option 2: Run Individual Services

**Terminal 1 - Node.js Backend:**
```bash
cd emergency-triage-assistant/backend
npm run dev
```

**Terminal 2 - FastAPI Backend:**
```bash
cd emergency-triage-assistant/fastapi-backend
python -m uvicorn app.main:app --reload --port 8000
```

**Terminal 3 - React Frontend:**
```bash
cd emergency-triage-assistant/frontend
npm run dev
```

## 🌐 Access Points

- **Main Triage App**: http://localhost:5173 (Uses Node.js + Groq)
- **RAG Dashboard**: http://localhost:5173/rag.html (Uses FastAPI + Groq)
- **API Docs**: http://localhost:8000/docs

## 🔑 API Configuration

### Node.js Backend (.env)
```
PORT=5000
NODE_ENV=development
GROQ_API_KEY=your_api_key_here

### FastAPI Backend (.env)
```
GROQ_API_KEY=your_api_key_here
EMBEDDING_MODEL=all-MiniLM-L6-v2
CHUNK_SIZE=300
FAISS_INDEX_DIR=./data/faiss_indexes
PDF_STORAGE_DIR=./data/pdfs
```

## 📋 What Changed

### ✅ Node.js Backend Updates
- `structuredLLM.js`: OpenAI → Groq API
- `llmFilter.js`: OpenAI → Groq API
- `apiKeyMiddleware.js`: Validates `gsk_` prefix (Groq keys)
- `.env`: Uses `GROQ_API_KEY` instead of `OPENAI_API_KEY`

### ✅ FastAPI Backend
- Already using Groq API (no changes needed)
- Endpoints: `/chat`, `/chat_naive`, `/upload-pdf`

## 🎯 Features

### Main Triage App (Node.js + Groq)
- ScaleDown compression (50-80% token reduction)
- Multi-stage AI pipeline
- Structured JSON recommendations
- Hallucination verification
- Confidence scoring
- A/B comparison mode

### RAG Dashboard (FastAPI + Groq)
- PDF upload and indexing
- FAISS vector search
- Emergency mode (<500ms target)
- Deep analysis mode
- Performance comparison (optimized vs naive)

## 🔬 Test the System

### Test Main Triage App
1. Go to http://localhost:5173
2. Click "Load Cardiac Sample"
3. Select mode: "Optimized" or "A/B Compare"
4. Click "Analyze Case"

### Test RAG Dashboard
1. Go to http://localhost:5173/rag.html
2. Upload a PDF with patient ID
3. Select Emergency or Deep mode
4. Query the records

### Test Performance Comparison
```bash
cd fastapi-backend
python test_comparison.py
```

Expected:
- Optimized: ~400ms
- Naive: >1200ms
- Speedup: ~3x

## 🐛 Troubleshooting

### "No API keys available" Error
This error is now fixed. The system uses Groq API keys from `.env` files.

### PyTorch Issues
```bash
pip uninstall torch torchvision torchaudio -y
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
```

### Port Already in Use
```bash
taskkill /F /IM python.exe
taskkill /F /IM node.exe
```

## 📊 Architecture

```
Frontend (React)
    ↓
    ├─→ Node.js Backend (Port 5000) → Groq API
    │   └─ ScaleDown + Multi-stage Pipeline
    │
    └─→ FastAPI Backend (Port 8000) → Groq API
        └─ FAISS + RAG Pipeline
```

## 🎉 All Set!

Run `start-all.bat` and access:
- Main App: http://localhost:5173
- RAG Dashboard: http://localhost:5173/rag.html

Both now powered by **Groq llama3-8b-8192**! 🚀
