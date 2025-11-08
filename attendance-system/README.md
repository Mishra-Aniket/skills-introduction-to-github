# PhysicsWallah Teacher Attendance System

A complete, production-ready attendance management system built with Google Apps Script, designed specifically for PhysicsWallah's teacher workforce management needs.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Google%20Apps%20Script-yellow.svg)

## 🌟 Features

### Core Functionality
- ✅ **Teacher Daily Attendance**: Mark attendance with Clock In/Out functionality
- ✅ **Geolocation Tracking**: Automatic GPS location capture and validation
- ✅ **Real-time Clock**: Live digital clock showing current time and date
- ✅ **Multiple Centers Support**: Configure multiple office locations with geofencing
- ✅ **Sunday Auto-Off**: Automatically mark Sundays as "Off" day
- ✅ **Secure Authentication**: Email and password-based login system
- ✅ **Email Auto-save**: Automatic email ID recording with each attendance
- ✅ **Date & Time Stamps**: Precise timestamp recording (seconds precision)

### Advanced Features
- 📊 **Attendance Dashboard**: View attendance records with monthly statistics
- 📍 **Location Detection**: Auto-detect Office/Remote/Center Name based on GPS
- 📝 **Leave Management**: Submit leave requests with manager approval workflow
- 📧 **Email Notifications**: Automatic email alerts to managers for leave requests
- 📈 **Analytics**: Monthly statistics including present days, hours worked, averages
- 🔒 **Security**: Prevent teachers from marking attendance for others
- 📱 **Mobile Responsive**: Perfect UI for mobile, tablet, and desktop devices

### Professional UI
- 🎨 **Darwinbox-inspired Design**: Modern gradient headers and professional styling
- ⏰ **Real-time Updates**: Live clock and status indicators
- 🎭 **Loading States**: Smooth animations and loading indicators
- ✨ **Success/Error Notifications**: User-friendly alert messages
- 🌈 **Gradient Headers**: Beautiful color schemes matching PhysicsWallah branding

## 📋 Requirements

- Google Account (Gmail)
- Google Sheets (for database)
- Google Apps Script (free)
- Modern web browser with geolocation support
- HTTPS connection (for GPS access)

## 🚀 Quick Start

### Step 1: Create Google Sheet Database

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "PhysicsWallah Attendance System"
3. Create four sheets with the following names:
   - `Teachers`
   - `Attendance Log`
   - `Leave Requests`
   - `Centers`

4. Copy headers for each sheet from [database-schema.md](./database-schema.md)

### Step 2: Setup Google Apps Script

1. In your Google Sheet, click `Extensions > Apps Script`
2. Delete any existing code in the editor
3. Copy the entire content of `Code.gs` and paste it
4. Click `File > New > HTML file`, name it `index`
5. Delete the default content and paste the content from `index.html`
6. Save the project (name it "PW Attendance System")

### Step 3: Configure the Spreadsheet ID

