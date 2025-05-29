// server.js - Backend server for Soccer Matches App
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve frontend files

// API Configuration
const FOOTBALL_API_URL = 'https://api.football-data.org/v4/competitions/PL/matches';
const API_KEY = process.env.FOOTBALL_API_KEY || 'd32f0abb36e24245b45f92be57d42e94';

// Routes
app.get('/api/matches', async (req, res) => {
    try {
        console.log('Fetching matches from Football-Data.org API...');
        
        const response = await fetch(FOOTBALL_API_URL, {
            method: 'GET',
            headers: {
                'X-Auth-Token': API_KEY,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('API key invalid or quota exceeded');
            } else if (response.status === 429) {
                throw new Error('API rate limit exceeded');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Filter for upcoming matches only
        const now = new Date();
        const upcomingMatches = data.matches.filter(match => {
            const matchDate = new Date(match.utcDate);
            return matchDate > now;
        }).slice(0, 10); // Limit to next 10 matches

        console.log(`Successfully fetched ${upcomingMatches.length} upcoming matches`);
        
        res.json({
            success: true,
            matches: upcomingMatches,
            totalMatches: upcomingMatches.length,
            lastUpdated: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error fetching matches:', error.message);
        
        // Return mock data as fallback
        const mockData = getMockMatches();
        
        res.json({
            success: false,
            error: error.message,
            matches: mockData,
            totalMatches: mockData.length,
            lastUpdated: new Date().toISOString(),
            usingMockData: true
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Mock data fallback function
function getMockMatches() {
    const today = new Date();
    return [
        {
            homeTeam: { name: "Manchester United" },
            awayTeam: { name: "Liverpool" },
            utcDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            competition: { name: "Premier League" }
        },
        {
            homeTeam: { name: "Chelsea" },
            awayTeam: { name: "Arsenal" },
            utcDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            competition: { name: "Premier League" }
        },
        {
            homeTeam: { name: "Manchester City" },
            awayTeam: { name: "Tottenham" },
            utcDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            competition: { name: "Premier League" }
        }
    ];
}

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Soccer Matches Backend Server running on port ${PORT}`);
    console.log(`📡 API endpoint: http://localhost:${PORT}/api/matches`);
    console.log(`💓 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
