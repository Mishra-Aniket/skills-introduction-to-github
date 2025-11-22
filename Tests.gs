/**
 * Test Suite for Clock-In/Clock-Out System
 * Run these tests in Google Apps Script editor to verify functionality
 */

/**
 * Run all tests
 */
function runAllTests() {
  Logger.log('=== Starting Test Suite ===');
  
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };
  
  // Initialize sheets for testing
  try {
    initializeSheets();
    logTest(results, 'Initialize Sheets', true);
  } catch (e) {
    logTest(results, 'Initialize Sheets', false, e.message);
    return results;
  }
  
  // Test user registration
  testUserRegistration(results);
  
  // Test session management
  testSessionManagement(results);
  
  // Test clock in/out
  testClockInOut(results);
  
  // Test session recovery
  testSessionRecovery(results);
  
  // Test fallback clock out
  testFallbackClockOut(results);
  
  // Test admin functions
  testAdminFunctions(results);
  
  // Print summary
  Logger.log('\n=== Test Summary ===');
  Logger.log('Passed: ' + results.passed);
  Logger.log('Failed: ' + results.failed);
  Logger.log('Total: ' + (results.passed + results.failed));
  
  if (results.failed > 0) {
    Logger.log('\nFailed tests:');
    results.tests.filter(function(t) { return !t.passed; }).forEach(function(t) {
      Logger.log('  - ' + t.name + ': ' + t.error);
    });
  }
  
  return results;
}

/**
 * Test user registration
 */
function testUserRegistration(results) {
  try {
    const testEmail = 'test_' + Date.now() + '@example.com';
    const user = registerUser('Test User', testEmail);
    
    if (user && user.userId && user.email === testEmail) {
      logTest(results, 'User Registration', true);
    } else {
      logTest(results, 'User Registration', false, 'Invalid user object returned');
    }
    
    // Test duplicate registration
    const user2 = registerUser('Test User', testEmail);
    if (user2.userId === user.userId) {
      logTest(results, 'Duplicate User Registration', true);
    } else {
      logTest(results, 'Duplicate User Registration', false, 'Should return existing user');
    }
  } catch (e) {
    logTest(results, 'User Registration', false, e.message);
  }
}

/**
 * Test session management
 */
function testSessionManagement(results) {
  try {
    // Create test user
    const testEmail = 'session_test_' + Date.now() + '@example.com';
    const user = registerUser('Session Test', testEmail);
    
    // Create session
    const token = createSession(user.userId, user.email);
    
    if (token && token.length > 0) {
      logTest(results, 'Create Session', true);
    } else {
      logTest(results, 'Create Session', false, 'No token returned');
      return;
    }
    
    // Validate session
    const session = validateSession(token);
    
    if (session && session.userId === user.userId) {
      logTest(results, 'Validate Session', true);
    } else {
      logTest(results, 'Validate Session', false, 'Session validation failed');
    }
    
    // Test invalid session
    const invalidSession = validateSession('invalid-token-12345');
    
    if (invalidSession === null) {
      logTest(results, 'Invalid Session Rejection', true);
    } else {
      logTest(results, 'Invalid Session Rejection', false, 'Should reject invalid token');
    }
    
  } catch (e) {
    logTest(results, 'Session Management', false, e.message);
  }
}

/**
 * Test clock in/out functionality
 */
function testClockInOut(results) {
  try {
    // Create test user and session
    const testEmail = 'clockinout_test_' + Date.now() + '@example.com';
    const user = registerUser('ClockInOut Test', testEmail);
    const token = createSession(user.userId, user.email);
    
    // Test clock in
    const clockInResult = clockIn(token);
    
    if (clockInResult.success) {
      logTest(results, 'Clock In', true);
    } else {
      logTest(results, 'Clock In', false, clockInResult.error);
      return;
    }
    
    // Test duplicate clock in (should fail)
    const duplicateClockIn = clockIn(token);
    
    if (!duplicateClockIn.success && duplicateClockIn.openSession) {
      logTest(results, 'Duplicate Clock In Prevention', true);
    } else {
      logTest(results, 'Duplicate Clock In Prevention', false, 'Should prevent duplicate clock in');
    }
    
    // Wait a moment for duration
    Utilities.sleep(2000);
    
    // Test clock out
    const clockOutResult = clockOut(token);
    
    if (clockOutResult.success && clockOutResult.duration) {
      logTest(results, 'Clock Out', true);
    } else {
      logTest(results, 'Clock Out', false, clockOutResult.error || 'No duration calculated');
    }
    
    // Test clock out without clock in (should fail)
    const invalidClockOut = clockOut(token);
    
    if (!invalidClockOut.success) {
      logTest(results, 'Clock Out Without Clock In', true);
    } else {
      logTest(results, 'Clock Out Without Clock In', false, 'Should fail without open clock in');
    }
    
  } catch (e) {
    logTest(results, 'Clock In/Out', false, e.message);
  }
}

/**
 * Test session recovery
 */
function testSessionRecovery(results) {
  try {
    // Create test user with open clock in
    const testEmail = 'recovery_test_' + Date.now() + '@example.com';
    const user = registerUser('Recovery Test', testEmail);
    const token = createSession(user.userId, user.email);
    
    // Clock in
    clockIn(token);
    
    // Recover session (simulate lost session)
    const recoveryResult = recoverSession(testEmail);
    
    if (recoveryResult.success && recoveryResult.hasOpenClockIn) {
      logTest(results, 'Session Recovery with Open Clock In', true);
    } else {
      logTest(results, 'Session Recovery with Open Clock In', false, 'Recovery failed or missing open clock in');
    }
    
    // Clean up - clock out
    clockOut(recoveryResult.sessionToken);
    
  } catch (e) {
    logTest(results, 'Session Recovery', false, e.message);
  }
}

