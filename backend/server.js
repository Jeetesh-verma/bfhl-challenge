const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ API: http://localhost:${PORT}/bfhl`);
  console.log(`✓ Health check: http://localhost:${PORT}/health`);
});
