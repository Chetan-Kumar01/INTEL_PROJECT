"""
Test script for retrieval service.

Usage:
    python test_retrieval.py
"""

import requests
import json

url = "http://localhost:8000/retrieve"

# Test Emergency Mode
print("=" * 50)
print("Testing Emergency Mode (top_k=3)")
print("=" * 50)

emergency_request = {
    "patient_id": "test-001",
    "query": "What cardiac medications is the patient taking?",
    "mode": "emergency"
}

response = requests.post(url, json=emergency_request)

if response.status_code == 200:
    result = response.json()["data"]
    print(f"✓ Success!")
    print(f"  Mode: {result['mode']}")
    print(f"  Top K: {result['top_k']}")
    print(f"  Retrieval Time: {result['retrieval_time_ms']}ms")
    print(f"  Breakdown:")
    print(f"    - Load: {result['breakdown']['load_ms']}ms")
    print(f"    - Embedding: {result['breakdown']['embedding_ms']}ms")
    print(f"    - Search: {result['breakdown']['search_ms']}ms")
    print(f"\n  Retrieved {len(result['chunks'])} chunks:")
    for i, chunk in enumerate(result['chunks'], 1):
        print(f"    {i}. Score: {chunk['similarity_score']:.4f}")
        print(f"       Text: {chunk['text'][:100]}...")
else:
    print(f"✗ Error: {response.status_code}")
    print(response.json())

print("\n")

# Test Deep Mode
print("=" * 50)
print("Testing Deep Analysis Mode (top_k=8)")
print("=" * 50)

deep_request = {
    "patient_id": "test-001",
    "query": "What is the complete medical history?",
    "mode": "deep"
}

response = requests.post(url, json=deep_request)

if response.status_code == 200:
    result = response.json()["data"]
    print(f"✓ Success!")
    print(f"  Mode: {result['mode']}")
    print(f"  Top K: {result['top_k']}")
    print(f"  Retrieval Time: {result['retrieval_time_ms']}ms")
    print(f"  Retrieved {len(result['chunks'])} chunks")
    
    # Check if under 100ms
    if result['retrieval_time_ms'] < 100:
        print(f"  ⚡ Target achieved: < 100ms")
    else:
        print(f"  ⚠️  Above target: {result['retrieval_time_ms']}ms")
else:
    print(f"✗ Error: {response.status_code}")
    print(response.json())
