# Complete Folder Structure

```
emergency-triage-assistant/
│
├── README.md                          # Main documentation
├── API_EXAMPLES.md                    # API usage examples
├── QUICKSTART.md                      # Quick setup guide
├── PROJECT_SUMMARY.md                 # Hackathon presentation summary
│
├── backend/                           # Node.js Backend
│   ├── package.json                   # Backend dependencies
│   ├── .env.example                   # Environment variables template
│   ├── .gitignore                     # Git ignore rules
│   │
│   └── src/
│       ├── server.js                  # Main Express server
│       │
│       ├── routes/
│       │   └── triage.js              # Triage API routes
│       │
│       ├── controllers/
│       │   └── triageController.js    # Request handlers (optimized/naive)
│       │
│       ├── services/
│       │   ├── compression.js         # ScaleDown compression algorithm
│       │   ├── llm.js                 # OpenAI API integration
│       │   ├── verification.js        # Hallucination verification
│       │   └── confidence.js          # Confidence scoring
│       │
│       ├── utils/
│       │   ├── logger.js              # Logging utility
│       │   └── tokenCounter.js        # Token counting & reduction calc
│       │
│       └── config/                    # (Reserved for future configs)
│
└── frontend/                          # React Frontend
    ├── package.json                   # Frontend dependencies
    ├── vite.config.js                 # Vite configuration
    ├── tailwind.config.js             # Tailwind CSS config
    ├── postcss.config.js              # PostCSS config
    ├── index.html                     # HTML entry point
    │
    └── src/
        ├── main.jsx                   # React entry point
        ├── App.jsx                    # Main application component
        ├── index.css                  # Global styles + Tailwind
        │
        ├── components/
        │   ├── MetricsCard.jsx        # Animated metric display card
        │   ├── LatencyChart.jsx       # Bar chart for latency breakdown
        │   ├── TokenReductionChart.jsx # Pie chart for token savings
        │   └── ComparisonView.jsx     # A/B comparison component
        │
        ├── pages/                     # (Reserved for future pages)
        │
        └── utils/
            └── api.js                 # API client functions
```

## File Descriptions

### Backend Files

#### Core Files
- **server.js**: Express server setup, middleware, error handling
- **package.json**: Dependencies (express, cors, axios, helmet, morgan, dotenv)
- **.env.example**: Template for environment variables

#### Routes
- **triage.js**: Defines POST /optimized and POST /naive endpoints

#### Controllers
- **triageController.js**: 
  - `processOptimized()`: Full pipeline with compression, LLM, verification, confidence
  - `processNaive()`: Direct LLM query without optimization

#### Services
- **compression.js**: Text compression removing filler words
- **llm.js**: OpenAI API integration for medical recommendations
- **verification.js**: Keyword-based hallucination detection
- **confidence.js**: Multi-factor confidence calculation

#### Utils
- **logger.js**: Structured logging (info, error, warn)
- **tokenCounter.js**: Token estimation and reduction calculation

### Frontend Files

#### Core Files
- **main.jsx**: React app initialization
- **App.jsx**: Main dashboard with form, mode selection, results display
- **index.css**: Tailwind imports + glassmorphism styles
- **index.html**: HTML template

#### Components
- **MetricsCard.jsx**: Animated card for displaying single metrics
- **LatencyChart.jsx**: Recharts bar chart for stage-by-stage latency
- **TokenReductionChart.jsx**: Recharts pie chart for token savings
- **ComparisonView.jsx**: Side-by-side naive vs optimized comparison

#### Utils
- **api.js**: Axios-based API client for backend communication

#### Config Files
- **vite.config.js**: Vite bundler configuration
- **tailwind.config.js**: Tailwind CSS customization
- **postcss.config.js**: PostCSS plugins setup

## Dependencies

### Backend (package.json)
```json
{
  "dependencies": {
    "express": "^4.18.2",      // Web framework
    "cors": "^2.8.5",           // Cross-origin support
    "dotenv": "^16.3.1",        // Environment variables
    "axios": "^1.6.2",          // HTTP client
    "helmet": "^7.1.0",         // Security headers
    "morgan": "^1.10.0"         // HTTP logging
  },
  "devDependencies": {
    "nodemon": "^3.0.2"         // Auto-restart on changes
  }
}
```

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",              // UI library
    "react-dom": "^18.2.0",          // React DOM renderer
    "framer-motion": "^10.16.16",    // Animations
    "axios": "^1.6.2",               // HTTP client
    "recharts": "^2.10.3"            // Charts library
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1", // Vite React plugin
    "vite": "^5.0.8",                 // Build tool
    "tailwindcss": "^3.4.0",          // CSS framework
    "autoprefixer": "^10.4.16",       // CSS prefixer
    "postcss": "^8.4.32"              // CSS processor
  }
}
```

## Environment Variables

### Backend (.env)
```env
PORT=5000                              # Server port
NODE_ENV=development                   # Environment
OPENAI_API_KEY=sk-...                 # OpenAI API key
```

## API Endpoints

### Backend Routes
- `GET /health` - Health check
- `POST /api/triage/optimized` - Optimized processing
- `POST /api/triage/naive` - Naive processing

## Data Flow

```
User Input (Frontend)
    ↓
API Request (axios)
    ↓
Express Route (/api/triage/optimized)
    ↓
Controller (triageController.js)
    ↓
Services Pipeline:
    1. compression.js → Compress text
    2. llm.js → Get LLM recommendation
    3. verification.js → Verify output
    4. confidence.js → Calculate confidence
    ↓
JSON Response
    ↓
Frontend Display (Charts, Metrics, Cards)
```

## Build Commands

### Development
```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev
```

### Production
```bash
# Backend
cd backend && npm start

# Frontend
cd frontend && npm run build && npm run preview
```

## Port Configuration

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000
- **API Base**: http://localhost:5000/api

---

This structure provides a clean, modular, and scalable architecture suitable for hackathon presentation and future development.
