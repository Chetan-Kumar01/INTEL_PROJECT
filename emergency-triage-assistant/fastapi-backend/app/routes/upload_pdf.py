from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.pdf_ingestion_service import pdf_service
from app.config import get_settings
from pathlib import Path

router = APIRouter(tags=["pdf-ingestion"])
settings = get_settings()

@router.post("/upload_pdf")
async def upload_pdf(
    patient_id: str = Form(...),
    file: UploadFile = File(...)
):
    """
    Upload PDF and create FAISS index.
    
    - Extracts text using PyMuPDF
    - Splits into 300-token chunks
    - Generates embeddings (all-MiniLM-L6-v2)
    - Stores in FAISS index as patient_{id}.index
    - Saves PDF for naive comparison
    """
    # Validate file type
    if not file.filename.endswith('.pdf'):
        raise HTTPException(400, "Only PDF files are allowed")
    
    # Read PDF bytes
    pdf_bytes = await file.read()
    
    # Save PDF file for naive endpoint
    pdf_dir = Path(settings.pdf_storage_dir)
    pdf_dir.mkdir(parents=True, exist_ok=True)
    pdf_path = pdf_dir / f"{patient_id}.pdf"
    with open(pdf_path, 'wb') as f:
        f.write(pdf_bytes)
    
    # Process PDF
    result = await pdf_service.process_pdf(patient_id, pdf_bytes)
    
    return {
        "patient_id": patient_id,
        "total_chunks": result["total_chunks"],
        "indexing_time_ms": result["indexing_time_ms"],
        "chunks_created": result["total_chunks"]
    }
