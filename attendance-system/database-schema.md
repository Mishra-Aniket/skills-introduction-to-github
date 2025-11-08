# PhysicsWallah Attendance System - Database Schema

This document describes the Google Sheets database structure for the PhysicsWallah Teacher Attendance System.

## Overview

The system uses Google Sheets as the database with four main sheets:
1. Teachers
2. Attendance Log
3. Leave Requests
4. Centers

## Sheet 1: Teachers

Stores teacher information and credentials.

| Column | Type | Description | Required | Example |
|--------|------|-------------|----------|---------|
| Name | Text | Teacher's full name | Yes | "Rahul Sharma" |
| Email | Email | Teacher's email address (unique) | Yes | "rahul.sharma@pw.live" |
| Phone | Text | Teacher's phone number | Yes | "+91 9876543210" |
| Password | Text | Teacher's password (should be hashed in production) | Yes | "password123" |
| Center | Text | Assigned center name | Yes | "Delhi Center" |
| Manager Email | Email | Manager's email for leave approvals | Yes | "manager@pw.live" |
| Status | Text | Account status: Active/Inactive | Yes | "Active" |
| Created Date | Date | Account creation date | Yes | "2024-01-15" |

### Sample Data:
```
Name,Email,Phone,Password,Center,Manager Email,Status,Created Date
Rahul Sharma,rahul.sharma@pw.live,+91 9876543210,pass123,Delhi Center,manager@pw.live,Active,2024-01-15
Priya Gupta,priya.gupta@pw.live,+91 9876543211,pass123,Noida Center,manager@pw.live,Active,2024-01-16
```

## Sheet 2: Attendance Log

Records daily attendance with clock in/out times and locations.

| Column | Type | Description | Required | Example |
|--------|------|-------------|----------|---------|
| Timestamp | DateTime | Record creation timestamp | Yes | "2024-01-15 09:30:45" |
| Date | Date | Attendance date (YYYY-MM-DD) | Yes | "2024-01-15" |
| Email | Email | Teacher's email | Yes | "rahul.sharma@pw.live" |
| Name | Text | Teacher's name | Yes | "Rahul Sharma" |
| Clock In Time | Time | Clock in time (HH:MM:SS) | Optional | "09:30:45" |
| Clock In Location | Text | Location type at clock in | Optional | "Delhi Center" |
| Clock In Lat | Number | Latitude at clock in | Optional | 28.7041 |
| Clock In Lng | Number | Longitude at clock in | Optional | 77.1025 |
| Clock Out Time | Time | Clock out time (HH:MM:SS) | Optional | "18:15:30" |
| Clock Out Location | Text | Location type at clock out | Optional | "Delhi Center" |
| Clock Out Lat | Number | Latitude at clock out | Optional | 28.7041 |
| Clock Out Lng | Number | Longitude at clock out | Optional | 77.1025 |
| Hours Worked | Number | Total hours worked (decimal) | Optional | 8.75 |
| Status | Text | Attendance status | Yes | "Present" |

### Status Values:
- **Present**: Teacher marked attendance
- **Absent**: Teacher did not mark attendance
- **Off**: Sunday or holiday (automatic)
- **Leave**: On approved leave

### Sample Data:
```
Timestamp,Date,Email,Name,Clock In Time,Clock In Location,Clock In Lat,Clock In Lng,Clock Out Time,Clock Out Location,Clock Out Lat,Clock Out Lng,Hours Worked,Status
2024-01-15 09:30:45,2024-01-15,rahul.sharma@pw.live,Rahul Sharma,09:30:45,Delhi Center,28.7041,77.1025,18:15:30,Delhi Center,28.7041,77.1025,8.75,Present
2024-01-14 00:00:00,2024-01-14,rahul.sharma@pw.live,Rahul Sharma,,,,,,,,,,Off
```

## Sheet 3: Leave Requests

Manages leave requests and approvals.

| Column | Type | Description | Required | Example |
|--------|------|-------------|----------|---------|
| Timestamp | DateTime | Request submission timestamp | Yes | "2024-01-15 10:30:00" |
| Email | Email | Teacher's email | Yes | "rahul.sharma@pw.live" |
| Name | Text | Teacher's name | Yes | "Rahul Sharma" |
| Manager Email | Email | Manager's email | Yes | "manager@pw.live" |
| From Date | Date | Leave start date | Yes | "2024-01-20" |
| To Date | Date | Leave end date | Yes | "2024-01-22" |
| Days | Number | Number of leave days | Yes | 3 |
| Reason | Text | Leave reason | Yes | "Family function" |
| Status | Text | Request status | Yes | "Pending" |
| Approved By | Email | Approver's email | Optional | "manager@pw.live" |
| Approved Date | DateTime | Approval timestamp | Optional | "2024-01-15 14:30:00" |

### Status Values:
- **Pending**: Awaiting manager approval
- **Approved**: Leave approved
- **Rejected**: Leave rejected

### Sample Data:
```
Timestamp,Email,Name,Manager Email,From Date,To Date,Days,Reason,Status,Approved By,Approved Date
2024-01-15 10:30:00,rahul.sharma@pw.live,Rahul Sharma,manager@pw.live,2024-01-20,2024-01-22,3,Family function,Pending,,
```

## Sheet 4: Centers

Defines office centers with geofencing parameters.

