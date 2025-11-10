/**
 * Clock-In/Clock-Out System with Session Persistence
 * Handles user attendance tracking with robust session management
 */

// Configuration
const SESSION_DURATION_DAYS = 30;
const SHEET_NAME_ATTENDANCE = 'Attendance';
const SHEET_NAME_SESSIONS = 'Sessions';
const SHEET_NAME_USERS = 'Users';

/**
 * Initialize the Google Sheets structure
 */
function initializeSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Create Attendance sheet
  let attendanceSheet = ss.getSheetByName(SHEET_NAME_ATTENDANCE);
  if (!attendanceSheet) {
    attendanceSheet = ss.insertSheet(SHEET_NAME_ATTENDANCE);
    attendanceSheet.getRange('A1:H1').setValues([[
      'User ID', 'Name', 'Email', 'Clock In Time', 'Clock Out Time', 
      'Date', 'Duration (hours)', 'Status'
    ]]);
    attendanceSheet.getRange('A1:H1').setFontWeight('bold');
  }
  
  // Create Sessions sheet
  let sessionsSheet = ss.getSheetByName(SHEET_NAME_SESSIONS);
  if (!sessionsSheet) {
    sessionsSheet = ss.insertSheet(SHEET_NAME_SESSIONS);
    sessionsSheet.getRange('A1:G1').setValues([[
      'Session Token', 'User ID', 'Email', 'Created At', 
      'Expires At', 'Last Access', 'Active'
    ]]);
    sessionsSheet.getRange('A1:G1').setFontWeight('bold');
  }
  
  // Create Users sheet
  let usersSheet = ss.getSheetByName(SHEET_NAME_USERS);
  if (!usersSheet) {
    usersSheet = ss.insertSheet(SHEET_NAME_USERS);
    usersSheet.getRange('A1:E1').setValues([[
      'User ID', 'Name', 'Email', 'Created At', 'Active'
    ]]);
    usersSheet.getRange('A1:E1').setFontWeight('bold');
  }
}

/**
 * Generate a unique session token
 */
function generateSessionToken() {
  return Utilities.getUuid();
}

/**
 * Create a new session for a user
 */
function createSession(userId, email) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sessionsSheet = ss.getSheetByName(SHEET_NAME_SESSIONS);
  
  const token = generateSessionToken();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + (SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000));
  
  sessionsSheet.appendRow([
    token,
    userId,
    email,
    now,
    expiresAt,
    now,
    true
  ]);
  
  return token;
}

/**
 * Validate and refresh a session
 */
function validateSession(sessionToken) {
  if (!sessionToken) return null;
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sessionsSheet = ss.getSheetByName(SHEET_NAME_SESSIONS);
  const data = sessionsSheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === sessionToken) {
      const expiresAt = new Date(data[i][4]);
      const isActive = data[i][6];
      
      if (isActive && expiresAt > new Date()) {
        // Update last access time
        sessionsSheet.getRange(i + 1, 6).setValue(new Date());
        
        return {
          userId: data[i][1],
          email: data[i][2]
        };
      }
    }
  }
  
  return null;
}

/**
 * Get user information
 */
function getUser(email) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const usersSheet = ss.getSheetByName(SHEET_NAME_USERS);
  const data = usersSheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][2] === email && data[i][4]) { // Check email and active status
      return {
        userId: data[i][0],
        name: data[i][1],
        email: data[i][2]
      };
    }
  }
  
  return null;
}

/**
 * Register a new user
 */
function registerUser(name, email) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const usersSheet = ss.getSheetByName(SHEET_NAME_USERS);
  
  // Check if user already exists
  const existingUser = getUser(email);
  if (existingUser) {
    return existingUser;
  }
  
  const userId = Utilities.getUuid();
  const now = new Date();
  
  usersSheet.appendRow([
    userId,
    name,
    email,
    now,
    true
  ]);
  
  return {
    userId: userId,
    name: name,
    email: email
  };
}

/**
 * Check for open clock-in session for a user
 */
function getOpenClockIn(userId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const attendanceSheet = ss.getSheetByName(SHEET_NAME_ATTENDANCE);
  const data = attendanceSheet.getDataRange().getValues();
  
  // Start from the end to find the most recent open session
  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][0] === userId && !data[i][4]) { // User ID matches and no clock-out time
      return {
        rowIndex: i + 1,
        clockInTime: data[i][3],
        date: data[i][5]
      };
    }
  }
  
  return null;
}

/**
 * Clock in a user
 */
