/**
 * PhysicsWallah Teacher Attendance System
 * Google Apps Script Backend
 * 
 * This script handles:
 * - Teacher authentication
 * - Attendance recording with geolocation
 * - Leave request management
 * - Manager approval workflow
 * - Sunday auto-off automation
 * - Multiple centers management
 * - Attendance reports and analytics
 */

// Configuration
const CONFIG = {
  SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID_HERE', // Replace with your Google Sheet ID
  SHEETS: {
    TEACHERS: 'Teachers',
    ATTENDANCE: 'Attendance Log',
    LEAVES: 'Leave Requests',
    CENTERS: 'Centers'
  },
  TIMEZONE: 'Asia/Kolkata'
};

/**
 * Serve the HTML page
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('PhysicsWallah Attendance System')
    .setFaviconUrl('https://www.pw.live/favicon.ico')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Get active spreadsheet and sheet
 */
function getSheet(sheetName) {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  return ss.getSheetByName(sheetName);
}

/**
 * Initialize database sheets if they don't exist
 */
function initializeSheets() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  
  // Initialize Teachers sheet
  let teachersSheet = ss.getSheetByName(CONFIG.SHEETS.TEACHERS);
  if (!teachersSheet) {
    teachersSheet = ss.insertSheet(CONFIG.SHEETS.TEACHERS);
    teachersSheet.appendRow(['Name', 'Email', 'Phone', 'Password', 'Center', 'Manager Email', 'Status', 'Created Date']);
    teachersSheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#4285f4').setFontColor('#ffffff');
  }
  
  // Initialize Attendance Log sheet
  let attendanceSheet = ss.getSheetByName(CONFIG.SHEETS.ATTENDANCE);
  if (!attendanceSheet) {
    attendanceSheet = ss.insertSheet(CONFIG.SHEETS.ATTENDANCE);
    attendanceSheet.appendRow([
      'Timestamp', 'Date', 'Email', 'Name', 'Clock In Time', 'Clock In Location', 
      'Clock In Lat', 'Clock In Lng', 'Clock Out Time', 'Clock Out Location', 
      'Clock Out Lat', 'Clock Out Lng', 'Hours Worked', 'Status'
    ]);
    attendanceSheet.getRange(1, 1, 1, 14).setFontWeight('bold').setBackground('#4285f4').setFontColor('#ffffff');
  }
  
  // Initialize Leave Requests sheet
  let leavesSheet = ss.getSheetByName(CONFIG.SHEETS.LEAVES);
  if (!leavesSheet) {
    leavesSheet = ss.insertSheet(CONFIG.SHEETS.LEAVES);
    leavesSheet.appendRow([
      'Timestamp', 'Email', 'Name', 'Manager Email', 'From Date', 'To Date', 
      'Days', 'Reason', 'Status', 'Approved By', 'Approved Date'
    ]);
    leavesSheet.getRange(1, 1, 1, 11).setFontWeight('bold').setBackground('#4285f4').setFontColor('#ffffff');
  }
  
  // Initialize Centers sheet
  let centersSheet = ss.getSheetByName(CONFIG.SHEETS.CENTERS);
  if (!centersSheet) {
    centersSheet = ss.insertSheet(CONFIG.SHEETS.CENTERS);
    centersSheet.appendRow(['Center Name', 'Latitude', 'Longitude', 'Radius (meters)', 'Address', 'Status']);
    centersSheet.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#4285f4').setFontColor('#ffffff');
    
    // Add sample centers
    centersSheet.appendRow(['Delhi Center', 28.7041, 77.1025, 100, 'Connaught Place, New Delhi', 'Active']);
    centersSheet.appendRow(['Noida Center', 28.5355, 77.3910, 100, 'Sector 62, Noida', 'Active']);
    centersSheet.appendRow(['Gurugram Center', 28.4595, 77.0266, 100, 'Cyber City, Gurugram', 'Active']);
  }
  
  return { success: true, message: 'Database initialized successfully' };
}

/**
 * Authenticate teacher
 */
function authenticateTeacher(email, password) {
  try {
    const sheet = getSheet(CONFIG.SHEETS.TEACHERS);
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][1] === email && data[i][3] === password && data[i][6] === 'Active') {
        return {
          success: true,
          teacher: {
            name: data[i][0],
            email: data[i][1],
            phone: data[i][2],
            center: data[i][4],
            managerEmail: data[i][5]
          }
        };
      }
    }
    
    return { success: false, message: 'Invalid credentials or inactive account' };
  } catch (error) {
    return { success: false, message: 'Authentication error: ' + error.toString() };
  }
}

