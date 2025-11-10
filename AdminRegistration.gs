/**
 * Admin Registration and Management Functions
 * Handles user administration, reporting, and system maintenance
 */

// Admin configuration
const ADMIN_EMAILS = ['admin@example.com']; // Configure admin emails here

/**
 * Check if user is an admin
 */
function isAdmin(email) {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

/**
 * Get all registered users
 */
function getAllUsers() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const usersSheet = ss.getSheetByName(SHEET_NAME_USERS);
  const data = usersSheet.getDataRange().getValues();
  
  const users = [];
  for (let i = 1; i < data.length; i++) {
    users.push({
      userId: data[i][0],
      name: data[i][1],
      email: data[i][2],
      createdAt: data[i][3],
      active: data[i][4]
    });
  }
  
  return users;
}

/**
 * Get attendance records with filters
 */
function getAttendanceRecords(startDate, endDate, userId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const attendanceSheet = ss.getSheetByName(SHEET_NAME_ATTENDANCE);
  const data = attendanceSheet.getDataRange().getValues();
  
  const records = [];
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  
  for (let i = 1; i < data.length; i++) {
    const recordDate = new Date(data[i][5]);
    
    // Apply filters
    if (userId && data[i][0] !== userId) continue;
    if (start && recordDate < start) continue;
    if (end && recordDate > end) continue;
    
    records.push({
      userId: data[i][0],
      name: data[i][1],
      email: data[i][2],
      clockIn: data[i][3],
      clockOut: data[i][4],
      date: data[i][5],
      duration: data[i][6],
      status: data[i][7]
    });
  }
  
  return records;
}

/**
 * Get user attendance summary
 */
function getUserAttendanceSummary(userId, month, year) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const attendanceSheet = ss.getSheetByName(SHEET_NAME_ATTENDANCE);
  const data = attendanceSheet.getDataRange().getValues();
  
  let totalDays = 0;
  let totalHours = 0;
  let openSessions = 0;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] !== userId) continue;
    
    const recordDate = new Date(data[i][5]);
    
    // Filter by month and year if provided
    if (month !== undefined && year !== undefined) {
      if (recordDate.getMonth() !== month || recordDate.getFullYear() !== year) {
        continue;
      }
    }
    
    totalDays++;
    
    if (data[i][6]) { // Has duration
      totalHours += parseFloat(data[i][6]);
    }
    
    if (!data[i][4]) { // No clock-out time
      openSessions++;
    }
  }
  
  return {
    totalDays: totalDays,
    totalHours: totalHours.toFixed(2),
    openSessions: openSessions,
    averageHoursPerDay: totalDays > 0 ? (totalHours / totalDays).toFixed(2) : 0
  };
}

/**
 * Activate or deactivate a user
 */
function toggleUserStatus(userId, active) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const usersSheet = ss.getSheetByName(SHEET_NAME_USERS);
  const data = usersSheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      usersSheet.getRange(i + 1, 5).setValue(active);
      return { success: true, message: 'User status updated' };
    }
  }
  
  return { success: false, error: 'User not found' };
}

/**
 * Delete a user (soft delete by deactivating)
 */
function deleteUser(userId) {
  return toggleUserStatus(userId, false);
}

/**
 * Clean up expired sessions
 */
function cleanupExpiredSessions() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sessionsSheet = ss.getSheetByName(SHEET_NAME_SESSIONS);
  const data = sessionsSheet.getDataRange().getValues();
  
  const now = new Date();
  let cleanedCount = 0;
  
  // Start from bottom to avoid row index issues when deleting
  for (let i = data.length - 1; i >= 1; i--) {
    const expiresAt = new Date(data[i][4]);
    
    if (expiresAt < now) {
      sessionsSheet.deleteRow(i + 1);
      cleanedCount++;
    }
  }
  
  return { 
    success: true, 
    message: 'Cleaned up ' + cleanedCount + ' expired sessions' 
  };
}

/**
 * Force clock out a user (admin function)
 */
function forceClockOut(userId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const attendanceSheet = ss.getSheetByName(SHEET_NAME_ATTENDANCE);
  const data = attendanceSheet.getDataRange().getValues();
  
  let clockedOut = 0;
  const now = new Date();
  
  // Find and close all open sessions for the user
  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][0] === userId && !data[i][4]) { // User ID matches and no clock-out time
      const clockInTime = new Date(data[i][3]);
      const durationMs = now.getTime() - clockInTime.getTime();
      const durationHours = (durationMs / (1000 * 60 * 60)).toFixed(2);
      
      attendanceSheet.getRange(i + 1, 5).setValue(now); // Clock out time
      attendanceSheet.getRange(i + 1, 7).setValue(durationHours); // Duration
      attendanceSheet.getRange(i + 1, 8).setValue('Clocked Out (Admin Force)'); // Status
      
      clockedOut++;
    }
  }
  
  return { 
    success: true, 
    message: 'Force clocked out ' + clockedOut + ' session(s)' 
  };
}

