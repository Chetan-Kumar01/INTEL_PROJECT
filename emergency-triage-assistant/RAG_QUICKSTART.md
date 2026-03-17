# 🚀 Quick Start - RAG Dashboard

## ✅ Prerequisites Check

1. **Python 3.10** installed
2. **Node.js** installed
3. **Groq API Key** (already in `.env`)

## 🎯 Run the Application

### Option 1: Automated Startup (Recommended)
```bash
cd emergency-triage-assistant
start-rag.bat
```

### Option 2: Manual Startup

**Terminal 1 - FastAPI Backend (Groq-powered):**
```bash
cd emergency-triage-assistant/fastapi-backend
python -m uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - React Frontend:**
```bash
cd emergency-triage-assistant/frontend
npm run dev
```

## 🌐 Access Points

- **RAG Dashboard**: http://localhost:5173/rag.html ⭐ (Use this for Groq)
- **Main Triage App**: http://localhost:5173 (Uses OpenAI)
- **API Docs**: http://localhost:8000/docs

## 🔑 API Configuration

The RAG Dashboard uses **FastAPI backend (port 8000)** which is powered by **Groq**.

Your `.env` file in `fastapi-backend/`:
```
GROQ_API_KEY=your_api_key_here

## 📋 How to Use

1. **Upload PDF**: 
   - Enter Patient ID (e.g., `patient_001`)
   - Select PDF file
   - Click "Upload & Index"

2. **Query Records**:
   - Select mode: 🔴 Emergency (<500ms) or 🔵 Deep Analysis
   - Enter your question
   - Click "Query Records"

3. **View Results**:
   - AI Response (powered by Groq)
   - Performance metrics
   - Retrieved document segments

## 🔬 Test Performance Comparison

Compare Optimized vs Naive approaches:
```bash
cd fastapi-backend
python test_comparison.py
```

Expected results:
- **Optimized (RAG)**: ~400ms
- **Naive (Full Doc)**: >1200ms
- **Speedup**: ~3x faster

## ⚡ Endpoints

### POST /upload-pdf
Upload and index patient PDF

### POST /chat
Optimized RAG query (retrieval + Groq LLM)

### POST /chat_naive
Naive approach (full document to Groq LLM)

## 🐛 Troubleshooting

**"No API keys available"** warning:
- This is from the Node.js backend (port 5000)
- **Ignore it** - RAG Dashboard uses FastAPI (port 8000) with Groq
- Only affects the main triage app, not RAG Dashboard

**PyTorch errors**:
```bash
pip uninstall torch torchvision torchaudio -y
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
```

**Port already in use**:
```bash
# Kill existing processes
taskkill /F /IM python.exe
taskkill /F /IM node.exe
```

## 📊 Architecture

```
Frontend (React) → FastAPI (Port 8000) → Groq LLM
                                       ↓
                                   FAISS Index
                                       ↓
                              Sentence Transformers
```

## 🎯 Key Features

✅ Groq-powered LLM (llama3-8b-8192)
✅ FAISS vector search
✅ Emergency mode (<500ms target)
✅ Deep analysis mode
✅ Performance comparison
✅ Citation tracking
