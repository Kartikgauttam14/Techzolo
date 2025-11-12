# Tech Zolo Deployment Package

## Files Included:
1. `.next/` - Built Next.js application
2. `public/` - Static assets
3. `package.json` - Dependencies
4. `package-lock.json` - Locked dependencies
5. `.env.production` - Production environment variables
6. `techzolo.db` - SQLite database
7. `next.config.mjs` - Next.js configuration

## Deployment Instructions:
1. Upload all files to your cPanel file manager
2. Place in public_html or subdomain directory
3. Configure Node.js in cPanel
4. Set up environment variables
5. Start the application

## Post-Deployment:
- Database will be auto-created if not exists
- Email functionality requires Gmail App Password
- Razorpay keys needed for payments
- GoDaddy API keys needed for domain search