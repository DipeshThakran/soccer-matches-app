# Soccer Matches Web App

A full-stack web application displaying upcoming Premier League matches.

## Architecture
- **Frontend**: HTML, CSS, JavaScript (communicates with backend API)
- **Backend**: Node.js + Express (fetches data from Football-Data.org API)
- **API**: Football-Data.org REST API

## Features
- Separate frontend and backend architecture
- Live Premier League match data
- Responsive design
- Error handling and fallbacks
- Health check endpoints

## Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with your API key
4. Start server: `npm start`
5. Open http://localhost:3000

## API Endpoints
- `GET /api/matches` - Fetch upcoming matches
- `GET /api/health` - Backend health check
