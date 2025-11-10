# Clock-In/Clock-Out System with Session Persistence

A robust attendance tracking system built with Google Apps Script that maintains session persistence across browser closures, phone restarts, and token expiration.

## Features

### Core Functionality
- ✅ **Clock In/Clock Out**: Simple, intuitive attendance tracking
- ✅ **Session Persistence**: Sessions persist for 30+ days
- ✅ **Auto-Save Sessions**: Automatic session token storage (always enabled, not dependent on "Remember Me")
- ✅ **Session Recovery**: Recover sessions after browser close or phone restart
- ✅ **Fallback Clock-Out**: Clock out without re-login if open session exists
- ✅ **Mobile & Desktop Support**: Fully responsive design
- ✅ **Leave Management**: Request and track leave applications

### Advanced Features
- 🔒 **Secure Session Management**: Token-based authentication with expiration
- 🔄 **Open Row Detection**: Automatically detects unclosed clock-in sessions
- 💾 **Server-Side Backup**: All data stored in Google Sheets
- 🎨 **Modern UI**: Clean, professional interface with gradient design
- 📱 **Progressive Web App Ready**: Works offline after initial load
- 🛡️ **Error Handling**: Graceful degradation and comprehensive error messages

## Installation

### 1. Create a New Google Apps Script Project

