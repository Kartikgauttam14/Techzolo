#!/usr/bin/env python3
"""
Install all required Python dependencies for the Tech Zolo backend
"""

import subprocess
import sys

def install_package(package):
    """Install a package using pip"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        return True
    except subprocess.CalledProcessError:
        return False

def main():
    print("📦 Installing Tech Zolo Backend Dependencies...")
    print("-" * 50)
    
    # List of required packages
    packages = [
        "fastapi",
        "uvicorn[standard]",
        "python-multipart",
        "bcrypt",
        "python-jose[cryptography]",
        "python-dotenv"
    ]
    
    failed_packages = []
    
    for package in packages:
        print(f"Installing {package}...")
        if install_package(package):
            print(f"✅ {package} installed successfully")
        else:
            print(f"❌ Failed to install {package}")
            failed_packages.append(package)
    
    print("-" * 50)
    
    if failed_packages:
        print(f"❌ Failed to install: {', '.join(failed_packages)}")
        print("Please install them manually using:")
        for package in failed_packages:
            print(f"   pip install {package}")
        return 1
    else:
        print("✅ All dependencies installed successfully!")
        print("\n🚀 You can now start the backend server with:")
        print("   python scripts/start_backend.py")
        return 0

if __name__ == "__main__":
    sys.exit(main())
