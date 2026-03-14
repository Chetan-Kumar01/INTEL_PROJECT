# Groq LLM Integration Documentation

## Overview

Groq LLM service with llama3-8b-8192 model, optimized for clinical decision support.

## Configuration

**Model**: `llama3-8b-8192`
**Temperature**: `0.2` (deterministic, minimal hallucination)

## Modes

### 🔴 Emergency Mode
- **Max Tokens**: 150
- **Response Length**: < 120 words
- **Focus**: Critical actionable recommendations
- **System Prompt**: Emergency clinical decision assistant
- **Use Case**: Immediate triage, time-critical decisions

### 🔵 Deep Analysis Mode
- **Max Tokens**: 400
- **Response Length**: Detailed analysis
- **Focus**: Comprehensive reasoning with citations
- **System Prompt**: Senior clinical AI assistant
- **Use Case**: Case review, research, detailed assessment

## API Endpoint

### POST `/query`

Complete RAG pipeline: Retrieval + LLM generation.

**Request:**
```json
{
  "patient_id": "patient-123",
  "query": "Patient has severe chest pain. What immediate actions?",
  "mode": "emergency"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "answer": "IMMEDIATE ACTIONS:\n1. Activate cardiac protocol\n2. Administer aspirin 325mg\n3. Obtain 12-lead ECG within 10 minutes\n4. Establish IV access\n5. Prepare for possible cardiac catheterization\n\nBased on patient's history of hypertension and diabetes (Segment 1), combined with acute chest pain presentation, this suggests possible acute coronary syndrome requiring urgent intervention.",
    "mode": "emergency",
    "chunks_retrieved": 3,
    "latency": {
      "retrieval_ms": 67.45,
      "llm_ms": 892.34,
      "total_ms": 959.79
    },
    "citations": [
      {
        "segment_id": 1,
        "text": "Patient has history of hypertension and Type 2 diabetes. Current medications: Lisinopril, Metformin...",
        "similarity": 0.8945
      },
      {
        "segment_id": 2,
        "text": "2023 - Chest pain episode, cardiac workup negative, diagnosed with GERD...",
        "similarity": 0.8234
      },
      {
        "segment_id": 3,
        "text": "Risk factors: Hypertension, diabetes, family history of cardiac disease...",
        "similarity": 0.7891
      }
    ]
  }
}
```

## System Prompts

### Emergency Mode
```
You are an emergency clinical decision assistant.
Respond in under 120 words.
Provide only critical actionable recommendation.
Avoid hallucination.
Base reasoning strictly on provided medical context.
```

### Deep Analysis Mode
```
You are a senior clinical AI assistant.
Provide detailed reasoning.
Analyze full medical context.
Explain risks, history relevance, and recommended actions.
Cite referenced segments.
```

## Performance

### Emergency Mode
- **Retrieval**: ~67ms (top_k=3)
- **LLM**: ~800-1000ms
- **Total**: ~900-1100ms
- **Response**: Concise, actionable

### Deep Analysis Mode
- **Retrieval**: ~78ms (top_k=8)
- **LLM**: ~1200-1500ms
- **Total**: ~1300-1600ms
- **Response**: Detailed, comprehensive

## Usage Examples

### Python
```python
import requests

url = "http://localhost:8000/query"

# Emergency query
response = requests.post(url, json={
    "patient_id": "patient-123",
    "query": "Severe chest pain. Immediate actions?",
    "mode": "emergency"
})

result = response.json()["data"]
print(f"🔴 Emergency Response ({result['latency']['total_ms']}ms):")
print(result['answer'])
```

### JavaScript
```javascript
const response = await fetch('http://localhost:8000/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    patient_id: 'patient-123',
    query: 'Analyze cardiac history',
    mode: 'deep'
  })
});

const { data } = await response.json();
console.log(`🔵 Deep Analysis (${data.latency.total_ms}ms):`);
console.log(data.answer);
```

### cURL
```bash
# Emergency mode
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "patient-123",
    "query": "Chest pain. Actions?",
    "mode": "emergency"
  }'

# Deep mode
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "patient-123",
    "query": "Analyze full cardiac history",
    "mode": "deep"
  }'
```

## Response Characteristics

### Emergency Mode Response
- **Length**: 80-120 words
- **Structure**: Numbered action items
- **Citations**: Inline references to segments
- **Tone**: Direct, urgent, actionable
- **Example**:
```
IMMEDIATE ACTIONS:
1. Activate cardiac protocol
2. Administer aspirin 325mg
3. Obtain ECG within 10 minutes
4. Establish IV access

Based on patient's cardiac risk factors (Segment 1) and 
acute presentation, suspect ACS requiring urgent intervention.
```

