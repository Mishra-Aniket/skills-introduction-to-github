# Teacher Attendance System

A comprehensive, professional Teacher Attendance System with geolocation tracking, leave management, and email notifications. Built with modern web technologies and designed with a clean, professional UI similar to Darwinbox.

## 🚀 Features

### Core Attendance Features
1. ✅ **Teacher Daily Attendance** - Teachers can mark their daily attendance through an intuitive interface
2. 📍 **Geolocation Tracking** - Automatically captures and saves teacher location when marking attendance
3. 👤 **Self-Selection Only** - Security ensures teachers can only mark their own attendance
4. 📧 **Email Auto-Save** - Automatically saves email ID of the teacher marking attendance
5. ⏰ **Date & Time Stamp** - Records exact date and time of attendance marking
6. 📊 **Attendance Dashboard** - Comprehensive dashboard to view attendance records and statistics
7. ✓/✗ **Present/Absent Option** - Clear options to mark present or absent status
8. 🌞 **Sunday Auto-Off** - Automatically recognizes and marks Sundays as off days

### Advanced Features
9. 🏢 **Multiple Centers Support** - Manage multiple centers/institutions
10. 🎨 **Professional UI** - Clean, modern interface inspired by Darwinbox
11. 📅 **Advance Leave Marking** - Teachers can request leaves in advance
12. 👨‍💼 **Admin Self-Attendance** - Admins can mark their own attendance
13. ✅ **Leave Approval Workflow** - Manager/Admin approval system for leave requests
14. 📨 **Email Notifications** - Automated emails for leave applications and approvals/rejections

## 🛠 Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - Database for storing all data
- **Mongoose** - ODM for MongoDB
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email notifications

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript** - No frameworks, pure JavaScript
- **Geolocation API** - Browser-based location tracking

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- A modern web browser with geolocation support

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd skills-introduction-to-github
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   - Update the `.env` file with your settings:
     ```env
     NODE_ENV=development
     PORT=3000
     MONGODB_URI=mongodb://localhost:27017/teacher_attendance
     JWT_SECRET=your-super-secret-jwt-key-change-in-production
     EMAIL_HOST=smtp.gmail.com
     EMAIL_PORT=587
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASSWORD=your-email-password
     EMAIL_FROM=noreply@attendance.com
     ADMIN_EMAIL=admin@attendance.com
     ```

4. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running
   mongod
   ```

5. **Run the application**
   ```bash
   npm start
   ```

6. **Access the application**
   - Open your browser and navigate to: `http://localhost:3000`

## 📱 Usage Guide

### First Time Setup

1. **Register as Admin**
   - First, you need to create at least one center
   - Register with role "Admin"
   - Add centers through the Centers section

2. **Add Centers**
   - Navigate to Centers section (Admin only)
   - Click "Add Center"
   - Fill in center details (name, address, contact info)

3. **Register Teachers**
   - Teachers can register themselves
   - Select appropriate center during registration
   - Choose "Teacher" role

### Daily Attendance

1. **Login** to your account
2. Navigate to **Attendance** section
3. The system will automatically detect your location
4. Click **Mark Present** or **Mark Absent**
5. Add optional notes if needed
6. Attendance is recorded with timestamp and location

### Leave Management

#### For Teachers:
1. Navigate to **Leaves** section
2. Click **Apply for Leave**
3. Select start and end dates
4. Provide reason for leave
5. Submit - email notification sent to admin

#### For Managers/Admins:
1. Navigate to **Approvals** section
2. Review pending leave requests
3. Click **Approve** or **Reject**
4. Add notes (required for rejection)
5. Email notification sent to teacher

### Viewing Dashboard

1. Navigate to **Dashboard** section
2. Select month and year
3. View statistics:
   - Total attendance days
   - Present days
   - Absent days
   - Sundays off
4. View detailed attendance history table

## 🔐 Security Features

- **Password Hashing** - Passwords are hashed using bcryptjs
- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Different permissions for teachers, managers, and admins
- **Self-Selection Only** - Users can only mark their own attendance
- **Geolocation Verification** - Location tracked for attendance integrity

## 📊 Database Schema

### User
- name, email, password (hashed)
- role: teacher | admin | manager
- centerId: reference to Center
- timestamps

### Center
- name, address, city, state, pincode
- contactEmail, contactPhone
- isActive status
- timestamps

### Attendance
- userId: reference to User
- date, status (present/absent/sunday_off)
- geolocation: { latitude, longitude }
- timestamp
- centerId: reference to Center
- notes

### Leave
- userId: reference to User
- startDate, endDate, reason
- status: pending | approved | rejected
- approvedBy: reference to User
- approvalDate, approvalNotes
- timestamps

## 🎨 UI Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Professional Color Scheme** - Modern, clean design
- **Intuitive Navigation** - Easy-to-use interface
- **Real-time Updates** - Dynamic content loading
- **Toast Notifications** - User-friendly feedback messages
- **Role-based UI** - Different views for different user roles

## 📧 Email Configuration

For email notifications to work, configure SMTP settings in `.env`:

### Gmail Example:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-specific-password
```

**Note:** For Gmail, you need to:
1. Enable 2-factor authentication
2. Generate an app-specific password
3. Use that password in the EMAIL_PASSWORD field

## 🚀 Deployment

### For Production:

1. **Update Environment Variables**
   - Set `NODE_ENV=production`
   - Use strong `JWT_SECRET`
   - Configure production MongoDB URI
   - Set up production email service

2. **Security Checklist**
   - Enable HTTPS
   - Set secure cookie flags
   - Configure CORS properly
   - Set up rate limiting
   - Enable MongoDB authentication

3. **Database Backup**
   - Set up regular MongoDB backups
   - Configure backup retention policy

## 🤝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Attendance
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance/my` - Get my attendance records
- `GET /api/attendance/today` - Get today's attendance status
- `GET /api/attendance/stats` - Get attendance statistics

### Leaves
- `POST /api/leaves/apply` - Apply for leave
- `GET /api/leaves/my` - Get my leave requests
- `GET /api/leaves/all` - Get all leave requests (Manager/Admin)
- `PATCH /api/leaves/:leaveId/status` - Approve/reject leave (Manager/Admin)

### Centers
- `GET /api/centers` - Get all centers
- `GET /api/centers/:centerId` - Get single center
- `POST /api/centers` - Create center (Admin)
- `PATCH /api/centers/:centerId` - Update center (Admin)
- `DELETE /api/centers/:centerId` - Deactivate center (Admin)

## 🐛 Troubleshooting

### Geolocation Not Working
- Ensure browser has location permissions enabled
- Application must be served over HTTPS in production
- Check browser console for errors

### Email Notifications Not Sending
- Verify SMTP credentials in `.env`
- Check email service provider settings
- Review server logs for errors

### Cannot Connect to Database
- Ensure MongoDB is running
- Check MongoDB connection string in `.env`
- Verify network connectivity

## 📄 License

MIT License - feel free to use this project for your organization

## 👨‍💻 Support

For issues or questions:
- Check the troubleshooting section
- Review server logs
- Ensure all dependencies are installed
- Verify environment configuration

## 🎯 Future Enhancements

Potential features for future versions:
- Export attendance reports to Excel/PDF
- SMS notifications
- Biometric integration
- Mobile app (React Native)
- Advanced analytics and reporting
- Holiday calendar management
- Shift management
- Multi-language support

---

**Built with ❤️ for educational institutions**
