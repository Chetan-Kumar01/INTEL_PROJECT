from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import PyPDF2
import io
from pathlib import Path
from app.services.groq_llm_service import groq_service
from app.config import get_settings

router = APIRouter(tags=["naive"])
settings = get_settings()

class NaiveChatRequest(BaseModel):
    patient_id: str
    query: str

@router.post("/chat_naive")
async def chat_naive(request: NaiveChatRequest):
    """
    Naive approach: Send full patient PDF content to LLM without retrieval.
    
    Purpose: Benchmark comparison
    - Optimized Mode: ~400ms (RAG with top_k=3)
    - Naive Mode: >1200ms (full document context)
    """
    try:
        # Load full PDF content
        pdf_path = Path(settings.pdf_storage_dir) / f"{request.patient_id}.pdf"
        
        if not pdf_path.exists():
            raise HTTPException(404, f"Patient PDF not found: {request.patient_id}")
        
        # Extract all text from PDF
        with open(pdf_path, 'rb') as f:
            pdf_reader = PyPDF2.PdfReader(f)
            full_text = "\n\n".join([page.extract_text() for page in pdf_reader.pages])
        
        # Send full context to LLM (no retrieval optimization)
        llm_result = await groq_service.generate_naive(
            full_context=full_text,
            query=request.query
        )
        
        return {
            "answer": llm_result["answer"],
            "approach": "naive",
            "latency": {
                "retrieval_ms": 0,
                "llm_ms": llm_result["llm_latency_ms"],
                "total_ms": llm_result["llm_latency_ms"]
            },
            "context_size": len(full_text)
        }
    
    except FileNotFoundError as e:
        raise HTTPException(404, str(e))
    
    except Exception as e:
        raise HTTPException(500, f"Naive query failed: {str(e)}")
