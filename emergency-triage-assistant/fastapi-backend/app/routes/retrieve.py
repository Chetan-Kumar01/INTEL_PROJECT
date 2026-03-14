from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Literal
from app.services.fast_retrieval_service import retrieval_service

router = APIRouter(tags=["retrieval"])

class RetrieveRequest(BaseModel):
    patient_id: str
    query: str
    mode: Literal["emergency", "deep"] = "emergency"

@router.post("/retrieve")
async def retrieve(request: RetrieveRequest):
    """
    Retrieve most relevant chunks from patient index.
    
    Modes:
    - emergency: top_k = 3 (fast triage)
    - deep: top_k = 8 (comprehensive analysis)
    
    Target: < 100ms retrieval time
    """
    try:
        result = await retrieval_service.retrieve(
            patient_id=request.patient_id,
            query=request.query,
            mode=request.mode
        )
        
        return {
            "success": True,
            "data": result
        }
    
    except FileNotFoundError as e:
        raise HTTPException(404, str(e))
    
    except Exception as e:
        raise HTTPException(500, f"Retrieval failed: {str(e)}")