1. Copy your spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID_HERE/edit
   ```
2. In `Code.gs`, find line 15:
   ```javascript
   SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID_HERE',
   ```
3. Replace `YOUR_SPREADSHEET_ID_HERE` with your actual ID

### Step 4: Initialize Database

1. In Apps Script editor, select `initializeSheets` from the function dropdown
2. Click the Run button (▶️)
3. Authorize the script when prompted
4. Check your Google Sheet - all sheets should now have headers and sample centers

### Step 5: Add Sample Teacher Data

Add at least one teacher to the `Teachers` sheet for testing:

| Name | Email | Phone | Password | Center | Manager Email | Status | Created Date |
|------|-------|-------|----------|--------|--------------|--------|--------------|
| Test Teacher | teacher@pw.live | +91 9876543210 | test123 | Delhi Center | manager@pw.live | Active | 2024-01-15 |

### Step 6: Deploy as Web App

1. In Apps Script editor, click `Deploy > New deployment`
2. Click the gear icon ⚙️ next to "Select type"
3. Choose "Web app"
4. Configure:
   - Description: "PhysicsWallah Attendance System v1.0"
   - Execute as: "Me"
   - Who has access: "Anyone" (or "Anyone with the link")
5. Click `Deploy`
6. Copy the Web App URL
7. **Important**: Save this URL - this is your attendance system URL!

### Step 7: Test the System

1. Open the Web App URL in a browser
2. Login with your test teacher credentials:
   - Email: `teacher@pw.live`
   - Password: `test123`
3. Allow location access when prompted
4. Test Clock In/Out functionality

## 📱 Usage Guide

### For Teachers

#### Marking Attendance

1. **Login**: Open the web app and login with your email and password
2. **Check Location**: Verify your location is detected correctly
3. **Clock In**: Click the "Clock In" button to mark your arrival
   - Location and GPS coordinates are automatically captured
   - You'll see a success message with the clock-in time
4. **Clock Out**: Click the "Clock Out" button when leaving
   - System calculates total hours worked
   - Location at clock-out is also recorded

#### Viewing Attendance

1. Navigate to the **Attendance** tab
2. View your complete attendance history with:
   - Date
   - Clock In/Out times and locations
   - Hours worked
   - Status (Present/Absent/Off)

#### Requesting Leave

1. Navigate to the **Leave Request** tab
2. Fill in the form:
   - From Date
   - To Date
   - Reason for leave
3. Click "Submit Leave Request"
4. Your manager will receive an email notification
5. Track status in the Leave Requests History table

#### Understanding Dashboard

The dashboard shows:
- **Real-time Clock**: Current time, date, and day
- **Today's Status**: Current attendance status
- **Clock In/Out Times**: Your today's timings
- **Hours Worked**: Total hours for today
- **Current Location**: Your GPS location and nearest center
- **Monthly Statistics**: 
  - Present days
  - Absent days
  - Total hours worked
  - Average hours per day

### For Administrators

#### Adding Teachers

Add new teachers to the `Teachers` sheet with required information:
- Name, Email, Phone, Password
- Assigned Center
- Manager Email (for leave approvals)
- Status (Active/Inactive)
- Created Date

#### Managing Centers

Add or modify centers in the `Centers` sheet:
- Center Name
- Latitude and Longitude (get from Google Maps)
- Radius in meters (geofence range)
- Address
- Status (Active/Inactive)

#### Viewing Reports

Access the Google Sheet directly to:
- View all attendance records
- Generate reports
- Export to Excel/PDF
- Create pivot tables and charts

## 🔧 Advanced Configuration

### Setting Up Sunday Auto-Off

To automatically mark all teachers as "Off" on Sundays:

1. In Apps Script editor, click on the Clock icon (Triggers)
2. Click "+ Add Trigger"
3. Configure:
   - Function: `autoMarkSundaysOff`
   - Event source: Time-driven
   - Type: Day timer
   - Time of day: Midnight to 1am
4. Save

### Customizing Geofence Radius

To adjust the acceptable distance from office centers:

1. Open the `Centers` sheet
2. Modify the "Radius (meters)" column
3. Default is 100 meters
4. Recommended range: 50-200 meters

### Email Notifications

Email notifications are automatically sent when:
- A teacher submits a leave request (to manager)

To customize email templates, edit the `submitLeaveRequest` function in `Code.gs`.

### Timezone Configuration

The default timezone is set to `Asia/Kolkata` (IST). To change:

1. In `Code.gs`, find line 20:
   ```javascript
   TIMEZONE: 'Asia/Kolkata'
   ```
2. Replace with your timezone (e.g., 'America/New_York', 'Europe/London')
3. See [moment.js timezone list](https://momentjs.com/timezone/) for valid values

## 🎨 Customization

### Changing Brand Colors

Edit the CSS variables in `index.html` (around line 19):

```css
:root {
  --primary-color: #2563eb;      /* Primary blue */
  --secondary-color: #10b981;    /* Success green */
  --danger-color: #ef4444;       /* Error red */
  --warning-color: #f59e0b;      /* Warning orange */
}
```

### Modifying the Logo

In `index.html`, find the logo text and update:

```html
<div class="logo">PhysicsWallah</div>
```

Replace "PhysicsWallah" with your organization name.

### Adding Custom Fields

To add custom fields to attendance records:

1. Add column to `Attendance Log` sheet
2. Update `clockIn()` or `clockOut()` function in `Code.gs`
3. Update the HTML form in `index.html` if user input is needed

## 🔒 Security Best Practices

### Production Deployment

For production use, implement these security measures:

#### 1. Password Hashing

Replace plain text passwords with hashed versions:

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

Update the `authenticateTeacher` function to compare hashed passwords.

#### 2. Restrict Sheet Access

1. Right-click on the Google Sheet
2. Click "Share"
3. Set to "Restricted" - only specific people can access
4. Add only administrator emails

#### 3. Enable Two-Factor Authentication

For Google Workspace accounts, enable 2FA for all teacher accounts.

#### 4. Regular Backups

Set up automated backups:
1. File > Version history > See version history
2. Or use Google Takeout for exports

#### 5. Audit Logging

Add logging to track all data modifications:

```javascript
function logActivity(action, email, details) {
  const logSheet = getSheet('Audit Log');
  const timestamp = new Date();
  logSheet.appendRow([timestamp, action, email, details]);
}
```

## 📊 Database Schema

Detailed database schema documentation is available in [database-schema.md](./database-schema.md).

### Quick Overview

1. **Teachers**: User accounts and profiles
2. **Attendance Log**: Daily attendance records with GPS data
3. **Leave Requests**: Leave applications and approval status
4. **Centers**: Office locations with geofencing parameters

## 🐛 Troubleshooting

### Location Not Detected

**Problem**: "Location access denied" message appears

**Solutions**:
- Ensure GPS is enabled on the device
- Check browser location permissions (Settings > Site Settings > Location)
- Make sure the site is accessed via HTTPS
- Try a different browser (Chrome recommended)

### Cannot Clock In on Sunday

**Problem**: System prevents attendance marking on Sunday

**Solution**: This is expected behavior. Sundays are automatically marked as "Off". If you need to allow Sunday attendance:
1. Comment out the Sunday check in `clockIn()` and `clockOut()` functions
2. Disable the `autoMarkSundaysOff()` trigger

### Clock In Button Disabled

**Problem**: Clock In button is grayed out

**Possible Causes**:
- Already clocked in today
- Today is Sunday
- Account is inactive

**Solution**: Check the status message and today's attendance record

### Email Notifications Not Working

**Problem**: Managers not receiving leave request emails

**Solutions**:
- Verify manager email addresses in Teachers sheet
- Check Apps Script permissions for MailApp
- Review Google's email quota limits (100 recipients/day for free accounts)
- Check spam folder

### Hours Worked Shows Wrong Value

**Problem**: Calculated hours don't match actual time

**Solutions**:
- Ensure timezone is correctly configured
- Check if clock times are in same day
- Verify date/time format in sheet

## 📈 Performance Optimization

### For Large Teams (100+ Teachers)

1. **Use Array Operations**: Batch read/write operations
2. **Add Indexes**: Filter data before processing
3. **Limit History**: Archive old records monthly
4. **Optimize Queries**: Use `getRange()` instead of `getDataRange()` when possible

Example optimization:

```javascript
// Instead of reading all data
const data = sheet.getDataRange().getValues();

