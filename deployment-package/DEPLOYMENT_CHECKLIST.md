# 🚀 Tech Zolo cPanel Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Build Project
```bash
npm run build
```

### 2. Prepare Files to Upload:
- [ ] `.next/` folder (build output)
- [ ] `public/` folder (static assets)
- [ ] `package.json` & `package-lock.json`
- [ ] `next.config.mjs`
- [ ] `techzolo.db` (SQLite database)
- [ ] `deployment-package/.env.production` (configure your values)
- [ ] `deployment-package/deploy.sh` (run in cPanel terminal)

## 🌐 cPanel Setup Steps

### 1. Login to cPanel
- URL: `https://c1.serverstep.co:2083/`
- Use your hosting credentials

### 2. File Upload
- Go to **File Manager**
- Navigate to `public_html` (main domain) or create subdomain
- Upload all prepared files

### 3. Node.js Configuration
- Find **Node.js App** in cPanel
- Create new application:
  - **Application Mode**: Production
  - **Application Root**: `public_html` (or subdomain folder)
  - **Application URL**: `https://techzolo.in`
  - **Application Startup File**: `app.js` (we'll create this)
  - **Passenger Log File**: `passenger.log`

### 4. Environment Variables
Add these to Node.js app settings:
```env
NODE_ENV=production
PORT=3000
NEXTAUTH_URL=https://techzolo.in
DATABASE_URL=./techzolo.db
JWT_SECRET=your-secure-secret-here
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-gmail-app-password
EMAIL_FROM=your-email@gmail.com
```

### 5. Install Dependencies
In cPanel terminal or file manager:
```bash
cd public_html
npm install --production
```

### 6. Create Startup Script
Create `app.js` in root directory:
```javascript
const { spawn } = require('child_process');
const path = require('path');

const nextProcess = spawn('node_modules/.bin/next', ['start', '-p', process.env.PORT || 3000], {
  stdio: 'inherit',
  shell: true
});

nextProcess.on('exit', (code) => {
  console.log(`Next.js process exited with code ${code}`);
  process.exit(code);
});
```

### 7. Start Application
- Save Node.js app configuration
- Click "Start" button
- Check `passenger.log` for errors

## 🔧 Post-Deployment Configuration

### Email Setup (Gmail)
1. Enable 2-factor authentication on Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Update `EMAIL_SERVER_PASSWORD` in Node.js environment variables

### Domain Configuration
1. **DNS Settings**: Ensure A record points to your hosting IP
2. **SSL Certificate**: Enable free SSL in cPanel
3. **Redirects**: Set up www to non-www redirect

### Testing Checklist
- [ ] Homepage loads: `https://techzolo.in`
- [ ] Contact form works
- [ ] Authentication functions
- [ ] Domain search works
- [ ] Payment integration works
- [ ] Email notifications work
- [ ] Database saves data

## 🚨 Common Issues & Solutions

### Port Already in Use
- Change PORT in environment variables to 3001, 3002, etc.

### Database Errors
- Ensure `techzolo.db` has write permissions (644)
- Check SQLite is supported by hosting

### Email Not Working
- Verify Gmail App Password is correct
- Check spam folders
- Test with different email providers

### SSL Issues
- Enable AutoSSL in cPanel
- Update `NEXTAUTH_URL` to use https://

## 📞 Support
If you encounter issues:
1. Check `passenger.log` for errors
2. Verify all environment variables
3. Test locally first
4. Contact hosting support for server-specific issues

## 🎉 Success!
Once deployed, your Tech Zolo application will be live at:
**https://techzolo.in**