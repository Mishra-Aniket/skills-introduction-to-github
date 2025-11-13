# Quick Start Guide - Teacher Attendance System

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js installed (v14+)
- MongoDB installed and running
- A modern web browser

### Installation Steps

1. **Clone & Install**
   ```bash
   git clone https://github.com/Mishra-Aniket/skills-introduction-to-github.git
   cd skills-introduction-to-github
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings (or use defaults for testing)
   ```

3. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running
   mongod
   ```

4. **Run the Application**
   ```bash
   npm start
   ```

5. **Open Your Browser**
   ```
   http://localhost:3000
   ```

### First Time Setup

#### Create a Center
1. First, you need at least one center in the database
2. You can use MongoDB Compass or mongosh to add one:

```javascript
mongosh teacher_attendance
db.centers.insertOne({
  name: "Main Campus",
  address: "123 School Street",
  city: "New York",
  state: "NY",
  pincode: "10001",
  contactEmail: "contact@school.com",
  contactPhone: "555-0100",
  isActive: true,
  createdAt: new Date()
})
```

Or use the API:
```bash
curl -X POST http://localhost:3000/api/centers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Main Campus",
    "address": "123 School Street",
    "city": "New York",
    "state": "NY",
    "pincode": "10001",
    "contactEmail": "contact@school.com",
    "contactPhone": "555-0100"
  }'
```

#### Register Your First User
1. Click "Register" tab
2. Fill in your details:
   - Name: Your Full Name
   - Email: your-email@example.com
   - Password: (min 6 characters)
   - Role: Admin (for first user)
   - Center: Select the center you created
3. Click "Register"

#### Start Using the System
1. **Mark Attendance**: Go to Attendance section, allow location access, click "Mark Present"
2. **Apply for Leave**: Go to Leaves section, click "Apply for Leave"
3. **View Dashboard**: Check your attendance statistics
4. **Manage Centers** (Admin): Add more centers
5. **Approve Leaves** (Admin/Manager): Review and approve leave requests

## 📱 User Roles

### Teacher
- Mark own attendance
- View own attendance history
- Apply for leaves
- View leave status

### Manager
- All teacher capabilities
- Approve/reject leave requests
- View all leave requests

### Admin
- All manager capabilities
- Create and manage centers
- Full system access

## 🎯 Common Tasks

### Mark Attendance
1. Login
2. Click "Attendance" in navigation
3. Allow browser location access
4. Click "Mark Present" or "Mark Absent"
5. Add optional notes
6. Attendance is recorded with location and timestamp

### Apply for Leave
1. Login
2. Click "Leaves" in navigation
3. Click "Apply for Leave"
4. Select start and end dates
5. Enter reason
6. Submit
7. Email notification sent to admin

### Approve Leave (Manager/Admin)
1. Login as Manager or Admin
2. Click "Approvals" in navigation
3. Review pending leaves
4. Click "Approve" or "Reject"
5. Add notes (required for rejection)
6. Email notification sent to teacher

### View Statistics
1. Login
2. Click "Dashboard" in navigation
3. Select month and year
4. Click "View"
5. See your attendance statistics and history

## ⚙️ Configuration

### Email Setup (Gmail)
1. Enable 2-factor authentication in Gmail
2. Generate App Password:
   - Google Account → Security → 2-Step Verification → App passwords
3. Update .env:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

### MongoDB Connection
Default connection: `mongodb://localhost:27017/teacher_attendance`

For remote MongoDB:
```env
MONGODB_URI=mongodb://username:password@host:port/teacher_attendance
```

For MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/teacher_attendance
```

## 🔧 Troubleshooting

### Location Not Working
- Allow location permissions in browser
- Check browser console for errors
- HTTPS required in production

### Email Not Sending
- Verify SMTP settings in .env
- For Gmail, use App Password
- Check firewall for port 587

### Cannot Connect to Database
- Ensure MongoDB is running: `mongod`
- Check connection string in .env
- Verify network connectivity

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 npm start
```

## 📊 Sample Data

### Create Sample Users (for testing)

```javascript
// Run in mongosh
use teacher_attendance

// Create sample teachers
db.users.insertMany([
  {
    name: "John Doe",
    email: "john@school.com",
    password: "$2a$10$...", // Use proper hashing
    role: "teacher",
    centerId: ObjectId("..."),
    createdAt: new Date()
  },
  {
    name: "Jane Smith",
    email: "jane@school.com",
    password: "$2a$10$...",
    role: "manager",
    centerId: ObjectId("..."),
    createdAt: new Date()
  }
])
```

## 🎨 UI Features

- **Responsive Design**: Works on desktop, tablet, mobile
- **Professional Theme**: Darwinbox-inspired design
- **Dark Mode Ready**: Clean color scheme
- **Toast Notifications**: User-friendly feedback
- **Real-time Updates**: Dynamic content loading

## 🔐 Security Notes

- All passwords are hashed
- JWT tokens expire after 7 days
- Rate limiting on all endpoints
- Input validation and sanitization
- Role-based access control

## 📚 Additional Resources

- **Full Documentation**: See ATTENDANCE_SYSTEM_README.md
- **Security Details**: See SECURITY.md
- **Deployment Guide**: See DEPLOYMENT.md
- **API Documentation**: Available in source files

## 💡 Tips

1. **For Testing**: Use localhost with default settings
2. **For Production**: Follow DEPLOYMENT.md guide
3. **Email Testing**: Use Mailtrap or similar service
4. **Database GUI**: Use MongoDB Compass for easier management
5. **API Testing**: Use Postman or curl

## 🆘 Getting Help

1. Check the troubleshooting section
2. Review error messages in browser console
3. Check server logs: `pm2 logs` or console output
4. Review MongoDB logs
5. Verify all environment variables

## 🎉 Success Indicators

You know everything is working when:
- ✅ You can register and login
- ✅ Location is detected on attendance page
- ✅ Attendance can be marked successfully
- ✅ Dashboard shows statistics
- ✅ Leaves can be applied and approved
- ✅ Emails are being sent

---

**Ready to go?** Start with `npm start` and open http://localhost:3000

**Questions?** Check ATTENDANCE_SYSTEM_README.md for detailed information.
