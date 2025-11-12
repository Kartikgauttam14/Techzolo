# Tech Zolo Backend Setup

## Quick Start

1. **Install Dependencies:**
   \`\`\`bash
   python scripts/install_dependencies.py
   \`\`\`
   
   Or manually:
   \`\`\`bash
   pip install -r scripts/requirements.txt
   \`\`\`

2. **Start the Backend Server:**
   \`\`\`bash
   python scripts/start_backend.py
   \`\`\`

3. **Verify the Server:**
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
   - Health Check: http://localhost:8000/

## Environment Variables

The frontend expects the backend to run on `http://localhost:8000` by default.

If you need to change the port, update the `NEXT_PUBLIC_API_URL` environment variable in your Vercel project settings.

## Troubleshooting

### "Connection Failed" Error
- Make sure the Python backend is running on port 8000
- Check that no firewall is blocking the connection
- Verify the `NEXT_PUBLIC_API_URL` environment variable is set correctly

### "Module not found" Error
- Run the dependency installation script again
- Make sure you're using Python 3.8 or higher

### Database Issues
- The SQLite database will be created automatically
- Database file location: `scripts/tech_zolo.db`
- To reset the database, delete the file and restart the server