| Column | Type | Description | Required | Example |
|--------|------|-------------|----------|---------|
| Center Name | Text | Name of the center | Yes | "Delhi Center" |
| Latitude | Number | Center latitude coordinate | Yes | 28.7041 |
| Longitude | Number | Center longitude coordinate | Yes | 77.1025 |
| Radius (meters) | Number | Geofence radius in meters | Yes | 100 |
| Address | Text | Full address of the center | Optional | "Connaught Place, New Delhi" |
| Status | Text | Center status: Active/Inactive | Yes | "Active" |

### Sample Data:
```
Center Name,Latitude,Longitude,Radius (meters),Address,Status
Delhi Center,28.7041,77.1025,100,Connaught Place New Delhi,Active
Noida Center,28.5355,77.3910,100,Sector 62 Noida,Active
Gurugram Center,28.4595,77.0266,100,Cyber City Gurugram,Active
```

## Geolocation Logic

### Location Determination:
1. When a teacher marks attendance, the system captures their GPS coordinates
2. The system calculates the distance to each active center using the Haversine formula
3. If the teacher is within the radius of any center, the location is marked as that center's name
4. If the teacher is outside all center radii, the location is marked as "Remote"

### Distance Calculation (Haversine Formula):
```javascript
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
```

## Sunday Auto-Off Automation

The system can automatically mark all active teachers as "Off" on Sundays:

### Implementation:
1. Create a time-driven trigger in Google Apps Script
2. Set it to run daily at midnight (00:00)
3. The `autoMarkSundaysOff()` function checks if the current day is Sunday
4. If yes, it creates attendance records with status "Off" for all active teachers

### Setting up the trigger:
1. Open the Apps Script editor
2. Click on "Triggers" (clock icon)
3. Click "Add Trigger"
4. Configure:
   - Function: `autoMarkSundaysOff`
   - Event source: Time-driven
   - Type: Day timer
   - Time of day: Midnight to 1am
5. Save the trigger

## Data Validation Rules

### Teachers Sheet:
- Email must be unique
- Email must be valid email format
- Status must be "Active" or "Inactive"

### Attendance Log Sheet:
- Date format must be YYYY-MM-DD
- Email must exist in Teachers sheet
- Status must be: Present, Absent, Off, or Leave

### Leave Requests Sheet:
- From Date must be >= today
- To Date must be >= From Date
- Days must be calculated as: (To Date - From Date) + 1
- Status must be: Pending, Approved, or Rejected

### Centers Sheet:
- Latitude must be between -90 and 90
- Longitude must be between -180 and 180
- Radius must be > 0
- Status must be "Active" or "Inactive"

## Indexes and Performance

For better performance with large datasets:

1. **Attendance Log**: Index on Email and Date columns
2. **Teachers**: Index on Email column (primary key)
3. **Leave Requests**: Index on Email and Status columns
4. **Centers**: Index on Status column

## Security Considerations

### Production Recommendations:
1. **Password Hashing**: Use Apps Script's Utilities.computeDigest() to hash passwords
2. **Email Encryption**: Consider encrypting sensitive data
3. **Access Control**: Restrict sheet access to authorized personnel only
4. **Audit Logging**: Log all data modifications with timestamp and user
5. **Data Backup**: Schedule regular backups of the spreadsheet

### Example Password Hashing:
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

## Sample Google Sheet Setup

### Step 1: Create a new Google Sheet
1. Go to Google Sheets (sheets.google.com)
2. Create a new spreadsheet
3. Name it "PhysicsWallah Attendance System"

### Step 2: Create the sheets
1. Rename "Sheet1" to "Teachers"
2. Add sheets: "Attendance Log", "Leave Requests", "Centers"

### Step 3: Add headers
Copy the column names from the schema above for each sheet.

### Step 4: Format headers
1. Make header row bold
2. Set background color to #4285f4 (blue)
3. Set text color to white
4. Freeze the header row (View > Freeze > 1 row)

### Step 5: Add sample data
Add at least one teacher and one center for testing.

### Step 6: Get the Spreadsheet ID
The ID is in the URL: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`

### Step 7: Update Code.gs
Replace `YOUR_SPREADSHEET_ID_HERE` with your actual spreadsheet ID.

## Maintenance

### Regular Tasks:
1. **Daily**: Monitor attendance marking, check for system errors
2. **Weekly**: Review leave requests, verify data integrity
3. **Monthly**: Generate attendance reports, archive old data
4. **Quarterly**: Review center locations, update geofence radii if needed
5. **Yearly**: Clean up inactive teacher accounts, audit security

### Backup Strategy:
1. Enable version history in Google Sheets
2. Set up automated backups using Google Takeout
3. Export monthly reports to CSV for archival
4. Keep copies of the Apps Script code in version control

## Troubleshooting

### Common Issues:

1. **Location not detected**
   - Ensure GPS is enabled on the device
   - Check browser location permissions
   - Verify HTTPS connection

2. **Cannot clock in on Sunday**
   - This is expected behavior (Sunday auto-off)
   - Check if date/time is correct

3. **Distance calculation incorrect**
   - Verify center coordinates are correct
   - Check radius value (in meters, not kilometers)
   - Test with known coordinates

4. **Email notifications not working**
   - Verify MailApp.sendEmail permissions
   - Check manager email addresses are correct
   - Review Apps Script quotas and limits

## API Rate Limits

Google Apps Script has the following quotas (free tier):

- Email recipients per day: 100
- Script runtime: 6 minutes per execution
- Triggers: 20 time-driven triggers per script
- UrlFetch calls: 20,000 per day

Plan your usage accordingly and consider upgrading to Google Workspace if needed.
