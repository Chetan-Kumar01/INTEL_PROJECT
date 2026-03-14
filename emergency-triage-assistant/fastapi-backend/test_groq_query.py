"""
Test script for Groq LLM query service.

Usage:
    python test_groq_query.py
"""

import requests
import json

url = "http://localhost:8000/query"

print("=" * 60)
print("🔴 Testing Emergency Mode")
print("=" * 60)

emergency_request = {
    "patient_id": "test-001",
    "query": "Patient has severe chest pain. What immediate actions should be taken?",
    "mode": "emergency"
}

response = requests.post(url, json=emergency_request)

if response.status_code == 200:
    result = response.json()["data"]
    print(f"✓ Success!")
    print(f"\nMode: {result['mode']}")
    print(f"Chunks Retrieved: {result['chunks_retrieved']}")
    print(f"\nLatency Breakdown:")
    print(f"  - Retrieval: {result['latency']['retrieval_ms']}ms")
    print(f"  - LLM: {result['latency']['llm_ms']}ms")
    print(f"  - Total: {result['latency']['total_ms']}ms")
    print(f"\n🔴 Emergency Response:")
    print(f"{result['answer']}")
    print(f"\nCitations:")
    for citation in result['citations']:
        print(f"  [{citation['segment_id']}] Similarity: {citation['similarity']:.4f}")
        print(f"      {citation['text'][:100]}...")
else:
    print(f"✗ Error: {response.status_code}")
    print(response.json())

print("\n")
print("=" * 60)
print("🔵 Testing Deep Analysis Mode")
print("=" * 60)

deep_request = {
    "patient_id": "test-001",
    "query": "Analyze the patient's cardiac history and current medication regimen. What are the risk factors?",
    "mode": "deep"
}

response = requests.post(url, json=deep_request)

if response.status_code == 200:
    result = response.json()["data"]
    print(f"✓ Success!")
    print(f"\nMode: {result['mode']}")
    print(f"Chunks Retrieved: {result['chunks_retrieved']}")
    print(f"\nLatency Breakdown:")
    print(f"  - Retrieval: {result['latency']['retrieval_ms']}ms")
    print(f"  - LLM: {result['latency']['llm_ms']}ms")
    print(f"  - Total: {result['latency']['total_ms']}ms")
    print(f"\n🔵 Deep Analysis:")
    print(f"{result['answer']}")
else:
    print(f"✗ Error: {response.status_code}")
    print(response.json())
