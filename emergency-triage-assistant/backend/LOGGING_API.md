# Analytics Logging API

## Overview

The system automatically logs all triage operations with detailed metrics for analysis and monitoring.

## Logged Data

Each log entry contains:
- **Timestamp**: ISO 8601 format
- **Token Counts**: Original, compressed, reduction percentage
- **Latency Metrics**: Per-stage timing breakdown
- **Confidence Score**: AI confidence level
- **Verification Status**: Hallucination check result
- **Mode**: optimized/comparison/naive

## Storage

### JSON File Storage (Default)
- Location: `backend/logs/analytics.json`
- Retention: Last 100 entries
- Format: Pretty-printed JSON

### MongoDB (Optional)
- Uncomment code in `services/mongoLogger.js`
- Add `MONGODB_URI` to `.env`
- Install: `npm install mongoose`

## API Endpoint

### GET `/api/logs`

Retrieve recent analytics logs.

**Query Parameters:**
- `limit` (optional): Number of logs to return (default: 10, max: 100)

**Example Request:**
```bash
curl http://localhost:5000/api/logs?limit=10
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "logs": [
    {
      "timestamp": "2024-01-15T10:30:45.123Z",
      "token_counts": {
        "original": 500,
        "compressed": 200,
        "reduction_percent": 60.0
      },
      "latency_metrics": {
        "compression_ms": 1250,
        "recommendation_ms": 1800,
        "verification_ms": 15,
        "confidence_ms": 2,
        "total_ms": 3067
      },
      "confidence_score": "85.50",
      "verification_status": "Verified",
      "mode": "optimized"
    }
  ]
}
```

## Log Entry Structure

```json
{
  "timestamp": "ISO 8601 datetime",
  "token_counts": {
    "original": "number | null",
    "compressed": "number | null",
    "reduction_percent": "number | null"
  },
  "latency_metrics": {
    "compression_ms": "number | null",
    "recommendation_ms": "number",
    "verification_ms": "number | null",
    "confidence_ms": "number | null",
    "total_ms": "number"
  },
  "confidence_score": "string",
  "verification_status": "Verified | Mostly Verified | Needs Review",
  "mode": "optimized | comparison | naive"
}
```

## Usage Examples

### JavaScript
```javascript
const response = await fetch('http://localhost:5000/api/logs?limit=20');
const data = await response.json();

console.log(`Retrieved ${data.count} logs`);
data.logs.forEach(log => {
  console.log(`${log.timestamp}: ${log.token_counts.reduction_percent}% reduction`);
});
```

### Python
```python
import requests

response = requests.get('http://localhost:5000/api/logs', params={'limit': 20})
data = response.json()

for log in data['logs']:
    print(f"{log['timestamp']}: {log['confidence_score']} confidence")
```

### cURL
```bash
# Get last 10 logs
curl http://localhost:5000/api/logs

# Get last 50 logs
curl http://localhost:5000/api/logs?limit=50
```

## Analytics Use Cases

### Performance Monitoring
```javascript
const logs = await fetch('/api/logs?limit=100').then(r => r.json());
const avgLatency = logs.logs.reduce((sum, log) => 
  sum + log.latency_metrics.total_ms, 0) / logs.count;
console.log(`Average latency: ${avgLatency}ms`);
```

### Token Savings Analysis
```javascript
const logs = await fetch('/api/logs?limit=100').then(r => r.json());
const avgReduction = logs.logs
  .filter(log => log.token_counts.reduction_percent)
  .reduce((sum, log) => sum + log.token_counts.reduction_percent, 0) / logs.count;
console.log(`Average token reduction: ${avgReduction}%`);
```

### Confidence Tracking
```javascript
const logs = await fetch('/api/logs?limit=100').then(r => r.json());
const highConfidence = logs.logs.filter(log => 
  parseFloat(log.confidence_score) > 75).length;
console.log(`${highConfidence}/${logs.count} high confidence results`);
```

## Log File Management

### Manual Cleanup
```bash
# Clear all logs
rm backend/logs/analytics.json

# Backup logs
cp backend/logs/analytics.json backend/logs/analytics_backup_$(date +%Y%m%d).json
```

### Automatic Rotation
The system automatically maintains the last 100 entries. Older entries are removed automatically.

## MongoDB Integration

To enable MongoDB storage:

1. **Install Mongoose:**
```bash
cd backend
npm install mongoose
```

2. **Configure Environment:**
```env
MONGODB_URI=mongodb://localhost:27017/emergency-triage
```

3. **Enable in Code:**
Uncomment code in `backend/src/services/mongoLogger.js`

4. **Update Controllers:**
```javascript
const { logToMongoDB } = require('../services/mongoLogger');

// After successful operation
await logToMongoDB(analyticsData);
```

5. **Query MongoDB:**
```javascript
const { getLogsFromMongoDB } = require('../services/mongoLogger');
const logs = await getLogsFromMongoDB(50);
```

## Benefits

✅ **Performance Tracking**: Monitor latency trends  
✅ **Cost Analysis**: Track token usage and savings  
✅ **Quality Metrics**: Confidence and verification rates  
✅ **Audit Trail**: Complete operation history  
✅ **Optimization**: Identify bottlenecks  
✅ **Reporting**: Generate analytics dashboards  

## Security

- Logs do not contain patient data or API keys
- Only metrics and performance data stored
- File-based logs are local to server
- MongoDB connection should use authentication
