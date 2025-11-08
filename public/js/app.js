// Global state
let currentUser = null;
let authToken = null;
let currentLocation = null;

// API Base URL
const API_URL = window.location.origin + '/api';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    authToken = localStorage.getItem('authToken');
    if (authToken) {
        loadCurrentUser();
    } else {
        showScreen('loginScreen');
        loadCenters();
    }

    // Setup form handlers
    setupEventListeners();
    
    // Get geolocation
    getLocation();
    
    // Update current date
    updateCurrentDate();
    
    // Populate month and year selectors
    populateMonthYearSelectors();
});

// Setup event listeners
function setupEventListeners() {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('leaveForm').addEventListener('submit', handleLeaveSubmit);
    document.getElementById('centerForm').addEventListener('submit', handleCenterSubmit);
}

// Tab switching
function showTab(tab) {
    const tabs = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.form-content');
    
    tabs.forEach(t => t.classList.remove('active'));
    forms.forEach(f => f.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tab + 'Form').classList.add('active');
}

// Screen switching
function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// Section switching
function showSection(section) {
    const sections = document.querySelectorAll('.content-section');
    const links = document.querySelectorAll('.nav-link:not(.admin-only), .nav-link.admin-only');
    
    sections.forEach(s => s.classList.remove('active'));
    links.forEach(l => l.classList.remove('active'));
    
    document.getElementById(section + 'Section').classList.add('active');
    event.target.classList.add('active');
    
    // Load section data
    switch(section) {
        case 'attendance':
            checkTodayAttendance();
            break;
        case 'leaves':
            loadMyLeaves();
            break;
        case 'dashboard':
            loadStats();
            break;
        case 'centers':
            loadCenters();
            break;
        case 'approvals':
            loadApprovals();
            break;
    }
}

// Authentication
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            currentUser = data.user;
            showToast('Login successful!', 'success');
            showDashboard();
        } else {
            showToast(data.error || 'Login failed', 'error');
        }
    } catch (error) {
        showToast('Login failed. Please try again.', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const role = document.getElementById('regRole').value;
    const centerId = document.getElementById('regCenter').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role, centerId })
        });

        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            currentUser = data.user;
            showToast('Registration successful!', 'success');
            showDashboard();
        } else {
            showToast(data.error || 'Registration failed', 'error');
        }
    } catch (error) {
        showToast('Registration failed. Please try again.', 'error');
    }
}

async function loadCurrentUser() {
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            showDashboard();
        } else {
            logout();
        }
    } catch (error) {
        logout();
    }
}

function showDashboard() {
    showScreen('dashboardScreen');
    document.getElementById('userName').textContent = currentUser.name;
    
    // Set role-based UI
    if (currentUser.role === 'admin' || currentUser.role === 'manager') {
        document.body.classList.add(currentUser.role);
    }
    
    // Load initial data
    checkTodayAttendance();
}

function logout() {
    localStorage.removeItem('authToken');
    authToken = null;
    currentUser = null;
    document.body.classList.remove('admin', 'manager');
    showScreen('loginScreen');
    showToast('Logged out successfully', 'info');
}

// Geolocation
function getLocation() {
    if (navigator.geolocation) {
        document.getElementById('locationStatus').textContent = 'Detecting...';
        navigator.geolocation.getCurrentPosition(
            (position) => {
                currentLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                document.getElementById('locationStatus').textContent = 'Location detected ✓';
                document.getElementById('coordinates').textContent = 
                    `Lat: ${currentLocation.latitude.toFixed(6)}, Long: ${currentLocation.longitude.toFixed(6)}`;
            },
            (error) => {
                document.getElementById('locationStatus').textContent = 'Location unavailable';
                showToast('Please enable location services', 'error');
            }
        );
    } else {
        document.getElementById('locationStatus').textContent = 'Geolocation not supported';
        showToast('Geolocation not supported by your browser', 'error');
    }
}

