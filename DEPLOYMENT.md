# Deployment Guide - Teacher Attendance System

## Prerequisites

### Required Software
- Node.js v14+ (v20 recommended)
- MongoDB v4.4+ (v6+ recommended)
- npm v6+ (v10+ recommended)
- Git

### Recommended for Production
- Nginx or Apache (reverse proxy)
- PM2 or similar process manager
- SSL certificate (Let's Encrypt recommended)
- Cloud hosting (AWS, Azure, DigitalOcean, Heroku, etc.)

## Local Development Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/Mishra-Aniket/skills-introduction-to-github.git
cd skills-introduction-to-github

# Install dependencies
npm install
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings
nano .env  # or use your preferred editor
```

**Required Configuration:**
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/teacher_attendance
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@attendance.com
ADMIN_EMAIL=admin@attendance.com
```

### 3. Start MongoDB

```bash
# On Ubuntu/Debian
sudo systemctl start mongod

# On macOS with Homebrew
brew services start mongodb-community

# Or run directly
mongod
```

### 4. Run the Application

```bash
# Development mode
npm start

# Access the application
# Open http://localhost:3000 in your browser
```

## Production Deployment

### Option 1: Traditional Server (VPS/Dedicated)

#### 1. Server Setup (Ubuntu 22.04)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2 globally
sudo npm install -g pm2
```

#### 2. Deploy Application

```bash
# Create application directory
sudo mkdir -p /var/www/attendance
sudo chown $USER:$USER /var/www/attendance

# Clone repository
cd /var/www/attendance
git clone https://github.com/Mishra-Aniket/skills-introduction-to-github.git .

# Install dependencies
npm install --production

# Create .env file
nano .env  # Add production configuration
```

#### 3. Production .env Configuration

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/teacher_attendance
JWT_SECRET=GENERATE_STRONG_SECRET_HERE_MINIMUM_32_CHARACTERS
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
```

#### 4. Start with PM2

```bash
# Start application
pm2 start server.js --name "attendance-system"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup

# Monitor application
pm2 monit
```

#### 5. Setup Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/attendance
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/attendance /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is configured by default
# Test renewal
sudo certbot renew --dry-run
```

#### 7. Configure MongoDB Security

```bash
# Create admin user
mongosh
```

```javascript
use admin
db.createUser({
  user: "admin",
  pwd: "strong_password_here",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
})

use teacher_attendance
db.createUser({
  user: "attendance_user",
  pwd: "strong_password_here",
  roles: [ { role: "readWrite", db: "teacher_attendance" } ]
})
exit
```

```bash
# Enable authentication
sudo nano /etc/mongod.conf
```

Add:
```yaml
security:
  authorization: enabled
```

```bash
# Restart MongoDB
sudo systemctl restart mongod

# Update .env with authenticated connection
MONGODB_URI=mongodb://attendance_user:strong_password_here@localhost:27017/teacher_attendance
```

### Option 2: Heroku Deployment

#### 1. Prepare Application

```bash
# Login to Heroku
heroku login

# Create new app
heroku create your-attendance-app

# Add MongoDB addon
heroku addons:create mongolab:sandbox
```

#### 2. Configure Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-key
heroku config:set EMAIL_HOST=smtp.gmail.com
heroku config:set EMAIL_PORT=587
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASSWORD=your-password
heroku config:set EMAIL_FROM=noreply@yourdomain.com
heroku config:set ADMIN_EMAIL=admin@yourdomain.com
```

#### 3. Create Procfile

```bash
echo "web: node server.js" > Procfile
```

#### 4. Deploy

```bash
git push heroku main
heroku open
```

### Option 3: Docker Deployment

#### 1. Create Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

#### 2. Create docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/teacher_attendance
      - JWT_SECRET=${JWT_SECRET}
      - EMAIL_HOST=${EMAIL_HOST}
      - EMAIL_PORT=${EMAIL_PORT}
      - EMAIL_USER=${EMAIL_USER}
      - EMAIL_PASSWORD=${EMAIL_PASSWORD}
      - EMAIL_FROM=${EMAIL_FROM}
      - ADMIN_EMAIL=${ADMIN_EMAIL}
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:6
    volumes:
      - mongo-data:/data/db
    restart: unless-stopped

volumes:
  mongo-data:
```

#### 3. Deploy

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Post-Deployment Setup

### 1. Create First Admin User

1. Access the application
2. Click "Register"
3. Fill in admin details
4. Select "Admin" role
5. Important: Create at least one center first!

### 2. Create Centers

1. Login as admin
2. Navigate to "Centers" section
3. Click "Add Center"
4. Fill in center details

### 3. Test Email Configuration

1. Apply for a leave
2. Check if email is received
3. If not, verify SMTP settings

### 4. Test Geolocation

1. Mark attendance
2. Verify location is captured
3. Allow browser location permissions

## Monitoring & Maintenance

### Application Monitoring

```bash
# PM2 monitoring
pm2 monit
pm2 logs attendance-system

# Check status
pm2 status
```

### Database Backups

```bash
# Create backup script
sudo nano /usr/local/bin/backup-attendance.sh
```

```bash
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/mongodb"
mkdir -p $BACKUP_DIR

mongodump --db teacher_attendance --out $BACKUP_DIR/backup_$TIMESTAMP
find $BACKUP_DIR -mtime +7 -delete
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-attendance.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
0 2 * * * /usr/local/bin/backup-attendance.sh
```

### Log Rotation

```bash
# Configure PM2 log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## Troubleshooting

### Application Won't Start

```bash
# Check logs
pm2 logs attendance-system --lines 100

# Check if port is in use
sudo lsof -i :3000

# Restart application
pm2 restart attendance-system
```

### MongoDB Connection Issues

```bash
# Check MongoDB status
sudo systemctl status mongod

# View MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Restart MongoDB
sudo systemctl restart mongod
```

### Email Not Sending

1. Verify SMTP credentials in .env
2. Check if using Gmail: Enable "Less secure app access" or use App Password
3. Check firewall rules for outbound port 587/465
4. Review server logs for email errors

### Geolocation Not Working

1. Ensure HTTPS is enabled (required for geolocation in production)
2. Check browser permissions
3. Verify SSL certificate is valid

## Security Checklist

- [ ] Change default JWT_SECRET to strong random string
- [ ] Enable MongoDB authentication
- [ ] Configure firewall (UFW/iptables)
- [ ] Setup SSL/HTTPS
- [ ] Configure secure headers (Helmet.js)
- [ ] Regular security updates
- [ ] Implement backup strategy
- [ ] Monitor application logs
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Regular dependency updates

## Performance Optimization

### 1. Enable MongoDB Indexes

```javascript
// Already implemented in models, but verify:
mongosh teacher_attendance
db.attendances.createIndex({ userId: 1, date: 1 }, { unique: true })
db.users.createIndex({ email: 1 }, { unique: true })
```

### 2. Enable Nginx Caching

```nginx
# Add to Nginx config
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m;

location / {
    proxy_cache my_cache;
    proxy_cache_valid 200 10m;
    # ... other proxy settings
}
```

### 3. PM2 Cluster Mode

```bash
pm2 start server.js -i max --name "attendance-system"
```

## Scaling Considerations

### Horizontal Scaling
- Use MongoDB replica sets
- Implement Redis for session management
- Use load balancer (Nginx, HAProxy)

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching strategy

---

**For Support:** Refer to ATTENDANCE_SYSTEM_README.md and SECURITY.md

**Last Updated:** November 2025
