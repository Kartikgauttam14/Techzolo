// cPanel Node.js Application Entry Point
// This file is required for cPanel to run your Next.js application

const { createServer } = require('http');
const { parse } = require('url');
const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || '0.0.0.0';

// Check if standalone build exists (production)
const standalonePath = path.join(__dirname, '.next', 'standalone');
const standaloneServerPath = path.join(standalonePath, 'server.js');

if (fs.existsSync(standaloneServerPath)) {
  // Use standalone build (production)
  console.log('> Using standalone build');
  process.chdir(standalonePath);
  require('./server.js');
} else {
  // Use development mode with Next.js
  console.log('> Using development mode');
  const next = require('next');
  
  const dev = process.env.NODE_ENV !== 'production';
  const app = next({ dev, hostname, port });
  const handle = app.getRequestHandler();

  app.prepare().then(() => {
    createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        res.statusCode = 500;
        res.end('internal server error');
      }
    }).listen(port, hostname, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  });
}

