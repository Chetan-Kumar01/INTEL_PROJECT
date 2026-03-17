# Enhanced Medical Chatbot with Case History

## Features Added

### 1. Patient Name Input
- Enter patient name at the start of each session
- Name is displayed in the header
- Required to save case history

### 2. Case History Management
- **Save Cases**: Click "💾 Save Case as [Name]" button to save current conversation
- **View History**: Click "📋 History" button to see all saved cases
- **Load Cases**: Click on any saved case to reload the conversation
- Cases are stored with:
  - Patient name
  - Document name
  - Full conversation history
  - Timestamp

### 3. Improved UI
- Clear header showing document and patient name
- Collapsible patient name input
- Collapsible case history panel
- Better message formatting with whitespace support
- Mode selector (Deep Analysis / Quick Answer)
- Clear chat button

### 4. General Chat Support
The chatbot can now handle:
- Medical questions about the document
- General greetings ("hi", "hello")
- Any questions - it will respond based on the indexed document

## API Endpoints

### GET /case_history
Retrieves all saved case histories
```json
{
  "cases": [
    {
      "patient_name": "John Doe",
      "patient_id": "patient_Migration_Report_Chennai_2037",
      "document_name": "Migration_Report_Chennai_2037.pdf",
      "messages": [...],
      "timestamp": "2025-01-15T10:30:00Z"
    }
  ]
}
```

### POST /case_history
Saves a new case history
```json
{
  "patient_name": "John Doe",
  "patient_id": "patient_Migration_Report_Chennai_2037",
  "document_name": "Migration_Report_Chennai_2037.pdf",
  "messages": [...],
  "timestamp": "2025-01-15T10:30:00Z"
}
```

## Usage Instructions

1. **Start the Backend**:
   ```bash
   cd emergency-triage-assistant/fastapi-backend
   uvicorn app.main:app --reload
   ```

2. **Start the Frontend**:
   ```bash
   cd emergency-triage-assistant/frontend
   npm run dev
   ```

3. **Using the Chatbot**:
   - Enter patient name in the input field
   - Ask any question about the document
   - View source chunks for transparency
   - Save important cases for future reference
   - Load previous cases from history

## Data Storage

Case histories are stored in:
`fastapi-backend/data/case_history.json`

This file is automatically created on first save.

## Features Summary

✅ Patient name input and display
✅ Save conversation with patient name
✅ Load previous conversations
✅ View all saved cases
✅ Clear, organized UI
✅ Source chunk citations
✅ Performance metrics (retrieval + LLM latency)
✅ Deep Analysis / Quick Answer modes
✅ General chat support
