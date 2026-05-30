require('dotenv').config();

const express = require('express');
const cors = require('cors');
const initDB = require('./db/init');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));

// Parse JSON bodies
app.use(express.json());

// Initialize database
const db = initDB();

// Mount routes
app.use('/api/auth', authRoutes(db));
app.use('/api/tasks', taskRoutes(db));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
