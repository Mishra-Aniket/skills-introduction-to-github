# PhysicsWallah Attendance System - Configuration Guide

This document explains all configurable options in the attendance system.

## Configuration File: Code.gs

All main configurations are in the `CONFIG` object at the top of `Code.gs`.

### 1. Spreadsheet Configuration

```javascript
const CONFIG = {
  SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID_HERE',
  // ...
};
```

**SPREADSHEET_ID**: The unique identifier of your Google Sheet
- **Required**: Yes
- **Format**: String (41 characters)
- **Example**: `'1a2b3c4d5e6f7g8h9i0jk1l2m3n4o5p6q7r8s9t0u1v2'`
- **How to find**: In your Google Sheet URL between `/d/` and `/edit`
- **Update after**: Creating your Google Sheet

### 2. Sheet Names Configuration

```javascript
SHEETS: {
  TEACHERS: 'Teachers',
  ATTENDANCE: 'Attendance Log',
  LEAVES: 'Leave Requests',
  CENTERS: 'Centers'
}
```

**Sheet Names**: Names of the sheets in your spreadsheet
- **Required**: Yes (must match exactly)
- **Case Sensitive**: Yes
- **Customizable**: Yes, but update both Code.gs and sheet names
- **Default Values**: As shown above
- **Note**: Changing these requires updating both code and Google Sheet

### 3. Timezone Configuration

```javascript
TIMEZONE: 'Asia/Kolkata'
```

**TIMEZONE**: Timezone for date/time operations
- **Required**: Yes
- **Format**: IANA timezone identifier
- **Default**: `'Asia/Kolkata'` (Indian Standard Time)
- **Examples**: 
  - `'America/New_York'` (Eastern Time)
  - `'Europe/London'` (GMT/BST)
  - `'Asia/Dubai'` (Gulf Standard Time)
  - `'Australia/Sydney'` (Australian Eastern Time)