1. Go to [Google Apps Script](https://script.google.com/)
2. Click "New Project"
3. Name your project (e.g., "Clock In Out System")

### 2. Add the Script Files

Create the following files in your Google Apps Script project:

#### code.gs
Copy the contents of `code.gs` from this repository.

#### AdminRegistration.gs
Copy the contents of `AdminRegistration.gs` from this repository.

### 3. Add the HTML Files

Create the following HTML files in your Google Apps Script project:

#### index.html
Copy the contents of `index.html` from this repository.

#### leave.html
Copy the contents of `leave.html` from this repository.

### 4. Create Google Sheets

The system will automatically create three sheets when first initialized:

- **Attendance**: Stores clock-in/clock-out records
- **Sessions**: Manages user session tokens
- **Users**: User registration data

### 5. Deploy as Web App

1. Click "Deploy" > "New deployment"
2. Select "Web app" as the deployment type
3. Set the following:
   - **Execute as**: Me
   - **Who has access**: Anyone (or your preferred setting)
4. Click "Deploy"
5. Copy the web app URL

## Usage

### For End Users

#### First Time Login
1. Open the web app URL
2. Enter your full name and email address
3. Click "Login"
4. Your session is automatically saved

#### Clock In
1. Login to the system
2. Click the "Clock In" button
3. You'll receive a confirmation with the clock-in time

#### Clock Out
1. Return to the system (session is automatically recovered)
2. Click the "Clock Out" button
3. You'll see your total work duration

#### Session Recovery After Browser Close
1. Open the web app URL
2. Your session is automatically restored from localStorage
3. If the session is expired but you have an open clock-in:
   - Enter your email
   - Click "Recover Session"
   - You can now clock out without re-authenticating

#### Leave Management
1. Click the "Leave Management" tab
2. Select leave type, dates, and enter reason
3. Submit the request
4. View your leave history below the form

### For Administrators

#### Access Admin Functions
Administrators can use the following functions via the Apps Script editor:

```javascript
// Get all users
getAllUsers()

// Get attendance records
getAttendanceRecords(startDate, endDate, userId)

// Get user summary
getUserAttendanceSummary(userId, month, year)

// Force clock out a user
forceClockOut(userId)

// Get all open sessions
getAllOpenSessions()

// Generate report
generateAttendanceReport(startDate, endDate)

// Cleanup expired sessions
cleanupExpiredSessions()

// Backup data
backupData()

// Get system statistics
getSystemStats()
```

#### Configure Admin Access
Edit the `AdminRegistration.gs` file:

```javascript
const ADMIN_EMAILS = ['admin@example.com', 'another-admin@example.com'];
```

## Architecture

### Session Management Flow

```
User Login → Create Session Token → Save to localStorage
                                  → Save to Sessions Sheet
                                  → Set 30-day expiration

Browser Close → localStorage persists

Browser Reopen → Read localStorage
              → Validate with server
              → Restore session

Token Expired → Check for open clock-in
             → Offer fallback clock-out
             → OR re-authenticate
```

### Data Structure

#### Attendance Sheet
| User ID | Name | Email | Clock In Time | Clock Out Time | Date | Duration | Status |
|---------|------|-------|---------------|----------------|------|----------|--------|

#### Sessions Sheet
| Session Token | User ID | Email | Created At | Expires At | Last Access | Active |
|---------------|---------|-------|------------|------------|-------------|--------|

#### Users Sheet
| User ID | Name | Email | Created At | Active |
|---------|------|-------|------------|--------|

## Session Persistence Details

### 30+ Day Persistence
- Sessions are stored in Google Sheets with a 30-day expiration
- `expiresAt` timestamp is checked on each request
- Sessions can be extended by updating the `lastAccess` field

### Auto-Save Implementation
- Session tokens are **always** saved to localStorage (not conditional)
- No "Remember Me" checkbox needed
- Tokens persist across:
  - Browser restarts
  - Phone restarts
  - Tab closures
  - System reboots

### Recovery Mechanisms

#### Level 1: Automatic Recovery
- localStorage token is valid
- Server validates and extends session
- User continues seamlessly

#### Level 2: Session Recovery
- localStorage token expired
- User provides email
- System creates new session
- Preserves open clock-in state

#### Level 3: Fallback Clock-Out
- No valid session
- Open clock-in detected by email
- Allow clock-out without full re-authentication
- User can complete their work record

## Mobile Optimization

The system is fully optimized for mobile devices:

- ✅ Responsive layout adapts to screen size
- ✅ Touch-friendly buttons and inputs
- ✅ Mobile-first design principles
- ✅ Works on iOS and Android
- ✅ Survives app backgrounding
- ✅ Handles phone restarts

## Security Features

### Token Security
- UUIDs used for session tokens (cryptographically random)
- Tokens validated on every request
- Expired tokens automatically rejected
- Sessions can be manually revoked

### Data Protection
- All data stored in Google Sheets (leverages Google's security)
- Session expiration enforced server-side
- User email validation
- Active/inactive user status

### Best Practices
- Never expose session tokens in URLs
- Use HTTPS (automatic with Google Apps Script)
- Regular cleanup of expired sessions
- Admin-only functions for sensitive operations

## Troubleshooting

### "Session expired" message
- Clear browser localStorage
- Login again to create a new session
- Check if your account is active

### Can't clock out after phone restart
1. Open the app
2. Click "Recover Session"
3. Enter your email
4. Session will be recovered with open clock-in preserved

### Lost session but need to clock out
1. Click "Recover Session" on login screen
2. Enter your email address
3. System will detect open clock-in
4. Clock out without re-authenticating

### Session not persisting
- Check if localStorage is enabled in browser
- Check if cookies/storage is cleared on browser close
- Try a different browser

## Maintenance

### Automated Cleanup
The system includes automated cleanup of expired sessions:

```javascript
setupAutomatedCleanup() // Run once to schedule daily cleanup
```

This will create a time-based trigger that runs daily at 2 AM.

### Manual Backup
Administrators can create manual backups:

```javascript
backupData() // Creates timestamped backup sheets
```

### Monitoring
Check system health:

```javascript
getSystemStats() // Returns user counts, session counts, open clock-ins
```

## API Reference

### Client-Side Functions (Available in HTML)

#### login(email, name)
Creates a new user session.

#### recoverSession(email)
Recovers a session for an existing user.

#### clockIn(sessionToken)
Records a clock-in time.

#### clockOut(sessionToken)
Records a clock-out time and calculates duration.

#### fallbackClockOut(email)
Allows clock-out without valid session if open clock-in exists.

#### getUserStatus(sessionToken)
Returns current user status and open clock-in state.

#### logout(sessionToken)
Deactivates the current session.

### Server-Side Functions (Apps Script)

See `code.gs` and `AdminRegistration.gs` for complete function documentation.

## Browser Compatibility

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)
- ✅ Samsung Internet

## Future Enhancements

Potential features for future releases:

- [ ] Push notifications for clock-in reminders
- [ ] Geolocation-based clock-in
- [ ] Photo capture on clock-in
- [ ] Integration with calendar systems
- [ ] Advanced reporting and analytics
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Export to PDF/Excel

## License

This project is provided as-is for educational and commercial use.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the code comments
3. Test in Apps Script debugger
4. Check Google Apps Script quotas

## Credits

Built with:
- Google Apps Script
- Google Sheets
- Vanilla JavaScript
- CSS3 Gradients and Animations
