const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { validateRequiredFields } = require('../middleware/validation');

// Public routes with rate limiting
router.post('/register', authLimiter, validateRequiredFields(['name', 'email', 'password', 'centerId']), register);
router.post('/login', authLimiter, validateRequiredFields(['email', 'password']), login);

// Protected routes
router.get('/me', auth, getCurrentUser);

module.exports = router;
