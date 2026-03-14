import fitz  # PyMuPDF
import time
import json
import pickle
from pathlib import Path
from typing import List, Dict
import numpy as np
from sentence_transformers import SentenceTransformer
import faiss

class PDFIngestionService:
    def __init__(self, index_dir: str = "./data/indexes"):
        self.index_dir = Path(index_dir)
        self.index_dir.mkdir(parents=True, exist_ok=True)
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        print(f"✓ Embedding model loaded: all-MiniLM-L6-v2")
    
    def extract_text_from_pdf(self, pdf_bytes: bytes) -> str:
        """Extract text from PDF using PyMuPDF."""
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text
    
    def chunk_text(self, text: str, chunk_size: int = 300) -> List[str]:
        """Split text into 300-token chunks."""
        words = text.split()
        chunks = []
        
        for i in range(0, len(words), chunk_size):
            chunk = " ".join(words[i:i + chunk_size])
            if chunk.strip():
                chunks.append(chunk)
        
        return chunks
    
    def generate_embeddings(self, chunks: List[str]) -> np.ndarray:
        """Generate embeddings using sentence-transformers."""
        embeddings = self.model.encode(chunks, convert_to_numpy=True)
        return embeddings.astype('float32')
    
    def create_faiss_index(self, embeddings: np.ndarray) -> faiss.Index:
        """Create FAISS index."""
        dimension = embeddings.shape[1]
        index = faiss.IndexFlatL2(dimension)
        index.add(embeddings)
        return index
    
    def save_index(self, patient_id: str, index: faiss.Index, chunks: List[str]):
        """Save FAISS index and metadata."""
        index_path = self.index_dir / f"patient_{patient_id}.index"
        metadata_path = self.index_dir / f"patient_{patient_id}_metadata.pkl"
        
        # Save FAISS index
        faiss.write_index(index, str(index_path))
        
        # Save metadata (original chunks)
        with open(metadata_path, 'wb') as f:
            pickle.dump({"chunks": chunks}, f)
    
    async def process_pdf(self, patient_id: str, pdf_bytes: bytes) -> Dict:
        """Complete PDF ingestion pipeline."""
        start_time = time.time()
        
        # Extract text
        text = self.extract_text_from_pdf(pdf_bytes)
        
        # Chunk text
        chunks = self.chunk_text(text, chunk_size=300)
        
        # Generate embeddings
        embeddings = self.generate_embeddings(chunks)
        
        # Create FAISS index
        index = self.create_faiss_index(embeddings)
        
        # Save index and metadata
        self.save_index(patient_id, index, chunks)
        
        indexing_time_ms = round((time.time() - start_time) * 1000, 2)
        
        print(f"✓ Indexed patient_{patient_id}: {len(chunks)} chunks in {indexing_time_ms}ms")
        
        return {
            "total_chunks": len(chunks),
            "indexing_time_ms": indexing_time_ms
        }

# Global instance
pdf_service = PDFIngestionService()
