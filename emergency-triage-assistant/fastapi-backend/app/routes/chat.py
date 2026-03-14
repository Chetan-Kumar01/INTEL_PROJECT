from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Literal
from app.services.embedding_service import embedding_service
from app.services.retrieval_service import retrieval_service
from app.services.llm_service import llm_service
from app.utils.latency import LatencyTracker
from app.config import get_settings

router = APIRouter(prefix="/chat", tags=["chat"])
settings = get_settings()

class ChatRequest(BaseModel):
    patient_id: str
    query: str
    mode: Literal["emergency", "deep"] = "emergency"
    top_k: int = 5

@router.post("")
async def chat(request: ChatRequest):
    """Query patient records using RAG."""
    tracker = LatencyTracker()
    
    # Generate query embedding
    with tracker.track("embedding_ms"):
        query_embedding = await embedding_service.generate_single_embedding(request.query)
    
    # Retrieve relevant chunks
    with tracker.track("retrieval_ms"):
        try:
            results = await retrieval_service.search(
                request.patient_id, 
                query_embedding, 
                request.top_k
            )
        except ValueError as e:
            raise HTTPException(404, str(e))
    
    # Build context
    context = "\n\n".join([
        f"[Citation {i+1}] {r['text']}" 
        for i, r in enumerate(results)
    ])
    
    # Generate LLM response
    with tracker.track("llm_ms"):
        llm_response = await llm_service.generate_response(
            context, 
            request.query, 
            request.mode
        )
    
    return {
        "success": True,
        "data": {
            "answer": llm_response["answer"],
            "citations": [
                {
                    "id": i + 1,
                    "text": r["text"],
                    "similarity": round(r["similarity"], 4)
                }
                for i, r in enumerate(results)
            ],
            "mode": request.mode,
            "latency": tracker.get_timings(),
            "tokens": llm_response["tokens"]
        }
    }
