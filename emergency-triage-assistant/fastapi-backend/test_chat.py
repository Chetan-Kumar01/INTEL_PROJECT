import requests
import time

BASE_URL = "http://localhost:8000"

def test_chat_emergency():
    """Test /chat endpoint in emergency mode (<500ms target)."""
    payload = {
        "patient_id": "patient_001",
        "query": "What are the patient's current vital signs?",
        "mode": "emergency"
    }
    
    start = time.time()
    response = requests.post(f"{BASE_URL}/chat", json=payload)
    elapsed = (time.time() - start) * 1000
    
    print(f"\n🔴 EMERGENCY MODE - /chat endpoint")
    print(f"HTTP Status: {response.status_code}")
    print(f"Total Request Time: {elapsed:.0f}ms")
    
    if response.status_code == 200:
        data = response.json()
        print(f"\nAnswer: {data['answer'][:150]}...")
        print(f"\nLatency Breakdown:")
        print(f"  Retrieval: {data['latency']['retrieval_ms']}ms")
        print(f"  LLM: {data['latency']['llm_ms']}ms")
        print(f"  Total: {data['latency']['total_ms']}ms")
        print(f"\nCited Segments: {len(data['cited_segments'])}")
        
        if data['latency']['total_ms'] < 500:
            print(f"\n✅ Emergency mode target met (<500ms)")
        else:
            print(f"\n⚠️ Emergency mode exceeded 500ms target")
    else:
        print(f"Error: {response.text}")

def test_chat_deep():
    """Test /chat endpoint in deep mode."""
    payload = {
        "patient_id": "patient_001",
        "query": "Provide comprehensive analysis of cardiac history",
        "mode": "deep"
    }
    
    response = requests.post(f"{BASE_URL}/chat", json=payload)
    
    print(f"\n\n🔵 DEEP MODE - /chat endpoint")
    print(f"HTTP Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"\nAnswer: {data['answer'][:200]}...")
        print(f"\nLatency Breakdown:")
        print(f"  Retrieval: {data['latency']['retrieval_ms']}ms")
        print(f"  LLM: {data['latency']['llm_ms']}ms")
        print(f"  Total: {data['latency']['total_ms']}ms")
        print(f"\nCited Segments: {len(data['cited_segments'])}")
    else:
        print(f"Error: {response.text}")

if __name__ == "__main__":
    test_chat_emergency()
    test_chat_deep()