### Deep Analysis Mode Response
- **Length**: 250-400 words
- **Structure**: Detailed paragraphs with reasoning
- **Citations**: Explicit segment references
- **Tone**: Analytical, comprehensive, educational
- **Example**:
```
COMPREHENSIVE CARDIAC ASSESSMENT:

Patient History Analysis:
The patient has a significant cardiac risk profile documented 
in Segment 1, including hypertension since 2018 and Type 2 
diabetes since 2022. These are major risk factors for coronary 
artery disease.

Current Presentation:
Acute chest pain in the context of known risk factors raises 
concern for acute coronary syndrome. Segment 2 notes a previous 
chest pain episode in 2023 that was attributed to GERD, but 
current presentation requires differentiation.

Risk Stratification:
- High risk factors: HTN, DM, family history (Segment 3)
- Current medications: Lisinopril, Metformin (Segment 1)
- Previous cardiac workup: Negative in 2023 (Segment 2)

Recommended Actions:
1. Immediate ECG and troponin
2. Activate cardiac protocol
3. Consider previous GERD diagnosis but rule out ACS first
4. Review medication compliance
5. Prepare for possible cardiac catheterization

The combination of risk factors and acute symptoms warrants 
aggressive evaluation despite previous negative workup.
```

## Hallucination Prevention

### Strategies
1. **Low Temperature** (0.2): Reduces creative responses
2. **Strict System Prompt**: Emphasizes context-based reasoning
3. **Citation Requirement**: Forces grounding in provided segments
4. **Token Limits**: Prevents rambling and speculation
5. **Context Validation**: Only retrieved chunks provided

### Example Prevention
**Without Prevention:**
```
Patient had a heart attack in 2019 and underwent bypass surgery.
[HALLUCINATION - not in context]
```

**With Prevention:**
```
Based on Segment 1, patient has hypertension and diabetes.
Segment 2 shows previous chest pain in 2023 was GERD.
[GROUNDED - references actual segments]
```

## Error Handling

### Patient Not Found
```json
{
  "detail": "Index not found for patient: patient-999"
}
```

### Invalid Mode
```json
{
  "detail": "Input should be 'emergency' or 'deep'"
}
```

### LLM API Error
```json
{
  "detail": "Query failed: Groq API error"
}
```

## Comparison: Emergency vs Deep

| Aspect | Emergency 🔴 | Deep 🔵 |
|--------|-------------|---------|
| Max Tokens | 150 | 400 |
| Response Length | < 120 words | 250-400 words |
| Chunks Retrieved | 3 | 8 |
| Retrieval Time | ~67ms | ~78ms |
| LLM Time | ~900ms | ~1300ms |
| Total Time | ~1000ms | ~1400ms |
| Use Case | Immediate triage | Detailed review |
| Output Style | Action list | Analysis + reasoning |
| Citations | Inline | Explicit segments |

## Integration Example

Complete workflow:
```python
import requests

# 1. Upload PDF
requests.post('http://localhost:8000/upload_pdf',
    files={'file': open('patient.pdf', 'rb')},
    data={'patient_id': 'patient-123'}
)

# 2. Emergency query
emergency = requests.post('http://localhost:8000/query', json={
    'patient_id': 'patient-123',
    'query': 'Chest pain. Immediate actions?',
    'mode': 'emergency'
})

print(f"🔴 {emergency.json()['data']['answer']}")

# 3. Deep analysis
deep = requests.post('http://localhost:8000/query', json={
    'patient_id': 'patient-123',
    'query': 'Analyze full cardiac history and risks',
    'mode': 'deep'
})

print(f"🔵 {deep.json()['data']['answer']}")
```

## Testing

Run test script:
```bash
python test_groq_query.py
```

Expected output:
```
============================================================
🔴 Testing Emergency Mode
============================================================
✓ Success!

Mode: emergency
Chunks Retrieved: 3

Latency Breakdown:
  - Retrieval: 67.45ms
  - LLM: 892.34ms
  - Total: 959.79ms

🔴 Emergency Response:
IMMEDIATE ACTIONS:
1. Activate cardiac protocol
2. Administer aspirin 325mg
3. Obtain 12-lead ECG within 10 minutes
...

============================================================
🔵 Testing Deep Analysis Mode
============================================================
✓ Success!

Mode: deep
Chunks Retrieved: 8

Latency Breakdown:
  - Retrieval: 78.23ms
  - LLM: 1305.67ms
  - Total: 1383.90ms

🔵 Deep Analysis:
COMPREHENSIVE CARDIAC ASSESSMENT:

Patient History Analysis:
The patient has a significant cardiac risk profile...
```

## Production Deployment

### Environment Variables
```env
GROQ_API_KEY=gsk_your_key_here
```

Get Groq API key: https://console.groq.com/keys

### Docker
```dockerfile
FROM python:3.10-slim

RUN pip install groq sentence-transformers faiss-cpu

COPY app/ /app/
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0"]
```

### Monitoring
Track LLM performance:
```python
# Log slow responses
if llm_latency_ms > 2000:
    logger.warning(f"Slow LLM: {llm_latency_ms}ms")

# Track mode usage
emergency_count = 0
deep_count = 0
```

---

**Built for AI Clinical Intelligence System** 🏥🔴🔵
