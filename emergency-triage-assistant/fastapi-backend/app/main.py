from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import get_settings
from app.routes import upload, chat, upload_pdf, retrieve, query, chat_naive, chat_patient, case_history
from app.services.llm_service import LLMService
from app.services.groq_llm_service import GroqLLMService
import app.services.llm_service as llm_module
import app.services.groq_llm_service as groq_module

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize services on startup."""
    # Initialize LLM service
    llm_module.llm_service = LLMService(settings.groq_api_key)
    print(f"✓ LLM Service initialized")
    
    # Initialize Groq service
    groq_module.groq_service = GroqLLMService(settings.groq_api_key)
    
    print(f"✓ Embedding model loaded: {settings.embedding_model}")
    print(f"✓ FAISS index directory: {settings.faiss_index_dir}")
    yield
    # Cleanup on shutdown
    print("Shutting down...")

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(upload.router)
app.include_router(chat.router)
app.include_router(upload_pdf.router)
app.include_router(retrieve.router)
app.include_router(query.router)
app.include_router(chat_naive.router)
app.include_router(chat_patient.router)
app.include_router(case_history.router)

@app.get("/")
async def root():
    return {
        "app": settings.app_name,
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "embedding_model": settings.embedding_model,
        "chunk_size": settings.chunk_size
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