/**
 * Get all open sessions (admin function)
 */
function getAllOpenSessions() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const attendanceSheet = ss.getSheetByName(SHEET_NAME_ATTENDANCE);
  const data = attendanceSheet.getDataRange().getValues();
  
  const openSessions = [];
  
  for (let i = 1; i < data.length; i++) {
    if (!data[i][4]) { // No clock-out time
      const clockInTime = new Date(data[i][3]);
      const now = new Date();
      const durationMs = now.getTime() - clockInTime.getTime();
      const durationHours = (durationMs / (1000 * 60 * 60)).toFixed(2);
      
      openSessions.push({
        userId: data[i][0],
        name: data[i][1],
        email: data[i][2],
        clockIn: data[i][3],
        date: data[i][5],
        currentDuration: durationHours
      });
    }
  }
  
  return openSessions;
}

/**
 * Generate attendance report
 */
function generateAttendanceReport(startDate, endDate) {
  const records = getAttendanceRecords(startDate, endDate);
  
  // Group by user
  const userStats = {};
  
  records.forEach(function(record) {
    if (!userStats[record.userId]) {
      userStats[record.userId] = {
        userId: record.userId,
        name: record.name,
        email: record.email,
        totalDays: 0,
        totalHours: 0,
        records: []
      };
    }
    
    userStats[record.userId].totalDays++;
    
    if (record.duration) {
      userStats[record.userId].totalHours += parseFloat(record.duration);
    }
    
    userStats[record.userId].records.push(record);
  });
  
  return {
    startDate: startDate,
    endDate: endDate,
    totalRecords: records.length,
    userStats: Object.values(userStats)
  };
}

/**
 * Backup data to a new sheet
 */
function backupData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd_HHmmss');
  
  // Backup Attendance
  const attendanceSheet = ss.getSheetByName(SHEET_NAME_ATTENDANCE);
  const attendanceBackup = attendanceSheet.copyTo(ss);
  attendanceBackup.setName('Attendance_Backup_' + timestamp);
  
  // Backup Users
  const usersSheet = ss.getSheetByName(SHEET_NAME_USERS);
  const usersBackup = usersSheet.copyTo(ss);
  usersBackup.setName('Users_Backup_' + timestamp);
  
  // Backup Sessions
  const sessionsSheet = ss.getSheetByName(SHEET_NAME_SESSIONS);
  const sessionsBackup = sessionsSheet.copyTo(ss);
  sessionsBackup.setName('Sessions_Backup_' + timestamp);
  
  return {
    success: true,
    message: 'Data backed up successfully',
    timestamp: timestamp
  };
}

/**
 * Get system statistics
 */
function getSystemStats() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Get counts
  const usersSheet = ss.getSheetByName(SHEET_NAME_USERS);
  const totalUsers = usersSheet.getLastRow() - 1; // Exclude header
  
  const attendanceSheet = ss.getSheetByName(SHEET_NAME_ATTENDANCE);
  const totalRecords = attendanceSheet.getLastRow() - 1;
  
  const sessionsSheet = ss.getSheetByName(SHEET_NAME_SESSIONS);
  const totalSessions = sessionsSheet.getLastRow() - 1;
  
  // Count active users
  const userData = usersSheet.getDataRange().getValues();
  let activeUsers = 0;
  for (let i = 1; i < userData.length; i++) {
    if (userData[i][4]) activeUsers++;
  }
  
  // Count open sessions
  const openSessions = getAllOpenSessions().length;
  
  // Count active sessions
  const sessionData = sessionsSheet.getDataRange().getValues();
  const now = new Date();
  let activeSessions = 0;
  for (let i = 1; i < sessionData.length; i++) {
    const expiresAt = new Date(sessionData[i][4]);
    if (sessionData[i][6] && expiresAt > now) {
      activeSessions++;
    }
  }
  
  return {
    totalUsers: totalUsers,
    activeUsers: activeUsers,
    totalRecords: totalRecords,
    openClockIns: openSessions,
    totalSessions: totalSessions,
    activeSessions: activeSessions
  };
}

/**
 * Create time-based trigger for automated cleanup
 */
function setupAutomatedCleanup() {
  // Delete existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(trigger) {
    if (trigger.getHandlerFunction() === 'automatedCleanup') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Create new daily trigger
  ScriptApp.newTrigger('automatedCleanup')
    .timeBased()
    .everyDays(1)
    .atHour(2) // Run at 2 AM
    .create();
  
  return { success: true, message: 'Automated cleanup scheduled' };
}

/**
 * Automated cleanup function (runs daily)
 */
function automatedCleanup() {
  cleanupExpiredSessions();
  Logger.log('Automated cleanup completed at ' + new Date());
}
