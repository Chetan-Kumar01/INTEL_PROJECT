# Quick Start Guide

## 5-Minute Setup

### Step 1: Clone/Download Project
```bash
cd emergency-triage-assistant
```

### Step 2: Backend Setup (Terminal 1)
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your OpenAI API key
npm run dev
```

### Step 3: Frontend Setup (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```

### Step 4: Open Browser
Navigate to `http://localhost:3000`

### Step 5: Test the Application
1. Enter your OpenAI API key in the input field
2. Enter a test case description:
   ```
   Patient experiencing severe chest pain, shortness of breath, and dizziness for 30 minutes
   ```
3. Select processing mode (Optimized/Naive/Comparison)
4. Click "Analyze Case"
5. View results with metrics, charts, and recommendations

## Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify Node.js version (18+)
- Check .env file exists and has valid API key

### Frontend won't start
- Check if port 3000 is available
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### API errors
- Verify OpenAI API key is valid
- Check backend is running on port 5000
- Check CORS settings if accessing from different domain

### Charts not displaying
- Ensure recharts is installed: `npm install recharts`
- Check browser console for errors

## Demo Credentials

For testing purposes, you'll need your own OpenAI API key.
Get one at: https://platform.openai.com/api-keys

## Production Deployment

### Backend (Heroku/Railway/Render)
1. Set environment variables in platform dashboard
2. Deploy from Git repository
3. Update frontend API_BASE URL

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `dist` folder
3. Set environment variables if needed

## Next Steps

- Customize the compression algorithm
- Add more LLM providers (Anthropic, Cohere)
- Implement user authentication
- Add database for case history
- Create admin dashboard
- Add real-time notifications
- Implement multi-language support

## Support

For issues or questions:
1. Check the README.md
2. Review API_EXAMPLES.md
3. Check browser/server console logs
4. Verify all dependencies are installed

---

Happy Hacking! 🚀
