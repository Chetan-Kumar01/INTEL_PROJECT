import faiss
import pickle
import time
from pathlib import Path
from typing import List, Dict, Literal
from sentence_transformers import SentenceTransformer

class RetrievalService:
    def __init__(self, index_dir: str = "./data/indexes"):
        self.index_dir = Path(index_dir)
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # In-memory cache for loaded indexes
        self.index_cache: Dict[str, Dict] = {}
        
        # Mode configurations
        self.mode_config = {
            "emergency": {"top_k": 3},
            "deep": {"top_k": 8}
        }
        
        print(f"✓ Retrieval service initialized")
    
    def load_index(self, patient_id: str) -> Dict:
        """Load FAISS index and metadata (cached)."""
        # Return from cache if available
        if patient_id in self.index_cache:
            return self.index_cache[patient_id]
        
        index_path = self.index_dir / f"patient_{patient_id}.index"
        metadata_path = self.index_dir / f"patient_{patient_id}_metadata.pkl"
        
        if not index_path.exists():
            raise FileNotFoundError(f"Index not found for patient: {patient_id}")
        
        # Load FAISS index
        index = faiss.read_index(str(index_path))
        
        # Load metadata
        with open(metadata_path, 'rb') as f:
            metadata = pickle.load(f)
        
        # Cache for future use
        self.index_cache[patient_id] = {
            "index": index,
            "chunks": metadata["chunks"]
        }
        
        print(f"✓ Loaded index for patient_{patient_id}")
        return self.index_cache[patient_id]
    
    def generate_query_embedding(self, query: str) -> 'np.ndarray':
        """Generate embedding for query string."""
        return self.model.encode([query], convert_to_numpy=True)[0]
    
    async def retrieve(
        self, 
        patient_id: str, 
        query: str, 
        mode: Literal["emergency", "deep"] = "emergency"
    ) -> Dict:
        """
        Retrieve most relevant chunks.
        
        Target: < 100ms retrieval time
        """
        start_time = time.time()
        
        # Get top_k from mode
        top_k = self.mode_config[mode]["top_k"]
        
        # Load index (cached)
        t1 = time.time()
        index_data = self.load_index(patient_id)
        load_time = (time.time() - t1) * 1000
        
        # Generate query embedding
        t2 = time.time()
        query_embedding = self.generate_query_embedding(query)
        embedding_time = (time.time() - t2) * 1000
        
        # Search FAISS index
        t3 = time.time()
        query_vector = query_embedding.reshape(1, -1).astype('float32')
        distances, indices = index_data["index"].search(query_vector, top_k)
        search_time = (time.time() - t3) * 1000
        
        # Build results
        results = []
        for i, idx in enumerate(indices[0]):
            if idx < len(index_data["chunks"]):
                chunk = index_data["chunks"][idx]
                results.append({
                    "chunk_id": int(idx),
                    "text": chunk,
                    "similarity_score": float(1 / (1 + distances[0][i])),  # Convert L2 to similarity
                    "distance": float(distances[0][i])
                })
        
        total_time = (time.time() - start_time) * 1000
        
        return {
            "chunks": results,
            "mode": mode,
            "top_k": top_k,
            "retrieval_time_ms": round(total_time, 2),
            "breakdown": {
                "load_ms": round(load_time, 2),
                "embedding_ms": round(embedding_time, 2),
                "search_ms": round(search_time, 2)
            }
        }

# Global instance
retrieval_service = RetrievalService()
