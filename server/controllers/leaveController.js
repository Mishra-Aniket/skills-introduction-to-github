const Leave = require('../models/Leave');
const User = require('../models/User');
const { sendLeaveApplicationEmail, sendLeaveStatusEmail } = require('../utils/emailService');

// Apply for leave
const applyLeave = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;
    const userId = req.userId;

    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }

    // Create leave request
    const leave = new Leave({
      userId,
      startDate,
      endDate,
      reason
    });

    await leave.save();

    // Send email notification
    const user = await User.findById(userId);
    await sendLeaveApplicationEmail(leave, user);

    res.status(201).json({
      message: 'Leave application submitted successfully',
      leave
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get my leave requests
const getMyLeaves = async (req, res) => {
  try {
    const userId = req.userId;
    const { status, page = 1, limit = 20 } = req.query;

    const query = { userId };
    if (status) {
      query.status = status;
    }

    const leaves = await Leave.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('approvedBy', 'name email');

    const count = await Leave.countDocuments(query);

    res.json({
      leaves,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalRecords: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all leave requests (for managers/admins)
const getAllLeaves = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    const leaves = await Leave.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'name email')
      .populate('approvedBy', 'name email');

    const count = await Leave.countDocuments(query);

    res.json({
      leaves,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalRecords: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Approve/Reject leave
const updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status, approvalNotes } = req.body;
    const approvedBy = req.userId;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const leave = await Leave.findById(leaveId);
    if (!leave) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({ error: 'Leave request already processed' });
    }

    leave.status = status;
    leave.approvedBy = approvedBy;
    leave.approvalDate = new Date();
    leave.approvalNotes = approvalNotes;

    await leave.save();

    // Send email notification
    const user = await User.findById(leave.userId);
    await sendLeaveStatusEmail(leave, user, status, approvalNotes);

    res.json({
      message: `Leave ${status} successfully`,
      leave
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus
};
