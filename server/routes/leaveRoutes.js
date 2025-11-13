const express = require('express');
const router = express.Router();
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus
} = require('../controllers/leaveController');
const { auth, isManagerOrAdmin } = require('../middleware/auth');
const { leaveLimiter } = require('../middleware/rateLimiter');
const { validateRequiredFields } = require('../middleware/validation');

// All routes require authentication
router.use(auth);

router.post('/apply', leaveLimiter, validateRequiredFields(['startDate', 'endDate', 'reason']), applyLeave);
router.get('/my', getMyLeaves);
router.get('/all', isManagerOrAdmin, getAllLeaves);
router.patch('/:leaveId/status', isManagerOrAdmin, validateRequiredFields(['status']), updateLeaveStatus);

module.exports = router;
