// Variables and Constants
const GEO_FENCE = { latitude: XX.XXXXX, longitude: YY.YYYYY }; // Define geofence
const HOLIDAYS = ["2025-12-25", "2025-01-01"]; // Define holidays
const EMAIL_NOTIFICATIONS = true; // Toggle email notifications
const MANDATORY_LOCATION = true; // Enforce location capture for clock in/out

// Spreadsheet configuration
const SHEET_NAME = 'Attendance';

/**
 * Serves the HTML web app
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('ASK Attendance System')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Get or create the attendance spreadsheet
 */
function getAttendanceSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Set up headers
    const headers = [
      'Timestamp',
      'User ID', 
      'Action',
      'Latitude',
      'Longitude',
      'Accuracy (m)',
      'Address',
      'Status'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  
  return sheet;
}

// Session Management
function login(userId) {
    // User authentication logic here
    logEvent({ type: 'login', userId: userId, timestamp: new Date() });
}

function logout(sessionId) {
    // User logout logic here
    logEvent({ type: 'logout', sessionId: sessionId, timestamp: new Date() });
}

// Clock In/Out Functionality
/**
 * Clock In function with mandatory location validation
 * @param {Object} data - Clock in data containing userId and location information
 * @returns {Object} Result object with success status and details
 */
function clockIn(data) {
  try {
    // Strict validation: Check if location is mandatory and validate coordinates
    if (MANDATORY_LOCATION) {
      if (!data || typeof data !== 'object') {
        return {
          success: false,
          error: 'Invalid data format. Location data is required.'
        };
      }
      
      if (!data.latitude || !data.longitude) {
        return {
          success: false,
          error: 'Location is mandatory. Please enable location access and try again.'
        };
      }
      
      // Validate that coordinates are numbers and within valid ranges
      const lat = parseFloat(data.latitude);
      const lng = parseFloat(data.longitude);
      
      if (isNaN(lat) || isNaN(lng)) {
        return {
          success: false,
          error: 'Invalid location coordinates. Please refresh location and try again.'
        };
      }
      
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return {
          success: false,
          error: 'Location coordinates out of valid range.'
        };
      }
    }
    
    // Get the attendance sheet
    const sheet = getAttendanceSheet();
    
    // Prepare the row data
    const timestamp = new Date();
    const rowData = [
      timestamp,
      data.userId || 'unknown',
      'Clock In',
      data.latitude || '',
      data.longitude || '',
      data.accuracy || '',
      data.address || '',
      'Completed'
    ];
    
    // Append to sheet
    sheet.appendRow(rowData);
    
    // Log the event
    logEvent({
      type: 'clockIn',
      userId: data.userId,
      timestamp: timestamp,
      location: {
        lat: data.latitude,
        lng: data.longitude,
        address: data.address
      }
    });
    
    // Send email notification if enabled
    if (EMAIL_NOTIFICATIONS) {
      sendEmailNotification(
        'admin@example.com',
        'Clock In Notification',
        `User ${data.userId} clocked in at ${timestamp.toLocaleString()}\nLocation: ${data.address || 'N/A'}`
      );
    }
    
    return {
      success: true,
      timestamp: timestamp.toISOString(),
      message: 'Clock in recorded successfully'
    };
    
  } catch (error) {
    Logger.log('Clock In Error: ' + error.toString());
    return {
      success: false,
      error: 'Failed to record clock in: ' + error.message
    };
  }
}

/**
 * Clock Out function with mandatory location validation
 * @param {Object} data - Clock out data containing userId and location information
 * @returns {Object} Result object with success status and details
 */
