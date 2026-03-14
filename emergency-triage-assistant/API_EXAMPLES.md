# API Request Examples

## Using cURL

### Optimized Processing
```bash
curl -X POST http://localhost:5000/api/triage/optimized \
  -H "Content-Type: application/json" \
  -d '{
    "caseDescription": "Patient experiencing severe chest pain, shortness of breath, and dizziness for 30 minutes. Blood pressure elevated at 180/110.",
    "apiKey": "sk-your-openai-api-key"
  }'
```

### Naive Processing
```bash
curl -X POST http://localhost:5000/api/triage/naive \
  -H "Content-Type: application/json" \
  -d '{
    "caseDescription": "Patient experiencing severe chest pain, shortness of breath, and dizziness for 30 minutes. Blood pressure elevated at 180/110.",
    "apiKey": "sk-your-openai-api-key"
  }'
```

### Health Check
```bash
curl http://localhost:5000/health
```

## Using JavaScript (Fetch)

```javascript
// Optimized Processing
const response = await fetch('http://localhost:5000/api/triage/optimized', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    caseDescription: 'Patient with high fever, severe headache, and stiff neck',
    apiKey: 'sk-your-openai-api-key'
  })
});

const data = await response.json();
console.log(data);
```

## Using Python (Requests)

```python
import requests

url = 'http://localhost:5000/api/triage/optimized'
payload = {
    'caseDescription': 'Elderly patient fell, unable to bear weight on right leg, visible deformity',
    'apiKey': 'sk-your-openai-api-key'
}

response = requests.post(url, json=payload)
print(response.json())
```

## Sample Test Cases

### Case 1: Cardiac Emergency
```json
{
  "caseDescription": "45-year-old male presenting with crushing chest pain radiating to left arm, profuse sweating, nausea. Pain started 20 minutes ago. History of hypertension.",
  "apiKey": "sk-..."
}
```

### Case 2: Respiratory Distress
```json
{
  "caseDescription": "7-year-old child with high fever 103°F, difficulty breathing, wheezing sounds, rapid breathing rate. Started 2 hours ago.",
  "apiKey": "sk-..."
}
```

### Case 3: Trauma
```json
{
  "caseDescription": "22-year-old involved in motor vehicle accident. Complaining of severe abdominal pain, visible bruising on abdomen, blood pressure dropping.",
  "apiKey": "sk-..."
}
```

### Case 4: Minor Injury
```json
{
  "caseDescription": "Patient with minor laceration on forearm from kitchen accident. Bleeding controlled with pressure. No other symptoms.",
  "apiKey": "sk-..."
}
```

### Case 5: Neurological
```json
{
  "caseDescription": "65-year-old female with sudden onset severe headache, confusion, slurred speech. Symptoms started 15 minutes ago.",
  "apiKey": "sk-..."
}
```

## Expected Response Format

```json
{
  "success": true,
  "mode": "optimized",
  "data": {
    "original": "Original case description...",
    "compressed": "Compressed version...",
    "recommendation": "Triage Level: Critical. Recommendation details...",
    "tokenStats": {
      "originalTokens": 50,
      "compressedTokens": 30,
      "reduction": "40.00"
    },
    "verification": {
      "verified": true,
      "score": "85.50",
      "status": "High Confidence"
    },
    "confidence": {
      "score": "78.25",
      "level": "High"
    },
    "latency": {
      "compression": 2,
      "llm": 1250,
      "verification": 5,
      "confidence": 1,
      "total": 1258
    }
  }
}
```

## Error Responses

### Missing Parameters
```json
{
  "error": "Missing caseDescription or apiKey"
}
```

### Invalid API Key
```json
{
  "error": "Processing failed",
  "message": "Request failed with status code 401"
}
```

### Server Error
```json
{
  "error": "Internal server error",
  "message": "Error details..."
}
```
