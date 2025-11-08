# PhysicsWallah Attendance System - Quick Reference Card

## 🚀 Quick Setup (5 Minutes)

### 1. Create Google Sheet
- Go to sheets.google.com
- Create new sheet: "PhysicsWallah Attendance System"
- Create 4 sheets: Teachers, Attendance Log, Leave Requests, Centers

### 2. Setup Apps Script
- Extensions > Apps Script
- Copy Code.gs → paste in Apps Script
- Create index.html file → paste HTML code
- Update SPREADSHEET_ID in Code.gs

### 3. Deploy
- Deploy > New deployment > Web app
- Execute as: Me
- Access: Anyone
- Copy Web App URL

### 4. Initialize
- Run initializeSheets function
- Authorize when prompted
- Add sample teacher data

## 📱 Usage Guide

### For Teachers

**Login**
```
URL: Your Web App URL
Email: teacher@pw.live
Password: your_password
```

**Mark Attendance**
1. Click "Clock In" button (morning)
2. Click "Clock Out" button (evening)
3. View statistics on Dashboard tab

**Request Leave**
1. Go to "Leave Request" tab
2. Fill from/to dates and reason
3. Click "Submit Leave Request"

## 🔧 Configuration

### Add Teacher
```
Teachers Sheet:
Name | Email | Phone | Password | Center | Manager Email | Status | Created Date
```

### Add Center
```
Centers Sheet:
Center Name | Latitude | Longitude | Radius (m) | Address | Status
Delhi Center | 28.7041 | 77.1025 | 100 | Full Address | Active
```

### Customize Colors
Edit in index.html:
```css
--primary-color: #2563eb;
--secondary-color: #10b981;
```

## 🔍 Key Features Checklist

- [x] Clock In/Out with GPS coordinates
- [x] Geolocation tracking (Office/Remote/Center)
- [x] Real-time digital clock
- [x] Sunday auto-off
- [x] Leave request management
- [x] Email notifications to managers
- [x] Monthly statistics
- [x] Attendance history
- [x] Mobile responsive design
- [x] Professional Darwinbox-style UI

## 🔒 Security Checklist

- [ ] Replace test passwords with strong ones
- [ ] Restrict Google Sheet access
- [ ] Implement password hashing (production)
- [ ] Setup regular backups
- [ ] Enable audit logging
- [ ] Review user permissions monthly

## 📊 Monitoring

### Daily Checks
- Attendance records being created
- No error logs in Apps Script Executions
- Sunday auto-off working

### Weekly Checks
- Review leave requests
- Verify geolocation accuracy
- Check email notifications

### Monthly Tasks
- Export backup
- Archive old records
- Update centers if needed
- Review user accounts

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| Location not detected | Enable GPS, allow browser location access |
| Can't clock in on Sunday | Expected - Sunday is auto-off |
| Clock In disabled | Already clocked in or inactive account |
| Email not sent | Check manager email, verify MailApp permissions |

## 📞 Support Resources

- **Full Documentation**: README.md
- **Deployment Guide**: DEPLOYMENT.md
- **Database Schema**: database-schema.md
- **Google Apps Script**: developers.google.com/apps-script

## 🎯 System URLs

**Web App URL** (fill after deployment):
```
https://script.google.com/macros/s/_______________/exec
```

**Google Sheet ID** (fill after creation):
```
Your_Spreadsheet_ID_Here
```

**Short URL** (optional, create with bit.ly):
```
bit.ly/pw-attendance
```

## 📝 Sample Teacher Login

```
Email: teacher@pw.live
Password: test123
```

**⚠️ Change this password immediately for production use!**

## 🔄 Version Control

- **Current Version**: 1.0.0
- **Last Updated**: Check git log
- **Deployment Date**: _____________

## ✅ Pre-Launch Checklist

Before going live:
- [ ] Database sheets created with headers
- [ ] Sample centers added
- [ ] Spreadsheet ID configured in Code.gs
- [ ] Apps Script deployed as web app
- [ ] Database initialized (ran initializeSheets)
- [ ] Test teacher added
- [ ] Login tested successfully
- [ ] Clock In/Out tested
- [ ] Geolocation working
- [ ] Sunday auto-off trigger set
- [ ] Production teachers added
- [ ] Passwords changed from defaults
- [ ] Sheet access restricted
- [ ] Web App URL shared with team

---

**Print this card and keep it handy for quick reference!**

For detailed instructions, always refer to README.md and DEPLOYMENT.md.