function clockOut(data) {
  try {
    // Strict validation: Check if location is mandatory and validate coordinates
    if (MANDATORY_LOCATION) {
      if (!data || typeof data !== 'object') {
        return {
          success: false,
          error: 'Invalid data format. Location data is required.'
        };
      }
      
      if (!data.latitude || !data.longitude) {
        return {
          success: false,
          error: 'Location is mandatory. Please enable location access and try again.'
        };
      }
      
      // Validate that coordinates are numbers and within valid ranges
      const lat = parseFloat(data.latitude);
      const lng = parseFloat(data.longitude);
      
      if (isNaN(lat) || isNaN(lng)) {
        return {
          success: false,
          error: 'Invalid location coordinates. Please refresh location and try again.'
        };
      }
      
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return {
          success: false,
          error: 'Location coordinates out of valid range.'
        };
      }
    }
    
    // Get the attendance sheet
    const sheet = getAttendanceSheet();
    
    // Prepare the row data
    const timestamp = new Date();
    const rowData = [
      timestamp,
      data.userId || 'unknown',
      'Clock Out',
      data.latitude || '',
      data.longitude || '',
      data.accuracy || '',
      data.address || '',
      'Completed'
    ];
    
    // Append to sheet
    sheet.appendRow(rowData);
    
    // Log the event
    logEvent({
      type: 'clockOut',
      userId: data.userId,
      timestamp: timestamp,
      location: {
        lat: data.latitude,
        lng: data.longitude,
        address: data.address
      }
    });
    
    // Send email notification if enabled
    if (EMAIL_NOTIFICATIONS) {
      sendEmailNotification(
        'admin@example.com',
        'Clock Out Notification',
        `User ${data.userId} clocked out at ${timestamp.toLocaleString()}\nLocation: ${data.address || 'N/A'}`
      );
    }
    
    return {
      success: true,
      timestamp: timestamp.toISOString(),
      message: 'Clock out recorded successfully'
    };
    
  } catch (error) {
    Logger.log('Clock Out Error: ' + error.toString());
    return {
      success: false,
      error: 'Failed to record clock out: ' + error.message
    };
  }
}

// Leave Requests
function requestLeave(userId, leaveType, startDate, endDate) {
    // Handle leave requests logic
    logEvent({ 
      type: 'leaveRequest', 
      userId: userId, 
      leaveType: leaveType, 
      startDate: startDate, 
      endDate: endDate,
      timestamp: new Date() 
    });
}

// Admin Registration
function registerAdmin(adminId, adminDetails) {
    // Logic for registering an admin user
    logEvent({ type: 'adminRegistration', adminId: adminId, timestamp: new Date() });
}

// PWA Support and Offline Capability
function registerServiceWorker() {
    // Logic for service worker registration
    return { success: true, message: 'Service worker registration placeholder' };
}

// Geofencing
function checkGeofence(userLocation) {
    // Check if user location is within allowed geofenced area
    if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
      return { withinFence: false, message: 'Invalid location data' };
    }
    
    // Calculate distance from geofence center (simplified)
    // In production, use proper geofencing algorithms
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      GEO_FENCE.latitude,
      GEO_FENCE.longitude
    );
    
    // Example: 100 meter radius
    const isWithinFence = distance <= 100;
    
    return {
      withinFence: isWithinFence,
      distance: distance,
      message: isWithinFence ? 'Within allowed area' : 'Outside allowed area'
    };
}

// Holiday Exemptions
function isHoliday(date) {
    // Check if a given date is a holiday
    const dateStr = Utilities.formatDate(new Date(date), Session.getScriptTimeZone(), 'yyyy-MM-dd');
    return HOLIDAYS.includes(dateStr);
}

// Email Notifications
function sendEmailNotification(to, subject, message) {
    if (EMAIL_NOTIFICATIONS) {
        try {
          // In production, this would send actual emails
          // MailApp.sendEmail(to, subject, message);
          Logger.log(`Email would be sent to ${to}: ${subject}`);
          return { success: true, message: 'Email notification sent' };
        } catch (error) {
          Logger.log('Email Error: ' + error.toString());
          return { success: false, error: error.message };
        }
    }
    return { success: false, message: 'Email notifications disabled' };
}

// Utility Functions
function logEvent(event) {
    // General logging utility
    try {
      Logger.log('Event: ' + JSON.stringify(event));
      
      // Optionally store in a separate log sheet
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      let logSheet = ss.getSheetByName('EventLog');
      
      if (!logSheet) {
        logSheet = ss.insertSheet('EventLog');
        logSheet.getRange(1, 1, 1, 3).setValues([['Timestamp', 'Event Type', 'Details']]);
        logSheet.getRange(1, 1, 1, 3).setFontWeight('bold');
      }
      
      logSheet.appendRow([
        new Date(),
        event.type || 'unknown',
        JSON.stringify(event)
      ]);
    } catch (error) {
      Logger.log('Logging Error: ' + error.toString());
    }
}

function formatDate(date) {
    // Utility to format date
    return Utilities.formatDate(new Date(date), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in meters
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Main Entry Point (if needed)
function main() {
    // Example function calls or logic to control flow
    logEvent({ type: 'main', message: 'Application initialized', timestamp: new Date() });
}