/**
 * Test fallback clock out
 */
function testFallbackClockOut(results) {
  try {
    // Create test user with open clock in
    const testEmail = 'fallback_test_' + Date.now() + '@example.com';
    const user = registerUser('Fallback Test', testEmail);
    const token = createSession(user.userId, user.email);
    
    // Clock in
    clockIn(token);
    
    // Wait a moment
    Utilities.sleep(1000);
    
    // Use fallback clock out (simulate expired session)
    const fallbackResult = fallbackClockOut(testEmail);
    
    if (fallbackResult.success && fallbackResult.duration) {
      logTest(results, 'Fallback Clock Out', true);
    } else {
      logTest(results, 'Fallback Clock Out', false, fallbackResult.error || 'Missing duration');
    }
    
    // Test fallback with no open clock in
    const noOpenSession = fallbackClockOut(testEmail);
    
    if (!noOpenSession.success) {
      logTest(results, 'Fallback Clock Out Without Open Session', true);
    } else {
      logTest(results, 'Fallback Clock Out Without Open Session', false, 'Should fail without open session');
    }
    
  } catch (e) {
    logTest(results, 'Fallback Clock Out', false, e.message);
  }
}

/**
 * Test admin functions
 */
function testAdminFunctions(results) {
  try {
    // Test get all users
    const users = getAllUsers();
    
    if (Array.isArray(users)) {
      logTest(results, 'Get All Users', true);
    } else {
      logTest(results, 'Get All Users', false, 'Should return array');
    }
    
    // Test get system stats
    const stats = getSystemStats();
    
    if (stats && typeof stats.totalUsers === 'number') {
      logTest(results, 'Get System Stats', true);
    } else {
      logTest(results, 'Get System Stats', false, 'Invalid stats object');
    }
    
    // Test get open sessions
    const openSessions = getAllOpenSessions();
    
    if (Array.isArray(openSessions)) {
      logTest(results, 'Get All Open Sessions', true);
    } else {
      logTest(results, 'Get All Open Sessions', false, 'Should return array');
    }
    
    // Test attendance records
    const records = getAttendanceRecords();
    
    if (Array.isArray(records)) {
      logTest(results, 'Get Attendance Records', true);
    } else {
      logTest(results, 'Get Attendance Records', false, 'Should return array');
    }
    
  } catch (e) {
    logTest(results, 'Admin Functions', false, e.message);
  }
}

/**
 * Log test result
 */
function logTest(results, testName, passed, error) {
  const result = {
    name: testName,
    passed: passed,
    error: error || null
  };
  
  results.tests.push(result);
  
  if (passed) {
    results.passed++;
    Logger.log('✓ ' + testName);
  } else {
    results.failed++;
    Logger.log('✗ ' + testName + ': ' + error);
  }
}

/**
 * Clean up test data
 */
function cleanupTestData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Clean up test users
  const usersSheet = ss.getSheetByName(SHEET_NAME_USERS);
  const userData = usersSheet.getDataRange().getValues();
  
  for (let i = userData.length - 1; i >= 1; i--) {
    const email = userData[i][2];
    if (email.includes('test_') || email.includes('_test_')) {
      usersSheet.deleteRow(i + 1);
    }
  }
  
  // Clean up test sessions
  const sessionsSheet = ss.getSheetByName(SHEET_NAME_SESSIONS);
  const sessionData = sessionsSheet.getDataRange().getValues();
  
  for (let i = sessionData.length - 1; i >= 1; i--) {
    const email = sessionData[i][2];
    if (email.includes('test_') || email.includes('_test_')) {
      sessionsSheet.deleteRow(i + 1);
    }
  }
  
  // Clean up test attendance
  const attendanceSheet = ss.getSheetByName(SHEET_NAME_ATTENDANCE);
  const attendanceData = attendanceSheet.getDataRange().getValues();
  
  for (let i = attendanceData.length - 1; i >= 1; i--) {
    const email = attendanceData[i][2];
    if (email.includes('test_') || email.includes('_test_')) {
      attendanceSheet.deleteRow(i + 1);
    }
  }
  
  Logger.log('Test data cleaned up');
}

/**
 * Quick test - run a single test scenario
 */
function quickTest() {
  Logger.log('=== Quick Test ===');
  
  initializeSheets();
  
  const testEmail = 'quicktest_' + Date.now() + '@example.com';
  
  // Login
  const loginResult = login(testEmail, 'Quick Test User');
  Logger.log('Login: ' + (loginResult.success ? 'SUCCESS' : 'FAILED'));
  
  if (!loginResult.success) return;
  
  const token = loginResult.sessionToken;
  
  // Clock in
  const clockInResult = clockIn(token);
  Logger.log('Clock In: ' + (clockInResult.success ? 'SUCCESS' : 'FAILED'));
  
  // Wait
  Utilities.sleep(2000);
  
  // Clock out
  const clockOutResult = clockOut(token);
  Logger.log('Clock Out: ' + (clockOutResult.success ? 'SUCCESS' : 'FAILED'));
  Logger.log('Duration: ' + (clockOutResult.duration || 'N/A') + ' hours');
  
  // Test recovery
  const recoveryResult = recoverSession(testEmail);
  Logger.log('Recovery: ' + (recoveryResult.success ? 'SUCCESS' : 'FAILED'));
  
  Logger.log('=== Quick Test Complete ===');
}
