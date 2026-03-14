from sentence_transformers import SentenceTransformer
from typing import List
import numpy as np

class EmbeddingService:
    _instance = None
    
    def __new__(cls, model_name: str = "all-MiniLM-L6-v2"):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.model = SentenceTransformer(model_name)
        return cls._instance
    
    async def generate_embeddings(self, texts: List[str]) -> np.ndarray:
        """Generate embeddings for list of texts."""
        return self.model.encode(texts, convert_to_numpy=True)
    
    async def generate_single_embedding(self, text: str) -> np.ndarray:
        """Generate embedding for single text."""
        return self.model.encode([text], convert_to_numpy=True)[0]

# Global instance
embedding_service = EmbeddingService()
