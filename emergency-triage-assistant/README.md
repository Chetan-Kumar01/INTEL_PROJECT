# 🚑 Emergency Response Triage Assistant

A national-level hackathon project featuring AI-powered medical triage with advanced optimization techniques.

## 🏗️ Architecture

### Backend (Node.js + Express)
- **ScaleDown Compression**: Reduces token usage by removing filler words
- **LLM Integration**: OpenAI GPT-3.5-turbo for medical recommendations
- **Hallucination Verification**: Validates LLM output against input
- **Confidence Scoring**: Multi-factor confidence calculation
- **Latency Tracking**: Per-stage performance monitoring
- **Secure API Key Handling**: In-memory storage, never exposed to frontend

### Frontend (React + Vite + Tailwind)
- **Glassmorphism Design**: Modern medical dashboard UI
- **Framer Motion**: Smooth animations and transitions
- **Real-time Metrics**: Token reduction, latency breakdown
- **Interactive Charts**: Recharts for data visualization
- **A/B Comparison Mode**: Side-by-side naive vs optimized comparison

## 📁 Project Structure

```
emergency-triage-assistant/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── triageController.js
│   │   ├── routes/
│   │   │   └── triage.js
│   │   ├── services/
│   │   │   ├── compression.js
│   │   │   ├── llm.js
│   │   │   ├── verification.js
│   │   │   └── confidence.js
│   │   ├── utils/
│   │   │   ├── logger.js
│   │   │   └── tokenCounter.js
│   │   └── server.js
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MetricsCard.jsx
│   │   │   ├── LatencyChart.jsx
│   │   │   ├── TokenReductionChart.jsx
│   │   │   └── ComparisonView.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- OpenAI API Key

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Edit `.env` and add your configuration:
```env
PORT=5000
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key_here
```

5. Start the server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🔌 API Endpoints

### POST `/api/triage/optimized`
Process case with full optimization pipeline

**Request:**
```json
{
  "caseDescription": "Patient experiencing severe chest pain, shortness of breath, and dizziness for 30 minutes",
  "apiKey": "sk-..."
}
```

**Response:**
```json
{
  "success": true,
  "mode": "optimized",
  "data": {
    "original": "Patient experiencing severe chest pain...",
    "compressed": "Patient experiencing severe chest pain shortness breath dizziness 30 minutes",
    "recommendation": "Triage Level: Critical. Immediate cardiac evaluation required...",
    "tokenStats": {
      "originalTokens": 25,
      "compressedTokens": 15,
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

### POST `/api/triage/naive`
Process case without optimization

**Request:**
```json
{
  "caseDescription": "Patient experiencing severe chest pain...",
  "apiKey": "sk-..."
}
```

**Response:**
```json
{
  "success": true,
  "mode": "naive",
  "data": {
    "original": "Patient experiencing severe chest pain...",
    "recommendation": "Triage Level: Critical...",
    "tokenStats": {
      "originalTokens": 25,
      "compressedTokens": 25,
      "reduction": "0.00"
    },
    "latency": {
      "llm": 1450,
      "total": 1450
    }
  }
}
```

## 🎯 Core Features

1. **ScaleDown Compression**: Removes filler words, reduces token count by 30-50%
2. **LLM Recommendation**: Medical triage classification and recommendations
3. **Hallucination Verification**: Keyword matching to prevent AI hallucinations
4. **Confidence Scoring**: Weighted scoring based on verification and compression
5. **Token Counter**: Accurate token estimation for cost analysis
6. **Latency Tracking**: Millisecond-level performance monitoring per stage
7. **A/B Comparison**: Visual side-by-side comparison of approaches
8. **Secure API Keys**: Memory-only storage, never persisted
9. **Structured JSON**: Clean, consistent API responses
10. **Error Handling**: Comprehensive error management and logging

## 🎨 UI Features

- **Glassmorphism Design**: Modern, translucent card-based interface
- **Animated Metrics**: Smooth transitions with Framer Motion
- **Interactive Charts**: Bar charts for latency, pie charts for token reduction
- **Responsive Layout**: Mobile-first design with Tailwind CSS
- **Real-time Feedback**: Loading states and error messages
- **Three Processing Modes**: Optimized, Naive, and Comparison

## 📊 Example Use Cases

### Critical Emergency
```
Input: "45-year-old male, severe chest pain radiating to left arm, profuse sweating, BP 180/110"
Output: Triage Level: Critical - Immediate cardiac evaluation, possible MI
```

### Urgent Care
```
Input: "Child with high fever 103°F, difficulty breathing, wheezing sounds"
Output: Triage Level: Urgent - Respiratory assessment needed, possible pneumonia
```

### Standard Care
```
Input: "Minor laceration on forearm, bleeding controlled, no other symptoms"
Output: Triage Level: Standard - Wound cleaning and suturing required
```

## 🔒 Security Features

- API keys stored in memory only (backend)
- CORS protection
- Helmet.js security headers
- Input validation
- Error message sanitization
- No sensitive data logging

## 🏆 Hackathon Highlights

- **Complete Full-Stack Solution**: Production-ready architecture
- **Advanced AI Pipeline**: Multi-stage processing with optimization
- **Professional UI/UX**: Modern glassmorphism design
- **Performance Metrics**: Real-time latency and token tracking
- **Scalable Architecture**: Modular, maintainable codebase
- **Documentation**: Comprehensive setup and API docs

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key_here
```

## 🛠️ Tech Stack

**Backend:**
- Node.js
- Express.js
- Axios
- Helmet
- Morgan
- CORS

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Recharts
- Axios

## 📦 Build for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 🤝 Contributing

This is a hackathon project. Feel free to fork and enhance!

## 📄 License

MIT License

---

Built with ❤️ for National Hackathon 2024
