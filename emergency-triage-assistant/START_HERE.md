# Quick Start Guide

## ✅ Setup Complete!

Your API key has been configured and dependencies are installed.

## 🚀 To Run the Application:

### Option 1: Double-click the startup script
```
start.bat
```

### Option 2: Manual start (2 terminals)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 📱 Access the Application:

Once started, open your browser to:
**http://localhost:3000**

## 🔑 Using the Application:

1. **Configure API Keys** (in the Settings panel):
   - ScaleDown API Key: Your OpenAI key
   - LLM API Key: Same OpenAI key
   - Click "Set API Keys"

2. **Load Sample Case**:
   - Click "❤️ Load Sample Cardiac Case" button
   - This fills in a realistic 20-page patient history

3. **Choose Mode**:
   - **Optimized**: Full 4-stage pipeline with compression
   - **A/B Comparison**: Side-by-side naive vs optimized

4. **Analyze**:
   - Click "🚀 Analyze Case"
   - View results with metrics, charts, and recommendations

## 📊 What You'll See:

- **Animated Metrics Cards**: Latency, compression, confidence
- **Circular Progress**: Token reduction visualization
- **Confidence Gauge**: Color-coded reliability meter
- **Latency Bar Graph**: Stage-by-stage timing
- **Structured Recommendations**: Immediate action, diagnosis, risks
- **JSON Viewer**: Expandable full response data

## 🎯 Demo Tips:

1. Start with **Optimized mode** to show the full pipeline
2. Then try **A/B Comparison** to prove 70% token savings
3. Show the **confidence gauge** and **verification status**
4. Expand the **JSON viewer** to show structured output
5. Toggle **dark mode** (moon icon) for visual appeal

## ⚠️ Important Notes:

- Backend runs on port 5000
- Frontend runs on port 3000
- API keys stored in memory only (1-hour expiration)
- No patient data is saved
- Logs stored in `backend/logs/analytics.json`

## 🛑 To Stop:

Close the terminal windows or press `Ctrl+C` in each terminal.

## 💡 Troubleshooting:

**Port already in use:**
- Kill processes on ports 5000 and 3000
- Or change ports in backend/.env and frontend/vite.config.js

**API key errors:**
- Verify key starts with `sk-`
- Check you have OpenAI credits
- Re-enter keys in Settings panel

**Dependencies issues:**
- Delete node_modules folders
- Run `npm install` again in both directories

---

**Ready to impress the judges!** 🏆
