# Tech Zolo - Quick Deployment Reference

## 🚀 Quick Start (5-Minute Guide)

### 1. Build Locally
```bash
npm install
npm run build
```

### 2. Upload to cPanel
- Upload all files EXCEPT `node_modules/` and `.next/`
- Include `server.js`, `package.json`, and all source files

### 3. Configure in cPanel
1. **Node.js Selector** → Create Application
   - Startup file: `server.js`
   - Node version: 18.x or 20.x
   
2. **Add Environment Variables**:
   ```
   NODE_ENV=production
   PORT=<auto-assigned>
   NEXTAUTH_URL=https://yourdomain.com
   JWT_SECRET=<generate-strong-secret>
   DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
   ```

3. **Install & Build**:
   ```bash
   npm install --production
   npm run build
   ```

4. **Start Application** → Click "Restart App"

### 4. Test
Visit: `https://yourdomain.com`

---

## 📋 Required Environment Variables

Copy these to your cPanel environment variables:

```env
NODE_ENV=production
NEXTAUTH_URL=https://yourdomain.com
JWT_SECRET=your-strong-secret-here
DATABASE_URL=postgresql://username:password@localhost:5432/database
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-key
RAZORPAY_KEY_SECRET=your-secret
```

---

## 🔧 Common Commands

```bash
# Install dependencies
npm install --production

# Build application
npm run build

# Check logs
tail -f logs/passenger.log

# Restart app (via cPanel or)
touch tmp/restart.txt
```

---

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| 502 Bad Gateway | Check app is running, verify PORT |
| Database error | Verify DATABASE_URL format |
| Static files 404 | Check public/ directory uploaded |
| Build fails | Check Node.js version (18.x+) |

---

For detailed instructions, see `CPANEL_DEPLOYMENT_GUIDE.md`

