// Import dependencies
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// Set up middleware
// CORS - allows frontend (different port) to talk to backend
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Import routes
const crawlerRoutes = require('./routes/routes_crawler');
const authRoutes = require('./routes/authRoutes');

// Connect routes to /api path
app.use('/api/auth', authRoutes);
app.use('/api', crawlerRoutes);  

// Basic home route (just to test server is working)
app.get('/', (req, res) => {
    res.json({ 
        message: 'Web Crawler API is running!',
        endpoints: {
            crawl: 'POST /api/crawl',
            results: 'GET /api/results'
        }
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api`);
});