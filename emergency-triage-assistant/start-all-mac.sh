#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Emergency Triage Assistant Startup (Mac)   ${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Step 1: Check Ollama
echo -e "${YELLOW}[1/4] Checking Ollama service...${NC}"
if curl -s http://127.0.0.1:11434/api/tags > /dev/null; then
  echo -e "${GREEN}✓ Ollama is running${NC}"
else
  echo -e "${RED}✗ Ollama is not running! Please start the Ollama application first.${NC}"
  exit 1
fi

echo -e "\n${YELLOW}[2/4] Starting FastAPI Backend (Port 8000)...${NC}"
osascript -e 'tell app "Terminal" to do script "cd \"'$(pwd)'/fastapi-backend\" && source venv/bin/activate && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"'

echo -e "\n${YELLOW}[3/4] Starting Node.js Backend (Port 5001)...${NC}"
osascript -e 'tell app "Terminal" to do script "cd \"'$(pwd)'/backend\" && npm run dev"'

echo -e "\n${YELLOW}[4/4] Starting React Frontend (Port 3001)...${NC}"
osascript -e 'tell app "Terminal" to do script "cd \"'$(pwd)'/frontend\" && npm run dev -- --port 3001"'

echo -e "\n${GREEN}✓ All services are booting up in separate terminal windows!${NC}"
echo -e "Main App: ${BLUE}http://localhost:3001${NC}"
sleep 3
open http://localhost:3001
