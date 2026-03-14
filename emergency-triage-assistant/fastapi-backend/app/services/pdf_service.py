from PyPDF2 import PdfReader
from io import BytesIO
from typing import Tuple

async def extract_text_from_pdf(pdf_bytes: bytes) -> Tuple[str, int]:
    """Extract text from PDF bytes."""
    pdf_file = BytesIO(pdf_bytes)
    reader = PdfReader(pdf_file)
    
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    
    return text.strip(), len(reader.pages)

def chunk_text(text: str, chunk_size: int = 300, overlap: int = 50) -> list:
    """Chunk text into overlapping segments."""
    words = text.split()
    chunks = []
    
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        if chunk.strip():
            chunks.append({
                "text": chunk,
                "start_idx": i,
                "end_idx": min(i + chunk_size, len(words))
            })
    
    return chunks
