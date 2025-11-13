const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getMyAttendance,
  getTodayAttendance,
  getAttendanceStats
} = require('../controllers/attendanceController');
const { auth } = require('../middleware/auth');
const { attendanceLimiter } = require('../middleware/rateLimiter');
const { validateRequiredFields } = require('../middleware/validation');

// All routes require authentication
router.use(auth);

router.post('/mark', attendanceLimiter, validateRequiredFields(['status']), markAttendance);
router.get('/my', getMyAttendance);
router.get('/today', getTodayAttendance);
router.get('/stats', getAttendanceStats);

module.exports = router;