/**
 * Check if today is Sunday
 */
function isSunday() {
  const today = new Date();
  return today.getDay() === 0;
}

/**
 * Get all centers
 */
function getCenters() {
  try {
    const sheet = getSheet(CONFIG.SHEETS.CENTERS);
    const data = sheet.getDataRange().getValues();
    const centers = [];
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][5] === 'Active') {
        centers.push({
          name: data[i][0],
          lat: data[i][1],
          lng: data[i][2],
          radius: data[i][3],
          address: data[i][4]
        });
      }
    }
    
    return { success: true, centers: centers };
  } catch (error) {
    return { success: false, message: 'Error fetching centers: ' + error.toString() };
  }
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
}

/**
 * Determine location type (Office/Remote/Center Name)
 */
function determineLocation(lat, lng) {
  try {
    const centersResult = getCenters();
    if (!centersResult.success) {
      return { location: 'Remote', nearestCenter: null };
    }
    
    const centers = centersResult.centers;
    let nearestCenter = null;
    let minDistance = Infinity;
    
    for (const center of centers) {
      const distance = calculateDistance(lat, lng, center.lat, center.lng);
      if (distance < minDistance) {
        minDistance = distance;
        nearestCenter = center;
      }
    }
    
    if (nearestCenter && minDistance <= nearestCenter.radius) {
      return { location: nearestCenter.name, nearestCenter: nearestCenter };
    }
    
    return { location: 'Remote', nearestCenter: nearestCenter };
  } catch (error) {
    return { location: 'Unknown', nearestCenter: null };
  }
}

/**
 * Clock In
 */
function clockIn(email, name, lat, lng, locationName) {
  try {
    // Check if Sunday
    if (isSunday()) {
      return { success: false, message: 'Attendance cannot be marked on Sunday. It is automatically marked as Off.' };
    }
    
    const sheet = getSheet(CONFIG.SHEETS.ATTENDANCE);
    const now = new Date();
    const dateStr = Utilities.formatDate(now, CONFIG.TIMEZONE, 'yyyy-MM-dd');
    const timeStr = Utilities.formatDate(now, CONFIG.TIMEZONE, 'HH:mm:ss');
    const timestamp = Utilities.formatDate(now, CONFIG.TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
    
    // Check if already clocked in today
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][2] === email && data[i][1] === dateStr && data[i][4]) {
        return { success: false, message: 'You have already clocked in today at ' + data[i][4] };
      }
    }
    
    // Determine location type
    const locationInfo = determineLocation(lat, lng);
    
    // Add new attendance record
    sheet.appendRow([
      timestamp,      // Timestamp
      dateStr,        // Date
      email,          // Email
      name,           // Name
      timeStr,        // Clock In Time
      locationInfo.location, // Clock In Location
      lat,            // Clock In Lat
      lng,            // Clock In Lng
      '',             // Clock Out Time (empty)
      '',             // Clock Out Location (empty)
      '',             // Clock Out Lat (empty)
      '',             // Clock Out Lng (empty)
      '',             // Hours Worked (empty)
      'Present'       // Status
    ]);
    
    return { 
      success: true, 
      message: 'Clocked in successfully at ' + timeStr,
      location: locationInfo.location,
      time: timeStr
    };
  } catch (error) {
    return { success: false, message: 'Error clocking in: ' + error.toString() };
  }
}

/**
 * Clock Out
 */
