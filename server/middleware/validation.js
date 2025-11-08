const mongoSanitize = require('express-mongo-sanitize');

// Sanitize user input to prevent NoSQL injection
const sanitizeInput = (req, res, next) => {
  // Sanitize req.body, req.query, and req.params
  req.body = mongoSanitize.sanitize(req.body);
  req.query = mongoSanitize.sanitize(req.query);
  req.params = mongoSanitize.sanitize(req.params);
  next();
};

// Validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate required fields
const validateRequiredFields = (fields) => (req, res, next) => {
  const missingFields = fields.filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(', ')}`
    });
  }
  
  // Validate email if present
  if (req.body.email && !validateEmail(req.body.email)) {
    return res.status(400).json({
      error: 'Invalid email format'
    });
  }
  
  next();
};

module.exports = {
  sanitizeInput,
  validateRequiredFields,
  validateEmail
};
