#!/usr/bin/env python3
"""
Simple script to start the FastAPI backend server
Run this script to start the backend on http://localhost:8000
"""

import subprocess
import sys
import os
from pathlib import Path

def main():
    # Get the directory where this script is located
    script_dir = Path(__file__).parent
    backend_file = script_dir / "backend_api.py"
    
    if not backend_file.exists():
        print("❌ Error: backend_api.py not found!")
        print(f"Expected location: {backend_file}")
        return 1
    
    print("🚀 Starting Tech Zolo Backend Server...")
    print("📍 Server will be available at: http://localhost:8000")
    print("📊 API Documentation: http://localhost:8000/docs")
    print("🛑 Press Ctrl+C to stop the server")
    print("-" * 50)
    
    # Define the log file path
    log_file_path = script_dir / "backend_log.txt"
    
    try:
        with open(log_file_path, "w") as log_file:
            # Start the FastAPI server using uvicorn
            subprocess.run([
                sys.executable, "-m", "uvicorn", 
                "backend_api:app", 
                "--host", "0.0.0.0", 
                "--port", "8000", 
                "--reload",
                "--log-level", "info"
            ], cwd=script_dir, check=True, stdout=log_file, stderr=subprocess.STDOUT)
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        return 0
    except subprocess.CalledProcessError as e:
        print(f"❌ Error starting server: {e}")
        print("\n💡 Make sure you have installed the required dependencies:")
        print("   pip install fastapi uvicorn python-multipart bcrypt python-jose[cryptography] sqlite3")
        return 1
    except FileNotFoundError:
        print("❌ Error: uvicorn not found!")
        print("\n💡 Install uvicorn with: pip install uvicorn")
        return 1

if __name__ == "__main__":
    sys.exit(main())
