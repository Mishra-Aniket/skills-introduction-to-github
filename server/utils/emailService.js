const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send leave application email
const sendLeaveApplicationEmail = async (leave, user) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@attendance.com',
      to: process.env.ADMIN_EMAIL || 'admin@attendance.com',
      subject: 'New Leave Application',
      html: `
        <h2>New Leave Application</h2>
        <p><strong>Teacher:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Start Date:</strong> ${new Date(leave.startDate).toLocaleDateString()}</p>
        <p><strong>End Date:</strong> ${new Date(leave.endDate).toLocaleDateString()}</p>
        <p><strong>Reason:</strong> ${leave.reason}</p>
        <p>Please review and approve/reject this leave request.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Leave application email sent');
  } catch (error) {
    console.error('Error sending leave application email:', error);
  }
};

// Send leave status email
const sendLeaveStatusEmail = async (leave, user, status, notes) => {
  try {
    const transporter = createTransporter();
    
    const statusText = status === 'approved' ? 'Approved' : 'Rejected';
    const statusColor = status === 'approved' ? '#28a745' : '#dc3545';

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@attendance.com',
      to: user.email,
      subject: `Leave Request ${statusText}`,
      html: `
        <h2 style="color: ${statusColor};">Leave Request ${statusText}</h2>
        <p><strong>Start Date:</strong> ${new Date(leave.startDate).toLocaleDateString()}</p>
        <p><strong>End Date:</strong> ${new Date(leave.endDate).toLocaleDateString()}</p>
        <p><strong>Status:</strong> ${statusText}</p>
        ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
        <p>For any questions, please contact your manager or admin.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Leave status email sent');
  } catch (error) {
    console.error('Error sending leave status email:', error);
  }
};

module.exports = {
  sendLeaveApplicationEmail,
  sendLeaveStatusEmail
};
