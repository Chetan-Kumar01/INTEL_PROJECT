from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.pdf_service import extract_text_from_pdf, chunk_text
from app.services.embedding_service import embedding_service
from app.services.retrieval_service import retrieval_service
from app.utils.latency import LatencyTracker
from app.config import get_settings

router = APIRouter(prefix="/upload", tags=["upload"])
settings = get_settings()

@router.post("")
async def upload_pdf(
    pdf: UploadFile = File(...),
    patient_id: str = Form(...)
):
    """Upload and index patient PDF."""
    tracker = LatencyTracker()
    
    # Validate file
    if pdf.content_type != "application/pdf":
        raise HTTPException(400, "Only PDF files allowed")
    
    pdf_bytes = await pdf.read()
    if len(pdf_bytes) > settings.max_file_size:
        raise HTTPException(400, f"File too large. Max size: {settings.max_file_size} bytes")
    
    # Extract text
    with tracker.track("extraction_ms"):
        text, pages = await extract_text_from_pdf(pdf_bytes)
    
    # Chunk text
    with tracker.track("chunking_ms"):
        chunks = chunk_text(text, settings.chunk_size, settings.chunk_overlap)
    
    # Generate embeddings
    with tracker.track("embedding_ms"):
        chunk_texts = [c["text"] for c in chunks]
        embeddings = await embedding_service.generate_embeddings(chunk_texts)
    
    # Create FAISS index
    with tracker.track("indexing_ms"):
        await retrieval_service.create_index(patient_id, chunks, embeddings)
    
    return {
        "success": True,
        "data": {
            "patient_id": patient_id,
            "pages": pages,
            "chunks": len(chunks),
            "latency": tracker.get_timings()
        }
    }
