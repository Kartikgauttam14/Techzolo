# Tech Zolo - cPanel Deployment Checklist

Use this checklist to ensure a smooth deployment process.

## Pre-Deployment

- [ ] Project builds successfully locally (`npm run build`)
- [ ] All environment variables are documented
- [ ] Database schema is ready (PostgreSQL or SQLite)
- [ ] SSL certificate is available or can be installed
- [ ] Domain/subdomain is configured in cPanel

## File Preparation

- [ ] `server.js` is in the root directory
- [ ] `next.config.mjs` has `output: 'standalone'` configured
- [ ] `package.json` has correct start script
- [ ] `.env.local` file is prepared (but not uploaded)
- [ ] All source files are ready (app/, components/, lib/, etc.)
- [ ] `public/` directory with all static assets
- [ ] `node_modules/` and `.next/` are excluded from upload

## cPanel Configuration

- [ ] Node.js application created in cPanel
- [ ] Node.js version selected (18.x or 20.x LTS)
- [ ] Application startup file set to `server.js`
- [ ] Application port noted (for .htaccess if needed)
- [ ] All environment variables added in cPanel
- [ ] Database created (PostgreSQL or SQLite ready)

## File Upload

- [ ] All project files uploaded to server
- [ ] File permissions set correctly (755 for directories, 644 for files)
- [ ] `server.js` is executable (755)
- [ ] `.env.local` created on server with correct values

## Dependencies & Build

- [ ] Dependencies installed (`npm install --production`)
- [ ] Application built (`npm run build`)
- [ ] No build errors
- [ ] `.next/standalone/` directory exists after build

## Application Start

- [ ] Application started via Node.js Selector
- [ ] Application status shows "Running"
- [ ] No errors in application logs
- [ ] Port is accessible

## Testing

- [ ] Homepage loads correctly
- [ ] API endpoint responds (`/api`)
- [ ] User registration works
- [ ] User login works
- [ ] Database connection successful
- [ ] Static assets load (images, CSS, JS)
- [ ] All pages are accessible
- [ ] No console errors in browser

## Security

- [ ] SSL certificate installed
- [ ] HTTPS redirect configured
- [ ] `.env.local` is not publicly accessible
- [ ] Strong JWT_SECRET is set
- [ ] Database credentials are secure
- [ ] File permissions are restrictive

## Post-Deployment

- [ ] Error logging is working
- [ ] Application logs are accessible
- [ ] Backup strategy is in place
- [ ] Monitoring is set up (if applicable)
- [ ] Documentation is updated

## Troubleshooting Notes

Document any issues encountered and their solutions:

```
Issue: 
Solution: 

Issue: 
Solution: 
```

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Domain**: _______________
**Node.js Version**: _______________
**Application Port**: _______________

