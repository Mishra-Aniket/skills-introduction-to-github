const express = require('express');
const router = express.Router();
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus
} = require('../controllers/leaveController');
const { auth, isManagerOrAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

router.post('/apply', applyLeave);
router.get('/my', getMyLeaves);
router.get('/all', isManagerOrAdmin, getAllLeaves);
router.patch('/:leaveId/status', isManagerOrAdmin, updateLeaveStatus);

module.exports = router;