- **Full List**: [IANA Timezone Database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

### How to Change Timezone:

1. Open `Code.gs` in Apps Script editor
2. Find line ~20: `TIMEZONE: 'Asia/Kolkata'`
3. Replace with your timezone
4. Save the file
5. Redeploy if already deployed

## Frontend Configuration: index.html

### 1. Brand Colors

Located in the `:root` CSS variables (around line 19):

```css
:root {
  --primary-color: #2563eb;      /* Primary blue - buttons, links */
  --primary-dark: #1e40af;       /* Darker blue - hover states */
  --secondary-color: #10b981;    /* Green - success messages */
  --danger-color: #ef4444;       /* Red - errors, clock out */
  --warning-color: #f59e0b;      /* Orange - warnings */
  --dark-bg: #1f2937;            /* Dark background */
  --light-bg: #f9fafb;           /* Light background */
  --card-bg: #ffffff;            /* Card background */
  --text-primary: #111827;       /* Primary text color */
  --text-secondary: #6b7280;     /* Secondary text color */
  --border-color: #e5e7eb;       /* Border color */
  --success-bg: #d1fae5;         /* Success background */
  --success-text: #065f46;       /* Success text */
  --error-bg: #fee2e2;           /* Error background */
  --error-text: #991b1b;         /* Error text */
}
```

### 2. Organization Branding

**Logo Text** (line ~113):
```html
<div class="logo">PhysicsWallah</div>
```
- Replace "PhysicsWallah" with your organization name

**Page Title** (line ~4):
```html
<title>PhysicsWallah - Attendance System</title>
```

**Login Header** (line ~538):
```html
<div class="login-logo">PhysicsWallah</div>
```

**Favicon** (in Code.gs, line ~31):
```javascript
.setFaviconUrl('https://www.pw.live/favicon.ico')
```
- Update with your organization's favicon URL

### 3. Gradient Colors

**Header Gradient** (line ~35):
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

**Clock Card Gradient** (line ~150):
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

**Stat Cards Gradient** (line ~458):
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

To customize gradients, replace with your colors:
```css
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
```

### 4. Clock Format

**Time Format** (line ~849):
```javascript
const timeStr = now.toLocaleTimeString('en-IN', { 
  hour12: false,  // Change to true for 12-hour format
  hour: '2-digit', 
  minute: '2-digit', 
  second: '2-digit' 
});
```

**Date Format** (line ~854):
```javascript
const dateStr = now.toLocaleDateString('en-IN', { 
  year: 'numeric', 
  month: 'long',      // Can be 'short', 'numeric', '2-digit'
  day: 'numeric' 
});
```

## Database Configuration

### 1. Geofence Radius

Configure in the **Centers** sheet:

| Center Name | Latitude | Longitude | Radius (meters) | Address | Status |
|-------------|----------|-----------|-----------------|---------|--------|
| Delhi Center | 28.7041 | 77.1025 | **100** | Address | Active |

**Radius Values**:
- **Small office**: 50-100 meters (strict)
- **Medium campus**: 100-200 meters (normal)
- **Large campus**: 200-500 meters (flexible)
- **Work from anywhere**: 1000+ meters (lenient)

**Recommendation**: Start with 100 meters and adjust based on accuracy needs.

### 2. Sample Centers

Edit the **Centers** sheet to add your locations:

**How to get coordinates**:
1. Open Google Maps
2. Search for your office address
3. Right-click on the location
4. Click on the coordinates to copy
5. Paste in Centers sheet

**Example Centers**:
```
Center Name         | Latitude | Longitude | Radius | Address                    | Status
Delhi Office        | 28.7041  | 77.1025   | 100    | CP, New Delhi             | Active
Mumbai Office       | 19.0760  | 72.8777   | 150    | BKC, Mumbai               | Active
Bangalore Office    | 12.9716  | 77.5946   | 100    | Koramangala, Bangalore    | Active
```

### 3. Teacher Accounts

Configure in the **Teachers** sheet:

**Required Fields**:
- **Name**: Full name of teacher
- **Email**: Unique email address (used for login)
- **Phone**: Contact number
- **Password**: Login password (implement hashing for production!)
- **Center**: Assigned center (must match Centers sheet)
- **Manager Email**: For leave approvals
- **Status**: Active or Inactive
- **Created Date**: Account creation date

**Sample Data**:
```
Name          | Email              | Phone          | Password  | Center       | Manager Email      | Status | Created Date
Rahul Sharma  | rahul@pw.live     | +91 9876543210 | secure123 | Delhi Center | manager@pw.live   | Active | 2024-01-15
Priya Gupta   | priya@pw.live     | +91 9876543211 | secure456 | Mumbai Office| manager@pw.live   | Active | 2024-01-16
```

## Email Configuration

### 1. Manager Email Setup

Configured per teacher in the **Teachers** sheet.

**Purpose**: Receives leave request notifications

**Format**: Valid email address

**Example**: `manager@pw.live`

### 2. Email Template Customization

In `Code.gs`, function `submitLeaveRequest()` (around line 486):

```javascript
MailApp.sendEmail({
  to: managerEmail,
  subject: 'Leave Request from ' + name,  // Customize subject
  htmlBody: `
    <h3>New Leave Request</h3>
    <p><strong>Teacher:</strong> ${name} (${email})</p>
    <p><strong>From:</strong> ${fromDate}</p>
    <p><strong>To:</strong> ${toDate}</p>
    <p><strong>Days:</strong> ${days}</p>
    <p><strong>Reason:</strong> ${reason}</p>
    <p><strong>Status:</strong> Pending Approval</p>
    <p>Please login to the attendance system to approve or reject this request.</p>
  `  // Customize email body HTML
});
```

### 3. Email Quotas

Google Apps Script quotas (free tier):
- **Recipients per day**: 100
- **Email read/write**: 20,000 per day

For higher volume, upgrade to Google Workspace.

## Automation Configuration

### Sunday Auto-Off Trigger

**Setup in Apps Script**:
1. Click Triggers icon (⏰)
2. Add Trigger
3. Configure:
   - **Function**: `autoMarkSundaysOff`
   - **Event source**: Time-driven
   - **Type**: Day timer
   - **Time**: Midnight to 1am (or your preference)

**Customization Options**:

To change off days (e.g., add Saturday):
1. Edit `isSunday()` function in Code.gs
2. Add Saturday check:
```javascript
function isWeekend() {
  const today = new Date();
  return today.getDay() === 0 || today.getDay() === 6;  // Sunday or Saturday
}
```
3. Update function calls from `isSunday()` to `isWeekend()`

## UI Customization

### 1. Button Text

**Clock In Button** (line ~620):
```html
<button id="clockInBtn" class="btn btn-success btn-full" onclick="clockIn()">
  ⏰ Clock In
</button>
```
- Change "⏰ Clock In" to your preferred text

**Clock Out Button** (line ~623):
```html
<button id="clockOutBtn" class="btn btn-danger btn-full" onclick="clockOut()" disabled>
  ⏰ Clock Out
</button>
```

### 2. Tab Names

**Tabs** (line ~584):
```html
<button class="tab active" onclick="switchTab('dashboard')">Dashboard</button>
<button class="tab" onclick="switchTab('attendance')">Attendance</button>
<button class="tab" onclick="switchTab('leave')">Leave Request</button>
```

### 3. Status Labels

**Status Grid** (line ~594):
```html
<div class="status-label">Status</div>
<div class="status-label">Clock In</div>
<div class="status-label">Clock Out</div>
<div class="status-label">Hours Worked</div>
```

### 4. Monthly Statistics Labels

**Stats Labels** (line ~634):
```html
<div class="stat-label">Present</div>
<div class="stat-label">Absent</div>
<div class="stat-label">Total Hours</div>
<div class="stat-label">Avg Hours/Day</div>
```

## Performance Configuration

### 1. Clock Update Interval

**Current**: 1 second (line ~862)
```javascript
setInterval(updateClock, 1000);  // Update every 1000ms (1 second)
```

**Options**:
- `500` - Half second (smoother but more CPU)
- `1000` - One second (recommended)
- `5000` - Five seconds (less CPU, less smooth)

### 2. Alert Auto-Dismiss Time

**Current**: 5 seconds (line ~1176)
```javascript
setTimeout(() => {
  alertDiv.innerHTML = '';
}, 5000);  // Dismiss after 5000ms (5 seconds)
```

**Options**:
- `3000` - 3 seconds (quick)
- `5000` - 5 seconds (recommended)
- `10000` - 10 seconds (slow)
- `0` - Never auto-dismiss

## Security Configuration

### 1. Session Storage

**Current**: Browser session storage (line ~838)
```javascript
sessionStorage.setItem('pwUser', JSON.stringify(currentUser));
```

**Options**:
- `sessionStorage` - Clears on tab close (more secure)
- `localStorage` - Persists until manual logout (more convenient)

To change to localStorage:
```javascript
// Replace all sessionStorage with localStorage
localStorage.setItem('pwUser', JSON.stringify(currentUser));
const savedUser = localStorage.getItem('pwUser');
localStorage.removeItem('pwUser');
```

### 2. Password Hashing (Production)

**Add to Code.gs**:
```javascript
function hashPassword(password) {
  const hash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256, 
    password
  );
  return hash.map(byte => {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
}
```

**Update authenticateTeacher()** to compare hashed passwords.

### 3. Web App Access Control

**Deployment settings**:
- **Execute as**: Me (recommended for security)
- **Who has access**: 
  - "Only myself" - Most secure, only you
  - "Anyone with the link" - Medium security
  - "Anyone" - Least secure, public

## Mobile Responsiveness

### Breakpoints

Configured in CSS (line ~500):
```css
@media (max-width: 768px) {
  /* Mobile styles */
}
```

**Options**:
- `480px` - Small phones
- `768px` - Tablets (current)
- `1024px` - Small desktops
- `1200px` - Large desktops

## Backup Configuration

### 1. Automatic Version History

Google Sheets automatically maintains version history.

**Access**: File > Version history > See version history

### 2. Manual Backups

**Recommended Schedule**:
- Daily: Automatic (Google handles this)
- Weekly: Download Excel backup
- Monthly: Archive to Google Drive folder

**Download Backup**:
File > Download > Microsoft Excel (.xlsx)

## Logging & Monitoring

### 1. Enable Detailed Logging

Add to functions in Code.gs:
```javascript
Logger.log('Function: clockIn, User: ' + email);
```

**View Logs**: Apps Script > Executions tab

### 2. Error Tracking

Already implemented in all functions:
```javascript
try {
  // Function code
} catch (error) {
  return { success: false, message: 'Error: ' + error.toString() };
}
```

## Summary Checklist

Before going live, configure:

- [ ] SPREADSHEET_ID in Code.gs
- [ ] TIMEZONE in Code.gs
- [ ] Sheet names (if customized)
- [ ] Organization branding (logo, colors)
- [ ] Centers with actual GPS coordinates
- [ ] Geofence radius for each center
- [ ] Teacher accounts with strong passwords
- [ ] Manager email addresses
- [ ] Sunday auto-off trigger
- [ ] Email notification templates
- [ ] Web app access control
- [ ] Password hashing (production)
- [ ] Session vs local storage
- [ ] Backup schedule

## Getting Help

For configuration assistance:
1. Check README.md for general guidance
2. Review DEPLOYMENT.md for setup steps
3. Consult database-schema.md for data structure
4. Check FEATURES.md for capability details

---

**Remember**: Always test configurations in a development environment before deploying to production!
