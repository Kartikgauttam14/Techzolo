# Tech Zolo - cPanel Deployment Guide

This guide provides step-by-step instructions for deploying the Tech Zolo Next.js application on cPanel as a Node.js application.

## 📋 Prerequisites

Before starting the deployment, ensure you have:
- ✅ cPanel hosting account with Node.js support enabled
- ✅ Access to cPanel File Manager or FTP/SFTP
- ✅ SSH access (recommended, but not required)
- ✅ PostgreSQL database (or SQLite will be used as fallback)
- ✅ Domain name configured in cPanel
- ✅ Environment variables ready (see Environment Variables section)

---

## 🔍 Project Analysis

### Technology Stack
- **Framework**: Next.js 14.2.16 (React 18)
- **Language**: TypeScript
- **Database**: PostgreSQL (with SQLite fallback)
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Gateway**: Razorpay
- **Email Service**: Nodemailer / EmailJS
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI, Shadcn UI

### Key Features
- User authentication (Login/Signup)
- User profile management
- Domain search integration (GoDaddy API)
- Payment processing (Razorpay)
- Contact form with email notifications
- Dashboard interface
- Responsive design

### Project Structure
```
tech-zolo/
├── app/                    # Next.js app directory (pages & API routes)
├── components/             # React components
├── lib/                    # Utility functions & database
├── public/                 # Static assets
├── server.js              # cPanel entry point
├── next.config.mjs        # Next.js configuration
├── package.json           # Dependencies
└── .env.local            # Environment variables (create this)
```

---

## 📦 Step 1: Prepare Your Project Locally

### 1.1 Install Dependencies
```bash
npm install
```

### 1.2 Create Environment Variables File
Create a `.env.local` file in the root directory with the following variables:

```env
# Application Configuration
NODE_ENV=production
PORT=3000
HOSTNAME=localhost
NEXTAUTH_URL=https://yourdomain.com

# JWT Secret (Generate a strong random string)
# Generate using: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Database Configuration
# Option 1: PostgreSQL (Recommended for production)
DATABASE_URL=postgresql://username:password@localhost:5432/techzolo

# Option 2: SQLite (Fallback - will be used if DATABASE_URL is not set)
# SQLite database file will be created automatically as techzolo.db

# Email Configuration (for Nodemailer)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_SECURE=false
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# EmailJS Configuration (Alternative email service)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your-emailjs-service-id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your-emailjs-template-id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your-emailjs-public-key
```

### 1.3 Build the Project
```bash
npm run build
```

This will create a `.next` directory with the production build. The `standalone` output will be in `.next/standalone/`.

---

## 🚀 Step 2: Upload Files to cPanel

### 2.1 Access cPanel File Manager
1. Log in to your cPanel account
2. Navigate to **File Manager**
3. Go to your domain's root directory (usually `public_html` or a subdomain folder)

### 2.2 Upload Project Files
You have two options:

#### Option A: Upload via File Manager (Small projects)
1. Create a new folder (e.g., `tech-zolo` or use root)
2. Upload all project files EXCEPT:
   - `node_modules/` (will be installed on server)
   - `.next/` (will be built on server)
   - `.git/`
   - `*.log` files
   - `.env.local` (create on server)

#### Option B: Upload via SSH/SCP (Recommended)
```bash
# Compress your project (excluding node_modules and .next)
tar -czf tech-zolo-deploy.tar.gz \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.git' \
  --exclude='*.log' \
  --exclude='.env.local' \
  .

# Upload via SCP
scp tech-zolo-deploy.tar.gz username@yourdomain.com:/home/username/

# SSH into your server
ssh username@yourdomain.com

# Extract in your domain directory
cd ~/public_html  # or your subdomain directory
tar -xzf ~/tech-zolo-deploy.tar.gz
```

### 2.3 Required Files to Upload
Make sure these files are uploaded:
- ✅ `package.json`
- ✅ `package-lock.json`
- ✅ `next.config.mjs`
- ✅ `tsconfig.json`
- ✅ `server.js` (cPanel entry point)
- ✅ `app/` directory
- ✅ `components/` directory
- ✅ `lib/` directory
- ✅ `public/` directory
- ✅ `hooks/` directory
- ✅ `postcss.config.mjs`
- ✅ `components.json`
- ✅ All other config files

---

## ⚙️ Step 3: Configure Node.js Application in cPanel

### 3.1 Access Node.js Selector
1. In cPanel, find **"Node.js Selector"** or **"Setup Node.js App"**
2. Click on it to open the Node.js application manager

### 3.2 Create New Node.js Application
1. Click **"Create Application"** or **"Add Application"**
2. Fill in the following details:
   - **Node.js version**: Select the latest LTS version (18.x or 20.x recommended)
   - **Application mode**: Production
   - **Application root**: `/home/username/public_html` (or your subdomain path)
   - **Application URL**: Select your domain or subdomain
   - **Application startup file**: `server.js`
   - **Application port**: Leave default (cPanel will assign)
   - **Passenger log file**: (optional) `logs/passenger.log`

3. Click **"Create"**

### 3.3 Configure Environment Variables
1. In the Node.js application settings, find **"Environment Variables"** or **"App Settings"**
2. Add all environment variables from your `.env.local` file:
   ```
   NODE_ENV=production
   PORT=<assigned-port>
   NEXTAUTH_URL=https://yourdomain.com
   JWT_SECRET=your-jwt-secret
   DATABASE_URL=postgresql://...
   EMAIL_SERVER_HOST=smtp.gmail.com
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=your-email@gmail.com
   EMAIL_SERVER_PASSWORD=your-password
   EMAIL_FROM=your-email@gmail.com
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your-key
   RAZORPAY_KEY_SECRET=your-secret
   ```
   **Note**: The `PORT` will be automatically set by cPanel - don't override it.