// Read only needed rows
const lastRow = sheet.getLastRow();
const data = sheet.getRange(2, 1, lastRow - 1, 14).getValues();
```

## 🔄 Version History

### Version 1.0.0 (Current)
- Initial release
- Complete attendance system with all core features
- Mobile-responsive UI
- Geolocation tracking
- Leave management
- Sunday auto-off
- Email notifications
- Monthly statistics

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For issues, questions, or contributions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the [database-schema.md](./database-schema.md)
3. Create an issue in the repository
4. Contact the administrator

## 🎯 Roadmap

Future enhancements planned:

- [ ] Manager dashboard for approvals
- [ ] Shift management (multiple shifts per day)
- [ ] Overtime calculation
- [ ] Export reports to PDF
- [ ] Mobile app (PWA)
- [ ] Biometric integration
- [ ] Multi-language support
- [ ] SMS notifications
- [ ] Integration with payroll systems
- [ ] Advanced analytics and charts

## 👥 Credits

Developed for PhysicsWallah to streamline teacher attendance management with modern technology and user-friendly design.

**Key Technologies**:
- Google Apps Script
- Google Sheets (Database)
- HTML5 Geolocation API
- Modern CSS3 (Flexbox, Grid)
- Vanilla JavaScript (No frameworks)

---

**Note**: This is a production-ready system. For enterprise deployments, consider implementing additional security measures, load balancing, and professional database solutions.

For detailed technical documentation, see [database-schema.md](./database-schema.md).
