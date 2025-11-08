const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getMyAttendance,
  getTodayAttendance,
  getAttendanceStats
} = require('../controllers/attendanceController');
const { auth } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

router.post('/mark', markAttendance);
router.get('/my', getMyAttendance);
router.get('/today', getTodayAttendance);
router.get('/stats', getAttendanceStats);

module.exports = router;