function clockIn(sessionToken) {
  const session = validateSession(sessionToken);
  if (!session) {
    return { success: false, error: 'Invalid or expired session' };
  }
  
  // Check for existing open clock-in
  const openClockIn = getOpenClockIn(session.userId);
  if (openClockIn) {
    return { 
      success: false, 
      error: 'You already have an open clock-in session',
      openSession: openClockIn
    };
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const attendanceSheet = ss.getSheetByName(SHEET_NAME_ATTENDANCE);
  const usersSheet = ss.getSheetByName(SHEET_NAME_USERS);
  
  // Get user name
  const userData = usersSheet.getDataRange().getValues();
  let userName = '';
  for (let i = 1; i < userData.length; i++) {
    if (userData[i][0] === session.userId) {
      userName = userData[i][1];
      break;
    }
  }
  
  const now = new Date();
  const dateStr = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  
  attendanceSheet.appendRow([
    session.userId,
    userName,
    session.email,
    now,
    '', // Clock out time (empty)
    dateStr,
    '', // Duration (empty)
    'Clocked In'
  ]);
  
  return { 
    success: true, 
    message: 'Clocked in successfully',
    clockInTime: now
  };
}

/**
 * Clock out a user
 */
function clockOut(sessionToken) {
  const session = validateSession(sessionToken);
  if (!session) {
    return { success: false, error: 'Invalid or expired session' };
  }
  
  const openClockIn = getOpenClockIn(session.userId);
  if (!openClockIn) {
    return { 
      success: false, 
      error: 'No open clock-in session found' 
    };
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const attendanceSheet = ss.getSheetByName(SHEET_NAME_ATTENDANCE);
  
  const now = new Date();
  const clockInTime = new Date(openClockIn.clockInTime);
  const durationMs = now.getTime() - clockInTime.getTime();
  const durationHours = (durationMs / (1000 * 60 * 60)).toFixed(2);
  
  // Update the row
  attendanceSheet.getRange(openClockIn.rowIndex, 5).setValue(now); // Clock out time
  attendanceSheet.getRange(openClockIn.rowIndex, 7).setValue(durationHours); // Duration
  attendanceSheet.getRange(openClockIn.rowIndex, 8).setValue('Clocked Out'); // Status
  
  return { 
    success: true, 
    message: 'Clocked out successfully',
    clockOutTime: now,
    duration: durationHours
  };
}

/**
 * Fallback clock out without session - uses email verification
 */
function fallbackClockOut(email) {
  const user = getUser(email);
  if (!user) {
    return { success: false, error: 'User not found' };
  }
  
  const openClockIn = getOpenClockIn(user.userId);
  if (!openClockIn) {
    return { 
      success: false, 
      error: 'No open clock-in session found' 
    };
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const attendanceSheet = ss.getSheetByName(SHEET_NAME_ATTENDANCE);
  
  const now = new Date();
  const clockInTime = new Date(openClockIn.clockInTime);
  const durationMs = now.getTime() - clockInTime.getTime();
  const durationHours = (durationMs / (1000 * 60 * 60)).toFixed(2);
  
  // Update the row
  attendanceSheet.getRange(openClockIn.rowIndex, 5).setValue(now);
  attendanceSheet.getRange(openClockIn.rowIndex, 7).setValue(durationHours);
  attendanceSheet.getRange(openClockIn.rowIndex, 8).setValue('Clocked Out (Fallback)');
  
  return { 
    success: true, 
    message: 'Clocked out successfully using fallback',
    clockOutTime: now,
    duration: durationHours
  };
}

/**
 * Get user status (whether they have an open clock-in)
 */
function getUserStatus(sessionToken) {
  const session = validateSession(sessionToken);
  if (!session) {
    return { success: false, error: 'Invalid or expired session' };
  }
  
  const openClockIn = getOpenClockIn(session.userId);
  
  return {
    success: true,
    hasOpenClockIn: !!openClockIn,
    openClockIn: openClockIn,
    user: session
  };
}

/**
 * Login user and create session
 */
function login(email, name) {
  // Register or get user
  const user = registerUser(name, email);
  
  // Create session
  const sessionToken = createSession(user.userId, user.email);
  
  return {
    success: true,
    sessionToken: sessionToken,
    user: user
  };
}

/**
 * Recover session - check for open clock-in by email
 */
function recoverSession(email) {
  const user = getUser(email);
  if (!user) {
    return { success: false, error: 'User not found' };
  }
  
  const openClockIn = getOpenClockIn(user.userId);
  
  // Create a new session regardless of open clock-in
  const sessionToken = createSession(user.userId, user.email);
  
  return {
    success: true,
    sessionToken: sessionToken,
    user: user,
    hasOpenClockIn: !!openClockIn,
    openClockIn: openClockIn
  };
}

/**
 * Logout user (deactivate session)
 */
function logout(sessionToken) {
  if (!sessionToken) return { success: false };
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sessionsSheet = ss.getSheetByName(SHEET_NAME_SESSIONS);
  const data = sessionsSheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === sessionToken) {
      sessionsSheet.getRange(i + 1, 7).setValue(false); // Set active to false
      return { success: true };
    }
  }
  
  return { success: false };
}

/**
 * Web app entry point
 */
function doGet(e) {
  const page = e.parameter.page || 'index';
  
  // Initialize sheets if needed
  try {
    initializeSheets();
  } catch (error) {
    Logger.log('Error initializing sheets: ' + error);
  }
  
  if (page === 'leave') {
    return HtmlService.createHtmlOutputFromFile('leave')
      .setTitle('Leave Management')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Clock In/Out System')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Include HTML files
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
