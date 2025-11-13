const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'sunday_off'],
    required: true
  },
  geolocation: {
    latitude: {
      type: Number,
      required: function() { return this.status === 'present'; }
    },
    longitude: {
      type: Number,
      required: function() { return this.status === 'present'; }
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  centerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Center',
    required: true
  },
  notes: {
    type: String,
    trim: true
  }
});

// Compound index to ensure one attendance per user per day
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