// Attendance
async function checkTodayAttendance() {
    try {
        const response = await fetch(`${API_URL}/attendance/today`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        const data = await response.json();
        
        if (response.ok) {
            const statusCard = document.getElementById('attendanceStatus');
            const markCard = document.getElementById('markAttendanceCard');
            
            if (data.isSunday) {
                statusCard.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <h3 style="color: var(--info-color); margin-bottom: 10px;">🌞 Sunday - Weekly Off</h3>
                        <p>Enjoy your day off! Attendance is automatically marked.</p>
                    </div>
                `;
                markCard.style.display = 'none';
            } else if (data.attendance) {
                const status = data.attendance.status;
                const statusColor = status === 'present' ? 'var(--success-color)' : 'var(--danger-color)';
                const statusIcon = status === 'present' ? '✓' : '✗';
                const statusText = status === 'present' ? 'Present' : 'Absent';
                
                statusCard.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <h3 style="color: ${statusColor}; margin-bottom: 10px;">
                            ${statusIcon} Marked ${statusText}
                        </h3>
                        <p>Marked at: ${new Date(data.attendance.timestamp).toLocaleString()}</p>
                        ${data.attendance.geolocation ? 
                            `<p style="margin-top: 10px; color: var(--secondary-color);">
                                Location: ${data.attendance.geolocation.latitude.toFixed(4)}, 
                                ${data.attendance.geolocation.longitude.toFixed(4)}
                            </p>` : ''}
                    </div>
                `;
                markCard.style.display = 'none';
            } else {
                statusCard.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <h3 style="color: var(--warning-color);">⏰ Attendance Not Marked</h3>
                        <p>Please mark your attendance for today</p>
                    </div>
                `;
                markCard.style.display = 'block';
            }
        }
    } catch (error) {
        showToast('Failed to load attendance status', 'error');
    }
}

async function markAttendance(status) {
    if (status === 'present' && !currentLocation) {
        showToast('Please enable location to mark present', 'error');
        return;
    }

    const notes = document.getElementById('attendanceNotes').value;

    try {
        const response = await fetch(`${API_URL}/attendance/mark`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                status,
                latitude: currentLocation?.latitude,
                longitude: currentLocation?.longitude,
                notes
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            showToast('Attendance marked successfully!', 'success');
            checkTodayAttendance();
            document.getElementById('attendanceNotes').value = '';
        } else {
            showToast(data.error || 'Failed to mark attendance', 'error');
        }
    } catch (error) {
        showToast('Failed to mark attendance', 'error');
    }
}

async function loadStats() {
    const month = document.getElementById('monthSelect').value;
    const year = document.getElementById('yearSelect').value;

    try {
        const response = await fetch(`${API_URL}/attendance/stats?month=${month}&year=${year}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('statTotal').textContent = data.stats.total;
            document.getElementById('statPresent').textContent = data.stats.present;
            document.getElementById('statAbsent').textContent = data.stats.absent;
            document.getElementById('statSunday').textContent = data.stats.sundayOff;
            
            // Display attendance history
            displayAttendanceHistory(data.attendance);
        }
    } catch (error) {
        showToast('Failed to load statistics', 'error');
    }
}

function displayAttendanceHistory(attendance) {
    const container = document.getElementById('attendanceHistory');
    
    if (!attendance || attendance.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 20px; color: var(--secondary-color);">No attendance records found</p>';
        return;
    }

    const table = `
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Time</th>
                    <th>Location</th>
                </tr>
            </thead>
            <tbody>
                ${attendance.map(a => `
                    <tr>
                        <td>${new Date(a.date).toLocaleDateString()}</td>
                        <td>
                            <span class="leave-status status-${a.status === 'present' ? 'approved' : a.status === 'sunday_off' ? 'pending' : 'rejected'}">
                                ${a.status.replace('_', ' ').toUpperCase()}
                            </span>
                        </td>
                        <td>${new Date(a.timestamp).toLocaleTimeString()}</td>
                        <td>${a.geolocation ? `${a.geolocation.latitude.toFixed(4)}, ${a.geolocation.longitude.toFixed(4)}` : 'N/A'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = table;
}

// Leaves
function showLeaveForm() {
    document.getElementById('leaveFormCard').style.display = 'block';
}

function hideLeaveForm() {
    document.getElementById('leaveFormCard').style.display = 'none';
    document.getElementById('leaveForm').reset();
}

async function handleLeaveSubmit(e) {
    e.preventDefault();
    
    const startDate = document.getElementById('leaveStartDate').value;
    const endDate = document.getElementById('leaveEndDate').value;
    const reason = document.getElementById('leaveReason').value;

    try {
        const response = await fetch(`${API_URL}/leaves/apply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ startDate, endDate, reason })
        });

        const data = await response.json();
        
        if (response.ok) {
            showToast('Leave application submitted successfully!', 'success');
            hideLeaveForm();
            loadMyLeaves();
        } else {
            showToast(data.error || 'Failed to submit leave', 'error');
        }
    } catch (error) {
        showToast('Failed to submit leave application', 'error');
    }
}

async function loadMyLeaves() {
    try {
        const response = await fetch(`${API_URL}/leaves/my`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        const data = await response.json();
        
        if (response.ok) {
            displayLeaves(data.leaves, 'myLeavesList');
        }
    } catch (error) {
        showToast('Failed to load leaves', 'error');
    }
}

function displayLeaves(leaves, containerId) {
    const container = document.getElementById(containerId);
    
    if (!leaves || leaves.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 20px; color: var(--secondary-color);">No leave requests found</p>';
        return;
    }

    container.innerHTML = leaves.map(leave => `
        <div class="leave-item">
            <div class="leave-header">
                <div class="leave-info">
                    <h4>${new Date(leave.startDate).toLocaleDateString()} - ${new Date(leave.endDate).toLocaleDateString()}</h4>
                    <p>${leave.reason}</p>
                </div>
                <span class="leave-status status-${leave.status}">${leave.status.toUpperCase()}</span>
            </div>
            <div class="leave-details">
                <p>Applied on: ${new Date(leave.createdAt).toLocaleDateString()}</p>
                ${leave.approvalNotes ? `<p>Notes: ${leave.approvalNotes}</p>` : ''}
            </div>
        </div>
    `).join('');
}

// Centers
async function loadCenters() {
    try {
        const response = await fetch(`${API_URL}/centers`);
        const data = await response.json();
        
        if (response.ok) {
            // Populate register form
            const select = document.getElementById('regCenter');
            select.innerHTML = data.centers.map(c => 
                `<option value="${c._id}">${c.name} - ${c.city}</option>`
            ).join('');
            
            // Display in centers section if admin
            if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'manager')) {
                displayCenters(data.centers);
            }
        }
    } catch (error) {
        console.error('Failed to load centers:', error);
    }
}

function displayCenters(centers) {
    const container = document.getElementById('centersList');
    
    if (!centers || centers.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 20px; color: var(--secondary-color);">No centers found</p>';
        return;
    }

    container.innerHTML = centers.map(center => `
        <div class="center-item">
            <div class="center-header">
                <div class="center-info">
                    <h4>${center.name}</h4>
                    <p>${center.address}, ${center.city}, ${center.state} - ${center.pincode}</p>
                    <p style="margin-top: 8px; color: var(--secondary-color);">
                        📧 ${center.contactEmail} | 📱 ${center.contactPhone}
                    </p>
                </div>
                <span class="leave-status ${center.isActive ? 'status-approved' : 'status-rejected'}">
                    ${center.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
            </div>
        </div>
    `).join('');
}

function showCenterForm() {
    document.getElementById('centerFormCard').style.display = 'block';
}

function hideCenterForm() {
    document.getElementById('centerFormCard').style.display = 'none';
    document.getElementById('centerForm').reset();
}

async function handleCenterSubmit(e) {
    e.preventDefault();
    
    const centerData = {
        name: document.getElementById('centerName').value,
        address: document.getElementById('centerAddress').value,
        city: document.getElementById('centerCity').value,
        state: document.getElementById('centerState').value,
        pincode: document.getElementById('centerPincode').value,
        contactEmail: document.getElementById('centerEmail').value,
        contactPhone: document.getElementById('centerPhone').value
    };

    try {
        const response = await fetch(`${API_URL}/centers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(centerData)
        });

        const data = await response.json();
        
        if (response.ok) {
            showToast('Center added successfully!', 'success');
            hideCenterForm();
            loadCenters();
        } else {
            showToast(data.error || 'Failed to add center', 'error');
        }
    } catch (error) {
        showToast('Failed to add center', 'error');
    }
}

// Leave Approvals
async function loadApprovals() {
    const status = document.getElementById('approvalFilter').value;
    
    try {
        const response = await fetch(`${API_URL}/leaves/all${status ? '?status=' + status : ''}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        const data = await response.json();
        
        if (response.ok) {
            displayApprovals(data.leaves);
        }
    } catch (error) {
        showToast('Failed to load leave requests', 'error');
    }
}

function displayApprovals(leaves) {
    const container = document.getElementById('approvalsList');
    
    if (!leaves || leaves.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 20px; color: var(--secondary-color);">No leave requests found</p>';
        return;
    }

    container.innerHTML = leaves.map(leave => `
        <div class="approval-item">
            <div class="approval-header">
                <div class="approval-info">
                    <h4>${leave.userId.name} (${leave.userId.email})</h4>
                    <p><strong>Dates:</strong> ${new Date(leave.startDate).toLocaleDateString()} - ${new Date(leave.endDate).toLocaleDateString()}</p>
                    <p><strong>Reason:</strong> ${leave.reason}</p>
                </div>
                <span class="approval-status status-${leave.status}">${leave.status.toUpperCase()}</span>
            </div>
            <div class="approval-details">
                <p>Applied on: ${new Date(leave.createdAt).toLocaleDateString()}</p>
                ${leave.approvalNotes ? `<p>Notes: ${leave.approvalNotes}</p>` : ''}
            </div>
            ${leave.status === 'pending' ? `
                <div class="approval-actions">
                    <button class="btn btn-success btn-sm" onclick="approveLeave('${leave._id}')">Approve</button>
                    <button class="btn btn-danger btn-sm" onclick="rejectLeave('${leave._id}')">Reject</button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

async function approveLeave(leaveId) {
    const notes = prompt('Enter approval notes (optional):');
    await updateLeaveStatus(leaveId, 'approved', notes);
}

async function rejectLeave(leaveId) {
    const notes = prompt('Enter rejection reason:');
    if (!notes) {
        showToast('Rejection reason is required', 'error');
        return;
    }
    await updateLeaveStatus(leaveId, 'rejected', notes);
}

async function updateLeaveStatus(leaveId, status, notes) {
    try {
        const response = await fetch(`${API_URL}/leaves/${leaveId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ status, approvalNotes: notes })
        });

        const data = await response.json();
        
        if (response.ok) {
            showToast(`Leave ${status} successfully!`, 'success');
            loadApprovals();
        } else {
            showToast(data.error || 'Failed to update leave status', 'error');
        }
    } catch (error) {
        showToast('Failed to update leave status', 'error');
    }
}

// Utility functions
function updateCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = new Date().toLocaleDateString('en-US', options);
    }
}

function populateMonthYearSelectors() {
    const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');
    
    if (!monthSelect || !yearSelect) return;
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    monthSelect.innerHTML = months.map((month, index) => 
        `<option value="${index}" ${index === currentMonth ? 'selected' : ''}>${month}</option>`
    ).join('');
    
    for (let year = currentYear; year >= currentYear - 5; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        if (year === currentYear) option.selected = true;
        yearSelect.appendChild(option);
    }
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
