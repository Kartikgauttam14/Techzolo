#!/bin/bash
# Tech Zolo Deployment Script for cPanel

echo "🚀 Starting Tech Zolo Deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Build the project
echo "🔨 Building project..."
npm run build

# Set proper permissions
echo "🔒 Setting permissions..."
chmod 755 -R .
chmod 644 *.json *.md
chmod 755 node_modules/.bin/next

# Create passenger startup script
echo "📝 Creating passenger startup..."
cat > app.js << 'EOF'
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
EOF

echo "✅ Deployment complete!"
echo "🌐 Your Tech Zolo app should be running at your domain"
echo "📊 Check passenger.log for any issues"