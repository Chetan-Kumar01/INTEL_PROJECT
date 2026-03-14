# Multi-Stage AI Pipeline API

## Endpoint

### POST `/api/triage`

Complete 4-stage AI pipeline for emergency triage with compression, recommendation, verification, and confidence scoring.

## Request

```json
{
  "patientHistory": "Full patient medical history...",
  "emergencyDescription": "Current emergency situation",
  "apiKey": "sk-your-openai-api-key"
}
```

## Response

```json
{
  "success": true,
  "data": {
    "compressed_history": "Relevant medical records only...",
    "recommendation": {
      "immediate_action": "Activate cardiac protocol, administer aspirin, prepare for emergency catheterization",
      "differential_diagnosis": [
        "Acute Myocardial Infarction",
        "Unstable Angina",
        "Aortic Dissection"
      ],
      "supporting_evidence": "Patient has history of hypertension and diabetes, presenting with crushing chest pain radiating to left arm",
      "risk_considerations": "High risk for cardiac event. History of cardiac workup in 2023. Current cardiac medications.",
      "uncertainty_level": "Low"
    },
    "verification": {
      "status": "Verified",
      "unsupported_claims": []
    },
    "confidence": {
      "score": "85.00",
      "reasoning": "All claims supported by source data. Low uncertainty in diagnosis."
    },
    "performance": {
      "compression_ms": 1250,
      "recommendation_ms": 1800,
      "verification_ms": 15,
      "confidence_ms": 2,
      "total_ms": 3067
    }
  }
}
```

## Pipeline Stages

### Stage 1: Compression (ScaleDown)
- Rule-based keyword filtering
- LLM intelligent extraction
- Preserves original wording
- Reduces tokens by 50-80%

### Stage 2: Triage Recommendation
- Structured medical assessment
- Immediate action plan
- Differential diagnosis list
- Supporting evidence
- Risk considerations
- Uncertainty level

### Stage 3: Verification
- Checks claims against source data
- Identifies unsupported statements
- Status: Verified / Mostly Verified / Needs Review

### Stage 4: Confidence Scoring
- Multi-factor analysis
- Verification status weight
- Uncertainty level consideration
- Compression impact assessment
- Detailed reasoning provided

## Example Usage

### cURL

```bash
curl -X POST http://localhost:5000/api/triage \
  -H "Content-Type: application/json" \
  -d '{
    "patientHistory": "Patient John Doe, 45 years old. 2018 - Hypertension, Lisinopril 10mg. 2022 - Type 2 Diabetes, Metformin 500mg. 2023 - Chest pain episode, cardiac workup negative, diagnosed with GERD. Current medications: Lisinopril, Metformin, Omeprazole.",
    "emergencyDescription": "Patient presenting with severe crushing chest pain radiating to left arm, profuse sweating, shortness of breath. Pain started 30 minutes ago.",
    "apiKey": "sk-your-api-key"
  }'
```

### JavaScript

```javascript
const response = await fetch('http://localhost:5000/api/triage', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    patientHistory: "Patient medical history...",
    emergencyDescription: "Severe chest pain and shortness of breath",
    apiKey: "sk-your-api-key"
  })
});

const { data } = await response.json();
console.log('Immediate Action:', data.recommendation.immediate_action);
console.log('Confidence:', data.confidence.score);
console.log('Total Time:', data.performance.total_ms, 'ms');
```

### Python

```python
import requests

response = requests.post('http://localhost:5000/api/triage', json={
    'patientHistory': 'Patient medical history...',
    'emergencyDescription': 'Severe chest pain and shortness of breath',
    'apiKey': 'sk-your-api-key'
})

data = response.json()['data']
print(f"Action: {data['recommendation']['immediate_action']}")
print(f"Confidence: {data['confidence']['score']}")
```

## Response Fields

### compressed_history
Filtered patient history containing only relevant records for the emergency.

### recommendation
- **immediate_action**: What to do right now
- **differential_diagnosis**: List of possible diagnoses
- **supporting_evidence**: Evidence from case supporting assessment
- **risk_considerations**: Key risks and red flags
- **uncertainty_level**: Low/Medium/High

### verification
- **status**: Verified / Mostly Verified / Needs Review
- **unsupported_claims**: List of claims not supported by source data

### confidence
- **score**: 0-100 confidence score
- **reasoning**: Explanation of confidence calculation

### performance
- **compression_ms**: Stage 1 latency
- **recommendation_ms**: Stage 2 latency
- **verification_ms**: Stage 3 latency
- **confidence_ms**: Stage 4 latency
- **total_ms**: Total pipeline latency

## Error Responses

### Missing Parameters
```json
{
  "error": "Missing required fields: patientHistory, emergencyDescription, apiKey"
}
```

### Processing Failed
```json
{
  "error": "Triage processing failed",
  "message": "Error details..."
}
```

## Performance Metrics

Typical latency breakdown:
- **Compression**: 1000-1500ms
- **Recommendation**: 1500-2000ms
- **Verification**: 10-20ms
- **Confidence**: 1-5ms
- **Total**: 2500-3500ms

## Use Cases

### Critical Emergency
```json
{
  "emergencyDescription": "45yo male, crushing chest pain, left arm radiation, diaphoresis",
  "recommendation": {
    "immediate_action": "Activate cardiac protocol, aspirin, prepare cath lab",
    "differential_diagnosis": ["STEMI", "Unstable Angina", "Aortic Dissection"],
    "uncertainty_level": "Low"
  }
}
```

### Respiratory Distress
```json
{
  "emergencyDescription": "7yo child, high fever, difficulty breathing, wheezing",
  "recommendation": {
    "immediate_action": "Oxygen support, nebulizer treatment, chest X-ray",
    "differential_diagnosis": ["Pneumonia", "Asthma Exacerbation", "Bronchiolitis"],
    "uncertainty_level": "Medium"
  }
}
```

### Trauma
```json
{
  "emergencyDescription": "22yo MVA, abdominal pain, visible bruising, BP dropping",
  "recommendation": {
    "immediate_action": "Trauma activation, IV access, FAST exam, prepare OR",
    "differential_diagnosis": ["Splenic Rupture", "Liver Laceration", "Internal Bleeding"],
    "uncertainty_level": "Low"
  }
}
```

## Benefits

✅ **Comprehensive**: Full 4-stage pipeline  
✅ **Structured**: Consistent JSON output  
✅ **Transparent**: Performance metrics for each stage  
✅ **Verified**: Hallucination detection built-in  
✅ **Confident**: Reasoning-based confidence scoring  
✅ **Efficient**: 50-80% token reduction  
✅ **Fast**: Async processing, ~3 seconds total  

## Legacy Endpoints

Old endpoints moved to:
- `/api/triage-legacy/optimized`
- `/api/triage-legacy/naive`

## Integration Example

```javascript
async function triagePatient(history, emergency, apiKey) {
  const response = await fetch('http://localhost:5000/api/triage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      patientHistory: history,
      emergencyDescription: emergency,
      apiKey: apiKey
    })
  });

  const { data } = await response.json();
  
  // Display to medical staff
  displayAlert(data.recommendation.immediate_action);
  showDifferentials(data.recommendation.differential_diagnosis);
  
  // Log for audit
  logTriageDecision({
    confidence: data.confidence.score,
    reasoning: data.confidence.reasoning,
    verification: data.verification.status,
    latency: data.performance.total_ms
  });
  
  return data;
}
```
