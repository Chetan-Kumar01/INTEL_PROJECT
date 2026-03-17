from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import json
import os
from datetime import datetime

router = APIRouter(tags=["case-history"])

CASE_HISTORY_FILE = "data/case_history.json"

class CaseHistoryRequest(BaseModel):
    patient_name: str
    patient_id: str
    document_name: str
    messages: List[Dict[str, Any]]
    timestamp: str

def ensure_case_history_file():
    os.makedirs(os.path.dirname(CASE_HISTORY_FILE), exist_ok=True)
    if not os.path.exists(CASE_HISTORY_FILE):
        with open(CASE_HISTORY_FILE, 'w') as f:
            json.dump({"cases": []}, f)

@router.get("/case_history")
async def get_case_history():
    """Retrieve all saved case histories"""
    try:
        ensure_case_history_file()
        with open(CASE_HISTORY_FILE, 'r') as f:
            data = json.load(f)
        return data
    except Exception as e:
        raise HTTPException(500, f"Failed to load case history: {str(e)}")

@router.post("/case_history")
async def save_case_history(request: CaseHistoryRequest):
    """Save a new case history"""
    try:
        ensure_case_history_file()
        
        with open(CASE_HISTORY_FILE, 'r') as f:
            data = json.load(f)
        
        new_case = {
            "patient_name": request.patient_name,
            "patient_id": request.patient_id,
            "document_name": request.document_name,
            "messages": request.messages,
            "timestamp": request.timestamp
        }
        
        data["cases"].append(new_case)
        
        with open(CASE_HISTORY_FILE, 'w') as f:
            json.dump(data, f, indent=2)
        
        return {"success": True, "message": "Case saved successfully"}
    
    except Exception as e:
        raise HTTPException(500, f"Failed to save case history: {str(e)}")
