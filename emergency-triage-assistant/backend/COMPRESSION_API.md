# ScaleDown Compression API

## Endpoint

### POST `/api/compress`

Compresses patient history using rule-based + LLM filtering to extract only relevant records for the emergency.

## Request

```json
{
  "patientHistory": "Full patient medical history text...",
  "emergencyDescription": "Current emergency situation description",
  "apiKey": "sk-your-openai-api-key"
}
```

### Parameters

- **patientHistory** (string, required): Complete patient medical history
- **emergencyDescription** (string, required): Current emergency situation
- **apiKey** (string, required): OpenAI API key for LLM filtering

## Response

```json
{
  "success": true,
  "data": {
    "original_tokens": 500,
    "compressed_tokens": 150,
    "reduction_percent": 70.0,
    "compressed_text": "Relevant medical records only...",
    "compression_latency_ms": 1250
  }
}
```

### Response Fields

- **original_tokens**: Token count before compression
- **compressed_tokens**: Token count after compression
- **reduction_percent**: Percentage of tokens reduced
- **compressed_text**: Filtered relevant text with original wording preserved
- **compression_latency_ms**: Time taken for compression in milliseconds

## Example Usage

### cURL

```bash
curl -X POST http://localhost:5000/api/compress \
  -H "Content-Type: application/json" \
  -d '{
    "patientHistory": "Patient John Doe, 45 years old. Medical History: 2015 - Appendectomy. 2018 - Diagnosed with hypertension, prescribed Lisinopril 10mg daily. 2019 - Seasonal allergies, takes Claritin as needed. 2020 - Annual checkup, all vitals normal. 2021 - Sprained ankle playing basketball, healed completely. 2022 - Diagnosed with Type 2 Diabetes, prescribed Metformin 500mg twice daily. 2023 - Chest pain episode, cardiac workup negative, diagnosed with GERD. Current medications: Lisinopril, Metformin, Omeprazole.",
    "emergencyDescription": "Patient presenting with severe chest pain and shortness of breath",
    "apiKey": "sk-your-api-key"
  }'
```

### JavaScript

```javascript
const response = await fetch('http://localhost:5000/api/compress', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    patientHistory: "Patient medical history...",
    emergencyDescription: "Severe chest pain and shortness of breath",
    apiKey: "sk-your-api-key"
  })
});

const data = await response.json();
console.log(`Reduced by ${data.data.reduction_percent}%`);
```

### Python

```python
import requests

response = requests.post('http://localhost:5000/api/compress', json={
    'patientHistory': 'Patient medical history...',
    'emergencyDescription': 'Severe chest pain and shortness of breath',
    'apiKey': 'sk-your-api-key'
})

result = response.json()
print(f"Compression: {result['data']['reduction_percent']}% reduction")
```

## How It Works

### Two-Stage Filtering

1. **Rule-Based Filtering**
   - Extracts lines containing emergency-related keywords
   - Filters for medical terminology
   - Fast initial reduction

2. **LLM Filtering**
   - Uses GPT-3.5-turbo to intelligently extract relevant records
   - Preserves original wording
   - Context-aware relevance detection

### Example

**Input (500 tokens):**
```
Patient John Doe, 45 years old.
2015 - Appendectomy
2018 - Hypertension, Lisinopril 10mg
2019 - Seasonal allergies
2020 - Annual checkup normal
2021 - Sprained ankle
2022 - Type 2 Diabetes, Metformin 500mg
2023 - Chest pain, cardiac workup negative, GERD
Current: Lisinopril, Metformin, Omeprazole
```

**Emergency:** "Severe chest pain and shortness of breath"

**Output (150 tokens, 70% reduction):**
```
2018 - Hypertension, Lisinopril 10mg
2022 - Type 2 Diabetes, Metformin 500mg
2023 - Chest pain, cardiac workup negative, GERD
Current: Lisinopril, Metformin, Omeprazole
```

## Error Responses

### Missing Parameters
```json
{
  "error": "Missing required fields: patientHistory, emergencyDescription, apiKey"
}
```

### Compression Failed
```json
{
  "error": "Compression failed",
  "message": "Error details..."
}
```

## Performance

- **Rule-based filtering**: ~5-10ms
- **LLM filtering**: ~1000-1500ms
- **Total latency**: ~1200-1600ms
- **Token reduction**: 50-80% typical

## Integration with Triage

Use compressed output with triage endpoints:

```javascript
// Step 1: Compress patient history
const compressed = await fetch('http://localhost:5000/api/compress', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    patientHistory: fullHistory,
    emergencyDescription: emergency,
    apiKey: apiKey
  })
});

const { compressed_text } = (await compressed.json()).data;

// Step 2: Use compressed text for triage
const triage = await fetch('http://localhost:5000/api/triage/optimized', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    caseDescription: `${emergency}\n\nRelevant History:\n${compressed_text}`,
    apiKey: apiKey
  })
});
```

## Benefits

- **Cost Reduction**: 50-80% fewer tokens = lower API costs
- **Faster Processing**: Less data to process in subsequent stages
- **Preserved Accuracy**: Original wording maintained
- **Context-Aware**: LLM understands medical relevance
- **Modular**: Can be used standalone or in pipeline
