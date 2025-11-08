# PhysicsWallah Attendance System - Deployment Guide

This guide provides step-by-step instructions for deploying the PhysicsWallah Teacher Attendance System.

## Prerequisites

Before you begin, ensure you have:
- [x] A Google Account (Gmail)
- [x] Access to Google Sheets and Google Apps Script
- [x] Basic understanding of Google Workspace
- [x] 30 minutes of setup time

## Deployment Steps

### Phase 1: Database Setup (10 minutes)

#### Step 1.1: Create Google Sheet

1. Open [Google Sheets](https://sheets.google.com) in your browser
2. Click on the **+ Blank** button to create a new spreadsheet
3. Rename the spreadsheet:
   - Click on "Untitled spreadsheet" at the top
   - Change name to: **PhysicsWallah Attendance System**
   - Press Enter to save

#### Step 1.2: Create Database Sheets

Create four sheets with exact names (case-sensitive):

1. **Teachers Sheet**:
   - Rename "Sheet1" to "Teachers"
   - Add headers in row 1:
     ```
     Name | Email | Phone | Password | Center | Manager Email | Status | Created Date
     ```

2. **Attendance Log Sheet**:
   - Click **+** to add new sheet
   - Name it "Attendance Log"
   - Add headers in row 1:
     ```
     Timestamp | Date | Email | Name | Clock In Time | Clock In Location | Clock In Lat | Clock In Lng | Clock Out Time | Clock Out Location | Clock Out Lat | Clock Out Lng | Hours Worked | Status
     ```

3. **Leave Requests Sheet**:
   - Click **+** to add new sheet
   - Name it "Leave Requests"
   - Add headers in row 1:
     ```
     Timestamp | Email | Name | Manager Email | From Date | To Date | Days | Reason | Status | Approved By | Approved Date
     ```

4. **Centers Sheet**:
   - Click **+** to add new sheet
   - Name it "Centers"
   - Add headers in row 1:
     ```
     Center Name | Latitude | Longitude | Radius (meters) | Address | Status
     ```

#### Step 1.3: Format Headers

For each sheet:
1. Select the header row (row 1)
2. Click the **Bold** button (or Ctrl+B / Cmd+B)
3. Click the **Fill color** button (paint bucket icon)
4. Choose a blue color (#4285f4)
5. Click the **Text color** button
6. Choose white color

#### Step 1.4: Add Sample Data

**Centers Sheet** - Add sample centers:
```
Delhi Center    | 28.7041 | 77.1025 | 100 | Connaught Place, New Delhi | Active
Noida Center    | 28.5355 | 77.3910 | 100 | Sector 62, Noida          | Active
Gurugram Center | 28.4595 | 77.0266 | 100 | Cyber City, Gurugram      | Active
```

**Teachers Sheet** - Add a test teacher:
```
Test Teacher | teacher@pw.live | +91 9876543210 | test123 | Delhi Center | manager@pw.live | Active | 2024-01-15
```

#### Step 1.5: Get Spreadsheet ID

1. Look at your browser's address bar
2. The URL looks like: `https://docs.google.com/spreadsheets/d/XXXXX/edit`
3. Copy the `XXXXX` part (this is your Spreadsheet ID)
4. Save it in a notepad for later use

**Example**:
```
URL: https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/edit
Spreadsheet ID: 1a2b3c4d5e6f7g8h9i0j
```

### Phase 2: Apps Script Setup (10 minutes)

#### Step 2.1: Open Apps Script Editor

1. In your Google Sheet, click **Extensions** in the menu
2. Click **Apps Script**
3. A new tab will open with the Apps Script editor

#### Step 2.2: Add Backend Code

1. You'll see a file called `Code.gs` with some default code
2. **Delete all** the existing code
3. Open the `Code.gs` file from this repository
4. **Copy all** the code
5. **Paste** it into the Apps Script editor
6. Click **Save** (💾 icon or Ctrl+S / Cmd+S)

#### Step 2.3: Configure Spreadsheet ID

1. In the code editor, find line 15 (inside the CONFIG object):
   ```javascript
   SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID_HERE',
   ```
2. Replace `YOUR_SPREADSHEET_ID_HERE` with your actual Spreadsheet ID from Step 1.5
3. It should look like:
   ```javascript
   SPREADSHEET_ID: '1a2b3c4d5e6f7g8h9i0j',
   ```
4. Click **Save** again

#### Step 2.4: Add Frontend HTML

1. In the Apps Script editor, click **File > New > HTML file**
2. Name it: `index` (exactly this name, lowercase)
3. Click **OK**
4. You'll see a new file `index.html` in the left sidebar
5. **Delete all** the default HTML code
6. Open the `index.html` file from this repository
7. **Copy all** the code
8. **Paste** it into the `index.html` file in Apps Script
9. Click **Save**

#### Step 2.5: Rename the Project

1. Click on **Untitled project** at the top
2. Change name to: **PW Attendance System**
3. Press Enter to save

### Phase 3: Authorization & Testing (5 minutes)

#### Step 3.1: Initialize Database

1. In the Apps Script editor toolbar, find the function dropdown
2. Select **initializeSheets** from the dropdown
3. Click the **Run** button (▶️ Play icon)
4. A dialog will appear: "Authorization required"
5. Click **Review permissions**
6. Choose your Google account
7. Click **Advanced** (if warning appears)
8. Click **Go to PW Attendance System (unsafe)**
9. Click **Allow**
10. Wait for execution to complete
11. Check the execution log - you should see: "Execution completed"

#### Step 3.2: Verify Database Initialization

1. Go back to your Google Sheet tab
2. Refresh the page
3. Verify that all sheets now have:
   - Blue headers with white text
   - Sample centers in the Centers sheet
4. If everything looks good, initialization was successful!

### Phase 4: Web App Deployment (5 minutes)

#### Step 4.1: Deploy as Web App

1. In the Apps Script editor, click **Deploy** in the toolbar
2. Select **New deployment**
3. Click the gear icon (⚙️) next to "Select type"
4. Choose **Web app**
5. Fill in the deployment settings:
   - **Description**: `PhysicsWallah Attendance System v1.0`
   - **Execute as**: Select **Me (your email)**
   - **Who has access**: Select **Anyone** (or **Anyone with the link** if you prefer)
6. Click **Deploy**

#### Step 4.2: Authorize Deployment

1. A dialog will appear: "Authorization required"
2. Click **Authorize access**
3. Choose your Google account
4. Click **Advanced** (if warning appears)
5. Click **Go to PW Attendance System (unsafe)**
6. Click **Allow**

#### Step 4.3: Copy Web App URL

1. After deployment, you'll see a "Deployment successfully created" message
2. **Copy the Web App URL** - it looks like:
   ```
   https://script.google.com/macros/s/XXXXX/exec
   ```
3. **Save this URL** - this is your attendance system's public URL!
4. Click **Done**

### Phase 5: Testing (5 minutes)

#### Step 5.1: Access the Web App

1. Open a new browser tab
2. Paste the Web App URL you copied
3. Press Enter
4. The PhysicsWallah Attendance System login page should load

#### Step 5.2: Test Login

1. Enter the test teacher credentials:
   - **Email**: `teacher@pw.live`
   - **Password**: `test123`
2. Click **Login**
3. You should see the main dashboard

#### Step 5.3: Test Geolocation

1. When prompted, click **Allow** for location access
2. The system should detect your location
3. You'll see your coordinates displayed

#### Step 5.4: Test Clock In

1. Click the **Clock In** button
2. You should see a success message
3. The status should update to "Present"
4. Clock In time should be displayed

#### Step 5.5: Verify Database Entry

1. Go back to your Google Sheet
2. Open the **Attendance Log** sheet
3. You should see a new row with your clock-in data
4. Verify all columns are populated correctly

## Post-Deployment Configuration

### Setting Up Sunday Auto-Off

To automatically mark Sundays as off:

1. In Apps Script editor, click the **Clock icon** (Triggers)
2. Click **+ Add Trigger** (bottom right)
3. Configure the trigger:
   - **Function**: `autoMarkSundaysOff`
   - **Event source**: `Time-driven`
   - **Type**: `Day timer`
   - **Time of day**: `Midnight to 1am`
4. Click **Save**
5. Authorize if prompted

### Adding Real Teachers

1. Open the **Teachers** sheet in Google Sheets
2. Add teacher information:
   ```
   Name          | Email              | Phone          | Password | Center        | Manager Email    | Status | Created Date
   Rahul Sharma  | rahul@pw.live     | +91 9876543210 | secure123| Delhi Center  | manager@pw.live | Active | 2024-01-15
   Priya Gupta   | priya@pw.live     | +91 9876543211 | secure456| Noida Center  | manager@pw.live | Active | 2024-01-15
   ```
3. Save the sheet

**Important**: For production, implement password hashing (see Security section in README.md)

### Customizing Centers

To add your actual office locations:

1. Open Google Maps
2. Search for your office address
3. Right-click on the location
4. Click on the coordinates to copy them
5. Add to the **Centers** sheet:
   ```
   Center Name | Latitude | Longitude | Radius | Address        | Status
   Your Office | XX.XXXX  | YY.YYYY   | 100    | Full Address   | Active
   ```

### Adjusting Geofence Radius

The default radius is 100 meters. Adjust based on your needs:
- **Small office**: 50-100 meters
- **Large campus**: 200-500 meters
- **Remote allowed**: 1000+ meters (essentially no restriction)

## Security Hardening (Production)

### Restrict Sheet Access

1. Open your Google Sheet
2. Click **Share** (top right)
3. Change "General access" to **Restricted**
4. Add only admin emails who need direct sheet access
5. Click **Done**

### Use Strong Passwords

Replace test passwords with secure ones:
- Minimum 12 characters
- Mix of letters, numbers, symbols
- Different for each teacher

### Enable Version History

Google Sheets automatically saves version history. To review:
1. Click **File > Version history > See version history**
2. You can restore previous versions if needed

### Regular Backups

Set up monthly backups:
1. Click **File > Download > Microsoft Excel (.xlsx)**
2. Save to a secure location
3. Repeat monthly or use Google Takeout for automation

## Sharing the System

### Share Web App URL

Share the deployment URL with your teachers:
```
https://script.google.com/macros/s/XXXXX/exec
```

### Create a Short Link (Optional)

Use a URL shortener for easier sharing:
1. Go to [bit.ly](https://bitly.com) or [tinyurl.com](https://tinyurl.com)
2. Paste your long Web App URL
3. Create a custom short link like: `bit.ly/pw-attendance`
4. Share the short link with teachers

### Share via QR Code (Optional)

1. Use a QR code generator (many free options online)
2. Generate QR code for your Web App URL
3. Print and display in office
4. Teachers can scan to access

## Troubleshooting Deployment

### "Script function not found: doGet"

**Cause**: `Code.gs` not saved properly

**Solution**: 
1. Verify Code.gs has the `doGet()` function
2. Click Save
3. Redeploy

### "Exception: You do not have permission to call SpreadsheetApp.openById"

**Cause**: Incorrect Spreadsheet ID or no access

**Solution**:
1. Verify the Spreadsheet ID is correct
2. Ensure you own the spreadsheet
3. Check that you authorized the script

### Blank Page When Opening Web App

**Cause**: `index.html` not created or empty

**Solution**:
1. Verify `index.html` exists in the Apps Script project
2. Check that it contains HTML code
3. Redeploy the web app

### Login Fails with Test Credentials

**Cause**: Teachers sheet doesn't have test data

**Solution**:
1. Add test teacher to Teachers sheet
2. Ensure Status is "Active"
3. Match email/password exactly (case-sensitive)

## Updating the System

### Making Code Changes

1. Edit `Code.gs` or `index.html` in Apps Script
2. Click **Save**
3. Click **Deploy > Manage deployments**
4. Click the pencil icon (✏️) next to active deployment
5. Change version to **New version**
6. Click **Deploy**
7. The URL remains the same; changes are live

### Rolling Back

If an update causes issues:
1. Click **Deploy > Manage deployments**
2. Click pencil icon (✏️)
3. Select previous version from dropdown
4. Click **Deploy**

## Monitoring & Maintenance

### Check Usage

1. Apps Script editor > **Executions** (left sidebar)
2. View all script executions
3. Check for errors (red X marks)

### Monitor Quotas

Google Apps Script free tier limits:
- **Email**: 100 recipients/day
- **Script runtime**: 6 min/execution
- **Triggers**: 20 time-based triggers

View quota usage:
1. Apps Script editor > **Project Settings** (left sidebar)
2. Scroll to "Quotas"

### Regular Checks

Perform weekly:
- [ ] Verify attendance records are being created
- [ ] Check for error logs in Executions
- [ ] Review leave requests
- [ ] Ensure Sunday auto-off is working

Perform monthly:
- [ ] Export backup of Google Sheet
- [ ] Review and archive old data
- [ ] Update centers if offices change
- [ ] Audit user accounts (add/remove teachers)

## Next Steps

After successful deployment:

1. ✅ Test with a small group of teachers
2. ✅ Gather feedback and make adjustments
3. ✅ Train all teachers on usage
4. ✅ Set up manager dashboard (future enhancement)
5. ✅ Integrate with payroll (if applicable)

## Support Resources

- **README.md**: General usage guide
- **database-schema.md**: Database structure reference
- **Google Apps Script Docs**: https://developers.google.com/apps-script
- **Google Sheets Help**: https://support.google.com/docs/topic/9054603

## Conclusion

You now have a fully functional PhysicsWallah Teacher Attendance System deployed and ready to use!

**Your deployment checklist**:
- [x] Google Sheet created with 4 sheets
- [x] Sample data added
- [x] Apps Script code deployed
- [x] Spreadsheet ID configured
- [x] Database initialized
- [x] Web app deployed
- [x] System tested
- [x] Web App URL saved

**Web App URL**: `https://script.google.com/macros/s/XXXXX/exec`

Share this URL with your teachers and start managing attendance efficiently!

---

*For technical support or questions, refer to the README.md or database-schema.md files.*
