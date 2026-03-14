import requests
import time

BASE_URL = "http://localhost:8000"

def test_comparison():
    """Compare optimized RAG vs naive full-context approach."""
    
    patient_id = "patient_001"
    query = "What are the patient's current medications and dosages?"
    
    print("=" * 60)
    print("🔬 PERFORMANCE COMPARISON: Optimized vs Naive")
    print("=" * 60)
    
    # Test Optimized Approach (RAG with retrieval)
    print("\n✅ OPTIMIZED MODE (RAG + Retrieval)")
    print("-" * 60)
    
    start = time.time()
    optimized_response = requests.post(
        f"{BASE_URL}/chat",
        json={"patient_id": patient_id, "query": query, "mode": "emergency"}
    )
    optimized_time = (time.time() - start) * 1000
    
    if optimized_response.status_code == 200:
        opt_data = optimized_response.json()
        print(f"Status: {optimized_response.status_code}")
        print(f"Answer: {opt_data['answer'][:150]}...")
        print(f"\nLatency Breakdown:")
        print(f"  Retrieval: {opt_data['latency']['retrieval_ms']}ms")
        print(f"  LLM: {opt_data['latency']['llm_ms']}ms")
        print(f"  Total: {opt_data['latency']['total_ms']}ms")
        print(f"  HTTP Round-trip: {optimized_time:.0f}ms")
        print(f"Chunks Retrieved: {len(opt_data['cited_segments'])}")
    else:
        print(f"Error: {optimized_response.text}")
        return
    
    # Test Naive Approach (Full context)
    print("\n\n❌ NAIVE MODE (Full Document Context)")
    print("-" * 60)
    
    start = time.time()
    naive_response = requests.post(
        f"{BASE_URL}/chat_naive",
        json={"patient_id": patient_id, "query": query}
    )
    naive_time = (time.time() - start) * 1000
    
    if naive_response.status_code == 200:
        naive_data = naive_response.json()
        print(f"Status: {naive_response.status_code}")
        print(f"Answer: {naive_data['answer'][:150]}...")
        print(f"\nLatency Breakdown:")
        print(f"  Retrieval: {naive_data['latency']['retrieval_ms']}ms (no retrieval)")
        print(f"  LLM: {naive_data['latency']['llm_ms']}ms")
        print(f"  Total: {naive_data['latency']['total_ms']}ms")
        print(f"  HTTP Round-trip: {naive_time:.0f}ms")
        print(f"Context Size: {naive_data['context_size']:,} characters")
    else:
        print(f"Error: {naive_response.text}")
        return
    
    # Comparison Summary
    print("\n\n📊 PERFORMANCE SUMMARY")
    print("=" * 60)
    
    speedup = naive_data['latency']['total_ms'] / opt_data['latency']['total_ms']
    time_saved = naive_data['latency']['total_ms'] - opt_data['latency']['total_ms']
    
    print(f"Optimized Total:  {opt_data['latency']['total_ms']}ms")
    print(f"Naive Total:      {naive_data['latency']['total_ms']}ms")
    print(f"\n⚡ Speedup:        {speedup:.2f}x faster")
    print(f"⏱️  Time Saved:     {time_saved:.0f}ms")
    
    if opt_data['latency']['total_ms'] < 500:
        print(f"\n✅ Optimized mode meets <500ms emergency target")
    else:
        print(f"\n⚠️ Optimized mode: {opt_data['latency']['total_ms']}ms (target: <500ms)")
    
    if naive_data['latency']['total_ms'] > 1200:
        print(f"✅ Naive mode exceeds 1200ms as expected")
    else:
        print(f"⚠️ Naive mode: {naive_data['latency']['total_ms']}ms (expected: >1200ms)")

if __name__ == "__main__":
    test_comparison()