3. Save the environment variables

---

## 📦 Step 4: Install Dependencies on Server

### 4.1 Via SSH (Recommended)
```bash
# Navigate to your application directory
cd ~/public_html  # or your application root

# Install dependencies
npm install --production

# If you need to build on server
npm run build
```

### 4.2 Via cPanel Terminal
1. Open **Terminal** in cPanel
2. Navigate to your application directory
3. Run:
```bash
npm install --production
npm run build
```

### 4.3 Via Node.js Selector
Some cPanel versions allow installing dependencies directly:
1. In Node.js Selector, find your application
2. Click **"Run NPM Install"** or similar option
3. Wait for installation to complete

---

## 🗄️ Step 5: Database Setup

### Option A: PostgreSQL (Recommended)
1. In cPanel, go to **PostgreSQL Databases**
2. Create a new database (e.g., `username_techzolo`)
3. Create a database user and assign privileges
4. Update your `DATABASE_URL` in environment variables:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/username_techzolo
   ```
5. Run database migrations if needed (check `scripts/` directory)

### Option B: SQLite (Fallback)
- SQLite will be used automatically if `DATABASE_URL` is not set
- The database file `techzolo.db` will be created automatically
- Ensure the application directory has write permissions

---

## 🔧 Step 6: Configure File Permissions

Set proper file permissions via SSH or File Manager:

```bash
# Navigate to application directory
cd ~/public_html

# Set directory permissions
find . -type d -exec chmod 755 {} \;

# Set file permissions
find . -type f -exec chmod 644 {} \;

# Make server.js executable
chmod 755 server.js

# If using SQLite, ensure database directory is writable
chmod 775 .
chmod 664 techzolo.db  # if exists
```

---

## 🚀 Step 7: Start/Restart Application

### 7.1 Via Node.js Selector
1. Find your application in the Node.js Selector
2. Click **"Restart App"** or **"Start App"**
3. Wait for the application to start

### 7.2 Via SSH
```bash
# If using Passenger (common in cPanel)
touch tmp/restart.txt

# Or restart via Node.js Selector interface
```

---

## ✅ Step 8: Verify Deployment

### 8.1 Check Application Status
1. Visit your domain: `https://yourdomain.com`
2. Check if the application loads correctly
3. Test the API endpoint: `https://yourdomain.com/api`

### 8.2 Check Logs
1. In Node.js Selector, click **"View Logs"**
2. Check for any errors in:
   - Application logs
   - Error logs
   - Passenger logs (if applicable)

### 8.3 Common Issues & Solutions

#### Issue: Application won't start
- **Solution**: Check `server.js` is in the root directory
- **Solution**: Verify Node.js version compatibility
- **Solution**: Check environment variables are set correctly

#### Issue: 502 Bad Gateway
- **Solution**: Ensure the application is running
- **Solution**: Check PORT environment variable matches cPanel assignment
- **Solution**: Verify file permissions

#### Issue: Database connection errors
- **Solution**: Verify `DATABASE_URL` is correct
- **Solution**: Check database user permissions
- **Solution**: Ensure database exists

#### Issue: Static files not loading
- **Solution**: Verify `public/` directory is uploaded
- **Solution**: Check file permissions on public directory

---

## 🔒 Step 9: Security Considerations

### 9.1 Environment Variables
- ✅ Never commit `.env.local` to version control
- ✅ Use strong, unique values for `JWT_SECRET`
- ✅ Keep database credentials secure

### 9.2 SSL Certificate
1. In cPanel, go to **SSL/TLS Status**
2. Install an SSL certificate (Let's Encrypt is free)
3. Force HTTPS redirects in your application

### 9.3 File Permissions
- ✅ Set restrictive permissions on sensitive files
- ✅ Don't allow public access to `.env.local`
- ✅ Protect database files

---

## 📝 Step 10: Post-Deployment Checklist

- [ ] Application is accessible via domain
- [ ] All environment variables are set
- [ ] Database connection is working
- [ ] User registration/login works
- [ ] API endpoints are responding
- [ ] Static assets (images, CSS) are loading
- [ ] SSL certificate is installed
- [ ] Error logging is configured
- [ ] Backup strategy is in place

---

## 🔄 Updating the Application

When you need to update your application:

1. **Upload new files** (excluding `node_modules` and `.next`)
2. **SSH into server** and navigate to application directory
3. **Install new dependencies** (if any):
   ```bash
   npm install --production
   ```
4. **Rebuild the application**:
   ```bash
   npm run build
   ```
5. **Restart the application** via Node.js Selector

---

## 📞 Support & Troubleshooting

### Useful Commands
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# View application logs
tail -f logs/passenger.log

# Check if application is running
ps aux | grep node

# Test database connection
node -e "require('./lib/server/db').query('SELECT 1')"
```

### Common cPanel Paths
- Application root: `/home/username/public_html`
- Logs: `/home/username/logs/`
- Node.js apps: `/home/username/nodevenv/`

---

## 📚 Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [cPanel Node.js Documentation](https://docs.cpanel.net/knowledge-base/web-services/guide-to-the-node-js-selector/)
- [PostgreSQL cPanel Guide](https://docs.cpanel.net/knowledge-base/databases/guide-to-postgresql-databases/)

---

## 🎉 Deployment Complete!

Your Tech Zolo application should now be live on cPanel. If you encounter any issues, refer to the troubleshooting section or check the application logs.

**Last Updated**: 2024
**Project Version**: 0.1.0