function clockOut(email, lat, lng) {
  try {
    // Check if Sunday
    if (isSunday()) {
      return { success: false, message: 'Attendance cannot be marked on Sunday. It is automatically marked as Off.' };
    }
    
    const sheet = getSheet(CONFIG.SHEETS.ATTENDANCE);
    const now = new Date();
    const dateStr = Utilities.formatDate(now, CONFIG.TIMEZONE, 'yyyy-MM-dd');
    const timeStr = Utilities.formatDate(now, CONFIG.TIMEZONE, 'HH:mm:ss');
    
    // Find today's record without clock out
    const data = sheet.getDataRange().getValues();
    let rowIndex = -1;
    
    for (let i = data.length - 1; i >= 1; i--) {
      if (data[i][2] === email && data[i][1] === dateStr && !data[i][8]) {
        rowIndex = i + 1; // Sheet rows are 1-indexed
        break;
      }
    }
    
    if (rowIndex === -1) {
      return { success: false, message: 'No active clock-in found for today. Please clock in first.' };
    }
    
    // Determine location type
    const locationInfo = determineLocation(lat, lng);
    
    // Calculate hours worked
    const clockInTime = data[rowIndex - 1][4];
    const clockInDate = new Date(dateStr + ' ' + clockInTime);
    const clockOutDate = new Date(dateStr + ' ' + timeStr);
    const hoursWorked = ((clockOutDate - clockInDate) / (1000 * 60 * 60)).toFixed(2);
    
    // Update the record
    sheet.getRange(rowIndex, 9).setValue(timeStr);           // Clock Out Time
    sheet.getRange(rowIndex, 10).setValue(locationInfo.location); // Clock Out Location
    sheet.getRange(rowIndex, 11).setValue(lat);              // Clock Out Lat
    sheet.getRange(rowIndex, 12).setValue(lng);              // Clock Out Lng
    sheet.getRange(rowIndex, 13).setValue(hoursWorked);      // Hours Worked
    
    return { 
      success: true, 
      message: 'Clocked out successfully at ' + timeStr,
      location: locationInfo.location,
      time: timeStr,
      hoursWorked: hoursWorked
    };
  } catch (error) {
    return { success: false, message: 'Error clocking out: ' + error.toString() };
  }
}

/**
 * Get today's attendance status
 */
function getTodayStatus(email) {
  try {
    const sheet = getSheet(CONFIG.SHEETS.ATTENDANCE);
    const now = new Date();
    const dateStr = Utilities.formatDate(now, CONFIG.TIMEZONE, 'yyyy-MM-dd');
    
    // Check if Sunday
    if (isSunday()) {
      return { 
        success: true, 
        isSunday: true,
        status: 'Off',
        message: 'Today is Sunday - Automatic Off'
      };
    }
    
    const data = sheet.getDataRange().getValues();
    
    for (let i = data.length - 1; i >= 1; i--) {
      if (data[i][2] === email && data[i][1] === dateStr) {
        return {
          success: true,
          isSunday: false,
          hasClockedIn: !!data[i][4],
          hasClockedOut: !!data[i][8],
          clockInTime: data[i][4],
          clockInLocation: data[i][5],
          clockOutTime: data[i][8],
          clockOutLocation: data[i][9],
          hoursWorked: data[i][12],
          status: data[i][13]
        };
      }
    }
    
    return { 
      success: true, 
      isSunday: false,
      hasClockedIn: false, 
      hasClockedOut: false,
      status: 'Not Marked'
    };
  } catch (error) {
    return { success: false, message: 'Error getting status: ' + error.toString() };
  }
}

/**
 * Get attendance records for a teacher
 */
function getAttendanceRecords(email, startDate, endDate) {
  try {
    const sheet = getSheet(CONFIG.SHEETS.ATTENDANCE);
    const data = sheet.getDataRange().getValues();
    const records = [];
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][2] === email) {
        const recordDate = data[i][1];
        if ((!startDate || recordDate >= startDate) && (!endDate || recordDate <= endDate)) {
          records.push({
            date: data[i][1],
            clockInTime: data[i][4],
            clockInLocation: data[i][5],
            clockOutTime: data[i][8],
            clockOutLocation: data[i][9],
            hoursWorked: data[i][12],
            status: data[i][13]
          });
        }
      }
    }
    
    return { success: true, records: records };
  } catch (error) {
    return { success: false, message: 'Error fetching records: ' + error.toString() };
  }
}

/**
 * Submit leave request
 */
