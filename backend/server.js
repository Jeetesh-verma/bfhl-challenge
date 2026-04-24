const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Import the hierarchy processor
const { processHierarchies } = require('./processor');

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Main BFHL endpoint
app.post('/bfhl', (req, res) => {
  try {
    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        error: 'Invalid request. "data" field must be an array.'
      });
    }

    // Process the hierarchies
    const result = processHierarchies(data);

    return res.json(result);
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// 404 handler - Fallback to index.html for SPA
app.use((req, res) => {
  // If it's an API request, return JSON error
  if (req.path.startsWith('/api') || req.path.startsWith('/bfhl') || req.path.startsWith('/health')) {
    return res.status(404).json({ error: 'Route not found' });
  }
  // Otherwise serve index.html for SPA routing
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ API: http://localhost:${PORT}/bfhl`);
  console.log(`✓ Health check: http://localhost:${PORT}/health`);
});
