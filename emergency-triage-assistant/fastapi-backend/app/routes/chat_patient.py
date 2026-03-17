from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Literal, Optional
from app.services.fast_retrieval_service import retrieval_service
import app.services.groq_llm_service as groq_module

router = APIRouter(tags=["patient-chat"])

class PatientChatRequest(BaseModel):
    patient_id: str
    question: str
    mode: Literal["emergency", "deep"] = "deep"

@router.post("/chat_patient")
async def chat_with_patient_data(request: PatientChatRequest):
    """
    Chat about patient data using RAG (Retrieval-Augmented Generation).
    
    - Retrieves relevant chunks from patient's uploaded documents
    - Uses Groq LLM to answer questions based on the retrieved context
    - Includes citation of source chunks
    
    Modes:
    - deep: More thorough analysis with more context
    - emergency: Focused, quick response
    """
    try:
        # Retrieve relevant chunks from patient index
        retrieval_result = await retrieval_service.retrieve(
            patient_id=request.patient_id,
            query=request.question,
            mode=request.mode
        )
        
        # Build context from retrieved chunks
        context_chunks = retrieval_result["chunks"]
        if not context_chunks:
            return {
                "success": True,
                "answer": "I couldn't find relevant information in the uploaded patient documents to answer this question.",
                "sources": [],
                "retrieval_latency_ms": retrieval_result["retrieval_time_ms"],
                "llm_latency_ms": 0
            }
        
        # Prepare context for LLM
        context_text = "\n\n---\n\n".join([
            f"[Chunk {chunk['chunk_id']}] {chunk['text']}"
            for chunk in context_chunks
        ])
        
        # Generate answer using Groq
        groq_service = groq_module.groq_service
        llm_result = await groq_service.generate(
            context=context_text,
            query=request.question,
            mode=request.mode
        )
        
        return {
            "success": True,
            "answer": llm_result["answer"],
            "sources": [
                {
                    "chunk_id": chunk["chunk_id"],
                    "text": chunk["text"][:200] + "..." if len(chunk["text"]) > 200 else chunk["text"],
                    "similarity_score": chunk["similarity_score"]
                }
                for chunk in context_chunks
            ],
            "retrieval_latency_ms": retrieval_result["retrieval_time_ms"],
            "llm_latency_ms": llm_result.get("llm_latency_ms", 0)
        }
    
    except FileNotFoundError as e:
        raise HTTPException(404, f"No documents found for patient: {request.patient_id}")
    
    except Exception as e:
        raise HTTPException(500, f"Chat failed: {str(e)}")
