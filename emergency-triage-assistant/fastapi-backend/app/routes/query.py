from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Literal
from app.services.fast_retrieval_service import retrieval_service
from app.services.groq_llm_service import groq_service

router = APIRouter(tags=["query"])

class QueryRequest(BaseModel):
    patient_id: str
    query: str
    mode: Literal["emergency", "deep"] = "emergency"

async def _process_query(request: QueryRequest):
    """Core RAG pipeline logic."""
    try:
        # Step 1: Retrieve relevant chunks
        retrieval_result = await retrieval_service.retrieve(
            patient_id=request.patient_id,
            query=request.query,
            mode=request.mode
        )
        
        # Step 2: Build context from chunks
        context = "\n\n".join([
            f"[Segment {i+1}] {chunk['text']}"
            for i, chunk in enumerate(retrieval_result["chunks"])
        ])
        
        # Step 3: Generate LLM response
        llm_result = await groq_service.generate(
            context=context,
            query=request.query,
            mode=request.mode
        )
        
        # Calculate total latency
        total_latency = (
            retrieval_result["retrieval_time_ms"] + 
            llm_result["llm_latency_ms"]
        )
        
        return {
            "answer": llm_result["answer"],
            "cited_segments": [
                {
                    "segment_id": i + 1,
                    "text": chunk["text"][:200] + "...",
                    "similarity": chunk["similarity_score"]
                }
                for i, chunk in enumerate(retrieval_result["chunks"])
            ],
            "latency": {
                "retrieval_ms": retrieval_result["retrieval_time_ms"],
                "llm_ms": llm_result["llm_latency_ms"],
                "total_ms": round(total_latency, 2)
            }
        }
    
    except FileNotFoundError as e:
        raise HTTPException(404, str(e))
    
    except Exception as e:
        raise HTTPException(500, f"Query failed: {str(e)}")

@router.post("/query")
async def query(request: QueryRequest):
    """
    Complete RAG pipeline: Retrieve + LLM generation.
    
    Modes:
    🔴 Emergency: top_k=3, max_tokens=150, fast response
    🔵 Deep: top_k=8, max_tokens=400, detailed analysis
    """
    return await _process_query(request)

@router.post("/chat")
async def chat(request: QueryRequest):
    """
    Chat endpoint with RAG pipeline.
    Emergency mode optimized for <500ms total latency.
    
    Flow:
    1. Load patient FAISS index
    2. Retrieve chunks based on mode
    3. Send context to Groq LLM
    4. Return answer + cited chunks + latency
    """
    return await _process_query(request)
