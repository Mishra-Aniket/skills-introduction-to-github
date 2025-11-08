require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./server/config/database');
const { apiLimiter } = require('./server/middleware/rateLimiter');
const { sanitizeInput } = require('./server/middleware/validation');

// Import routes
const authRoutes = require('./server/routes/authRoutes');
const attendanceRoutes = require('./server/routes/attendanceRoutes');
const leaveRoutes = require('./server/routes/leaveRoutes');
const centerRoutes = require('./server/routes/centerRoutes');

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Security Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sanitize data to prevent NoSQL injection
app.use(mongoSanitize());
app.use(sanitizeInput);

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/centers', centerRoutes);

// Serve main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} to access the application`);
});
