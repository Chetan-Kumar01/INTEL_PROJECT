from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    app_name: str = "AI Clinical Intelligence System"
    groq_api_key: str
    openai_api_key: str = ""
    embedding_model: str = "all-MiniLM-L6-v2"
    chunk_size: int = 300
    chunk_overlap: int = 50
    top_k: int = 5
    faiss_index_dir: str = "./data/faiss_indexes"
    pdf_storage_dir: str = "./data/pdfs"
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
