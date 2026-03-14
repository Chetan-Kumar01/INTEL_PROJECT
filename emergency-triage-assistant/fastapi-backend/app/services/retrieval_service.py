import faiss
import numpy as np
import json
import os
from typing import List, Dict
from pathlib import Path

class RetrievalService:
    def __init__(self, index_dir: str):
        self.index_dir = Path(index_dir)
        self.index_dir.mkdir(parents=True, exist_ok=True)
        self.indexes: Dict[str, Dict] = {}
    
    async def create_index(self, patient_id: str, chunks: List[Dict], embeddings: np.ndarray):
        """Create FAISS index for patient."""
        dimension = embeddings.shape[1]
        index = faiss.IndexFlatIP(dimension)  # Inner product (cosine similarity)
        
        # Normalize embeddings for cosine similarity
        faiss.normalize_L2(embeddings)
        index.add(embeddings)
        
        # Store index and metadata
        self.indexes[patient_id] = {
            "index": index,
            "chunks": chunks,
            "embeddings": embeddings
        }
        
        # Save to disk
        index_path = self.index_dir / f"{patient_id}.index"
        metadata_path = self.index_dir / f"{patient_id}.json"
        
        faiss.write_index(index, str(index_path))
        with open(metadata_path, 'w') as f:
            json.dump(chunks, f)
    
    async def load_index(self, patient_id: str):
        """Load FAISS index from disk."""
        if patient_id in self.indexes:
            return
        
        index_path = self.index_dir / f"{patient_id}.index"
        metadata_path = self.index_dir / f"{patient_id}.json"
        
        if not index_path.exists():
            raise ValueError(f"Index not found for patient: {patient_id}")
        
        index = faiss.read_index(str(index_path))
        with open(metadata_path, 'r') as f:
            chunks = json.load(f)
        
        self.indexes[patient_id] = {
            "index": index,
            "chunks": chunks
        }
    
    async def search(self, patient_id: str, query_embedding: np.ndarray, top_k: int = 5) -> List[Dict]:
        """Search for similar chunks."""
        await self.load_index(patient_id)
        
        index_data = self.indexes[patient_id]
        index = index_data["index"]
        chunks = index_data["chunks"]
        
        # Normalize query embedding
        query_embedding = query_embedding.reshape(1, -1)
        faiss.normalize_L2(query_embedding)
        
        # Search
        distances, indices = index.search(query_embedding, top_k)
        
        results = []
        for i, idx in enumerate(indices[0]):
            if idx < len(chunks):
                results.append({
                    "id": int(idx),
                    "text": chunks[idx]["text"],
                    "similarity": float(distances[0][i]),
                    "start_idx": chunks[idx]["start_idx"],
                    "end_idx": chunks[idx]["end_idx"]
                })
        
        return results

# Global instance
retrieval_service = RetrievalService("./data/faiss_indexes")
