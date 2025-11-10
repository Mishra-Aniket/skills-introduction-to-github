# Deployment Guide - Clock-In/Clock-Out System

This guide provides step-by-step instructions for deploying the Clock-In/Clock-Out System with Session Persistence.

## Prerequisites

- Google Account
- Access to Google Apps Script
- Access to Google Sheets

## Step-by-Step Deployment

### Step 1: Create Google Apps Script Project

1. Navigate to [Google Apps Script](https://script.google.com/)
2. Click **"New Project"** button
3. Rename the project:
   - Click on "Untitled project" at the top
   - Enter "Clock In Out System" or your preferred name
   - Click anywhere outside to save

### Step 2: Create the Main Script File

1. In the script editor, you'll see `Code.gs` by default
2. Delete any default code
3. Copy the entire contents of `code.gs` from this repository
4. Paste into the editor
5. Press `Ctrl+S` (or `Cmd+S` on Mac) to save

### Step 3: Create the Admin Script File

1. Click the **"+"** button next to "Files" in the left sidebar
2. Select **"Script"**
3. Name it `AdminRegistration`
4. Copy the entire contents of `AdminRegistration.gs` from this repository
5. Paste into the editor
6. Press `Ctrl+S` to save

### Step 4: Create HTML Files

#### Create index.html
1. Click the **"+"** button next to "Files"
2. Select **"HTML"**
3. Name it `index`
4. Copy the entire contents of `index.html` from this repository
5. Paste into the editor
6. Press `Ctrl+S` to save

#### Create leave.html
1. Click the **"+"** button next to "Files"
2. Select **"HTML"**
3. Name it `leave`
4. Copy the entire contents of `leave.html` from this repository
5. Paste into the editor
6. Press `Ctrl+S` to save

### Step 5: Create or Link Google Sheet

You have two options:

#### Option A: Let the script create sheets automatically
The script will automatically create the necessary sheets on first run.

#### Option B: Use a specific Google Sheet
1. Create a new Google Sheet or open an existing one
2. Copy the Sheet ID from the URL: 
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
   ```
3. In `code.gs`, add at the top:
   ```javascript
   const SPREADSHEET_ID = 'YOUR_SHEET_ID_HERE';
   ```
4. Replace `SpreadsheetApp.getActiveSpreadsheet()` with:
   ```javascript
   SpreadsheetApp.openById(SPREADSHEET_ID)
   ```

### Step 6: Test the Script

1. In the script editor, select the function `initializeSheets` from the dropdown
2. Click the **"Run"** button (▶️)
3. First time:
   - You'll see "Authorization required"
   - Click **"Review permissions"**
   - Choose your Google account
   - Click **"Advanced"** → **"Go to [Project Name] (unsafe)"**
   - Click **"Allow"**
4. Check the Execution log (bottom of screen) for success messages

### Step 7: Deploy as Web App

1. Click **"Deploy"** button at the top right
2. Select **"New deployment"**
3. Click the gear icon ⚙️ next to "Select type"
4. Select **"Web app"**
5. Configure the deployment:
   - **Description**: "Initial deployment" (or current date)
   - **Execute as**: **Me** (your email)
   - **Who has access**: 
     - Choose **"Anyone"** for public access
     - OR **"Anyone with Google account"** for restricted access
6. Click **"Deploy"**
7. **IMPORTANT**: Copy the Web app URL that appears
   - It will look like: `https://script.google.com/macros/s/DEPLOYMENT_ID/exec`
   - Save this URL - you'll need it to access the application

### Step 8: Access the Application

1. Open the Web app URL in a new browser tab
2. You should see the Clock In/Out login screen
3. Test the functionality:
   - Enter name and email
   - Click "Login"
   - Try clocking in
   - Close the browser
   - Reopen the URL
   - Verify session persists

### Step 9: Configure Admin Access (Optional)

1. Open `AdminRegistration.gs`
2. Find the line:
   ```javascript
   const ADMIN_EMAILS = ['admin@example.com'];
   ```
3. Replace with your admin email(s):
   ```javascript
   const ADMIN_EMAILS = ['youremail@example.com', 'another@example.com'];
   ```
4. Save the file
5. Redeploy:
   - Click **"Deploy"** → **"Manage deployments"**
   - Click the pencil icon ✏️ next to your deployment
   - Change version to **"New version"**
   - Click **"Deploy"**

### Step 10: Set Up Automated Cleanup (Optional)

1. In the Apps Script editor, select function `setupAutomatedCleanup`
2. Click **"Run"** (▶️)
3. This creates a daily trigger to clean expired sessions

## Verification Checklist

After deployment, verify:

- [ ] Web app URL opens successfully
- [ ] Login page displays correctly
- [ ] Can register a new user
- [ ] Session token is saved to localStorage
- [ ] Can clock in successfully
- [ ] Can clock out successfully
- [ ] Google Sheets contains three tabs: Attendance, Sessions, Users
- [ ] Data appears in the correct sheets
- [ ] Session persists after closing browser
- [ ] Session recovery works
- [ ] Leave management page is accessible
- [ ] Mobile responsive design works

## Troubleshooting Deployment Issues

### "Authorization required" error
**Solution**: Follow Step 6 to grant permissions

### "Script function not found" error
**Solution**: 
- Ensure all files are saved
- Check file names match exactly (case-sensitive)
- Verify function names are correct

### "Exception: You do not have permission to call" error
**Solution**:
- In deployment settings, ensure "Execute as" is set to "Me"
- Reauthorize the script

### Web app shows blank page
**Solution**:
- Check browser console for errors (F12)
- Verify HTML files are named correctly: `index` and `leave`
- Check that `doGet()` function exists in `code.gs`

### Session not persisting
**Solution**:
- Check if localStorage is enabled in browser
- Check browser privacy settings
- Try in incognito/private mode to rule out extensions

### Can't access Google Sheets
**Solution**:
- Ensure script has permission to access Sheets
- Run `initializeSheets()` manually
- Check if sheet exists and is accessible

## Mobile Testing

Test on mobile devices:

1. Open the Web app URL on your phone
2. Add to home screen for app-like experience:
   - **iOS**: Safari → Share → Add to Home Screen
   - **Android**: Chrome → Menu → Add to Home Screen

## Production Deployment Best Practices

### 1. Use a Dedicated Google Sheet
- Create a new Google Sheet specifically for this application
- Don't use a personal sheet with other data

### 2. Set Up Regular Backups
- Run `backupData()` function weekly or monthly
- Or set up a time-based trigger for automated backups

### 3. Monitor Usage
- Periodically run `getSystemStats()` to check system health
- Monitor Google Apps Script quotas

### 4. Security Considerations
- Keep admin emails list updated
- Regularly review and clean up inactive users
- Monitor for unusual activity in the logs

### 5. Version Control
- Keep a copy of your code in this repository
- Document any changes you make
- Create new deployments for major updates

## Updating the Application

When you need to update the code:

1. Make changes in the Apps Script editor
2. Save all files
3. Go to **Deploy** → **Manage deployments**
4. Click the pencil icon ✏️ next to your deployment
5. Change version to **"New version"**
6. Add description of changes
7. Click **"Deploy"**

**Note**: Users don't need to do anything - they'll automatically get the latest version.

## Support and Maintenance

### Regular Maintenance Tasks

**Daily** (Automated):
- Cleanup expired sessions (if trigger is set up)

**Weekly**:
- Review system statistics
- Check for open sessions that should be closed

**Monthly**:
- Create data backup
- Review user list for inactive accounts
- Check execution logs for errors

### Getting Help

If you encounter issues:

1. Check the execution logs in Apps Script editor
2. Review the `CLOCKIN_SYSTEM.md` documentation
3. Test individual functions in the script editor
4. Check Google Apps Script quota limits
5. Review browser console for client-side errors

## Scaling Considerations

The system can handle:
- ✅ Small teams (1-50 users): Works perfectly out of the box
- ✅ Medium teams (50-200 users): May need to optimize sheet reads
- ⚠️ Large teams (200+ users): Consider migrating to a database

For large teams, consider:
- Using Google Apps Script's Cache Service
- Implementing pagination for large datasets
- Moving to Google Cloud Platform with proper database

## Uninstalling

To remove the application:

1. Delete the web app deployment:
   - **Deploy** → **Manage deployments**
   - Click trash icon 🗑️ next to deployment
2. Delete the Google Apps Script project
3. Delete the Google Sheet (if dedicated)
4. Users should clear their localStorage

---

**Deployment Complete! 🎉**

Your Clock-In/Clock-Out System is now live and ready to use.
