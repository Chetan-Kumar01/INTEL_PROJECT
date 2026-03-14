#!/usr/bin/env python3
import sys
import json
from sentence_transformers import SentenceTransformer

# Load model (cached after first run)
model = SentenceTransformer('all-MiniLM-L6-v2')

def generate_embeddings(texts):
    embeddings = model.encode(texts)
    return embeddings.tolist()

if __name__ == '__main__':
    texts = json.loads(sys.argv[1])
    embeddings = generate_embeddings(texts)
    print(json.dumps(embeddings))