function submitLeaveRequest(email, name, managerEmail, fromDate, toDate, reason) {
  try {
    const sheet = getSheet(CONFIG.SHEETS.LEAVES);
    const now = new Date();
    const timestamp = Utilities.formatDate(now, CONFIG.TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
    
    // Calculate number of days
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
    
    // Add leave request
    sheet.appendRow([
      timestamp,
      email,
      name,
      managerEmail,
      fromDate,
      toDate,
      days,
      reason,
      'Pending',
      '',
      ''
    ]);
    
    // Send email notification to manager
    try {
      MailApp.sendEmail({
        to: managerEmail,
        subject: 'Leave Request from ' + name,
        htmlBody: `
          <h3>New Leave Request</h3>
          <p><strong>Teacher:</strong> ${name} (${email})</p>
          <p><strong>From:</strong> ${fromDate}</p>
          <p><strong>To:</strong> ${toDate}</p>
          <p><strong>Days:</strong> ${days}</p>
          <p><strong>Reason:</strong> ${reason}</p>
          <p><strong>Status:</strong> Pending Approval</p>
          <p>Please login to the attendance system to approve or reject this request.</p>
        `
      });
    } catch (mailError) {
      // Continue even if email fails
      Logger.log('Email notification failed: ' + mailError.toString());
    }
    
    return { 
      success: true, 
      message: 'Leave request submitted successfully. Manager will be notified.',
      days: days
    };
  } catch (error) {
    return { success: false, message: 'Error submitting leave request: ' + error.toString() };
  }
}

/**
 * Get leave requests for a teacher
 */
function getLeaveRequests(email) {
  try {
    const sheet = getSheet(CONFIG.SHEETS.LEAVES);
    const data = sheet.getDataRange().getValues();
    const requests = [];
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][1] === email) {
        requests.push({
          timestamp: data[i][0],
          fromDate: data[i][4],
          toDate: data[i][5],
          days: data[i][6],
          reason: data[i][7],
          status: data[i][8],
          approvedBy: data[i][9],
          approvedDate: data[i][10]
        });
      }
    }
    
    return { success: true, requests: requests };
  } catch (error) {
    return { success: false, message: 'Error fetching leave requests: ' + error.toString() };
  }
}

/**
 * Get attendance statistics
 */
function getAttendanceStats(email) {
  try {
    const sheet = getSheet(CONFIG.SHEETS.ATTENDANCE);
    const data = sheet.getDataRange().getValues();
    
    let present = 0;
    let absent = 0;
    let totalHours = 0;
    let daysWithClockOut = 0;
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][2] === email) {
        const recordDate = new Date(data[i][1]);
        if (recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear) {
          if (data[i][13] === 'Present') {
            present++;
            if (data[i][12]) {
              totalHours += parseFloat(data[i][12]);
              daysWithClockOut++;
            }
          } else if (data[i][13] === 'Absent') {
            absent++;
          }
        }
      }
    }
    
    const avgHours = daysWithClockOut > 0 ? (totalHours / daysWithClockOut).toFixed(2) : '0.00';
    
    return {
      success: true,
      stats: {
        present: present,
        absent: absent,
        totalHours: totalHours.toFixed(2),
        avgHours: avgHours,
        month: Utilities.formatDate(now, CONFIG.TIMEZONE, 'MMMM yyyy')
      }
    };
  } catch (error) {
    return { success: false, message: 'Error calculating statistics: ' + error.toString() };
  }
}

/**
 * Auto-mark Sundays as Off (can be run as a daily trigger)
 */
function autoMarkSundaysOff() {
  try {
    const now = new Date();
    if (now.getDay() !== 0) {
      return { success: false, message: 'Today is not Sunday' };
    }
    
    const dateStr = Utilities.formatDate(now, CONFIG.TIMEZONE, 'yyyy-MM-dd');
    const teachersSheet = getSheet(CONFIG.SHEETS.TEACHERS);
    const attendanceSheet = getSheet(CONFIG.SHEETS.ATTENDANCE);
    
    const teachers = teachersSheet.getDataRange().getValues();
    const attendanceData = attendanceSheet.getDataRange().getValues();
    
    let marked = 0;
    
    for (let i = 1; i < teachers.length; i++) {
      const email = teachers[i][1];
      const name = teachers[i][0];
      
      // Check if already marked for today
      let alreadyMarked = false;
      for (let j = 1; j < attendanceData.length; j++) {
        if (attendanceData[j][2] === email && attendanceData[j][1] === dateStr) {
          alreadyMarked = true;
          break;
        }
      }
      
      if (!alreadyMarked && teachers[i][6] === 'Active') {
        attendanceSheet.appendRow([
          Utilities.formatDate(now, CONFIG.TIMEZONE, 'yyyy-MM-dd HH:mm:ss'),
          dateStr,
          email,
          name,
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          'Off'
        ]);
        marked++;
      }
    }
    
    return { success: true, message: `Marked ${marked} teachers as Off for Sunday` };
  } catch (error) {
    return { success: false, message: 'Error in auto-mark: ' + error.toString() };
  }
}
