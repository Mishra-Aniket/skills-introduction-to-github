const Attendance = require('../models/Attendance');
const { isSunday, getStartOfDay, getEndOfDay } = require('../utils/dateHelper');

// Mark attendance
const markAttendance = async (req, res) => {
  try {
    const { status, latitude, longitude, notes } = req.body;
    const userId = req.userId;
    const today = getStartOfDay(new Date());

    // Check if it's Sunday
    if (isSunday(today)) {
      // Auto-mark as Sunday off
      const existingAttendance = await Attendance.findOne({
        userId,
        date: today
      });

      if (existingAttendance) {
        return res.status(400).json({ error: 'Attendance already marked for today' });
      }

      const attendance = new Attendance({
        userId,
        date: today,
        status: 'sunday_off',
        centerId: req.user.centerId
      });

      await attendance.save();
      return res.status(201).json({
        message: 'Sunday automatically marked as off',
        attendance
      });
    }

    // Check if attendance already marked
    const existingAttendance = await Attendance.findOne({
      userId,
      date: today
    });

    if (existingAttendance) {
      return res.status(400).json({ error: 'Attendance already marked for today' });
    }

    // Validate geolocation for present status
    if (status === 'present' && (!latitude || !longitude)) {
      return res.status(400).json({ error: 'Geolocation required for marking present' });
    }

    // Create attendance record
    const attendance = new Attendance({
      userId,
      date: today,
      status,
      geolocation: status === 'present' ? { latitude, longitude } : undefined,
      centerId: req.user.centerId,
      notes
    });

    await attendance.save();

    res.status(201).json({
      message: 'Attendance marked successfully',
      attendance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get attendance for current user
const getMyAttendance = async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 30 } = req.query;
    const userId = req.userId;

    const query = { userId };

    if (startDate && endDate) {
      query.date = {
        $gte: getStartOfDay(startDate),
        $lte: getEndOfDay(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('centerId', 'name');

    const count = await Attendance.countDocuments(query);

    res.json({
      attendance,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalRecords: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get today's attendance status
const getTodayAttendance = async (req, res) => {
  try {
    const userId = req.userId;
    const today = getStartOfDay(new Date());

    const attendance = await Attendance.findOne({
      userId,
      date: today
    }).populate('centerId', 'name');

    res.json({
      attendance,
      isSunday: isSunday(today),
      canMark: !attendance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get attendance statistics
const getAttendanceStats = async (req, res) => {
  try {
    const userId = req.userId;
    const { month, year } = req.query;

    const startDate = new Date(year || new Date().getFullYear(), month || new Date().getMonth(), 1);
    const endDate = new Date(year || new Date().getFullYear(), (month || new Date().getMonth()) + 1, 0);

    const attendance = await Attendance.find({
      userId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });

    const stats = {
      total: attendance.length,
      present: attendance.filter(a => a.status === 'present').length,
      absent: attendance.filter(a => a.status === 'absent').length,
      sundayOff: attendance.filter(a => a.status === 'sunday_off').length
    };

    res.json({ stats, attendance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  markAttendance,
  getMyAttendance,
  getTodayAttendance,
  getAttendanceStats
};
