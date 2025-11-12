# Tech Zolo - Deployment Package Creator
# This script creates a deployment-ready package for cPanel

Write-Host "Creating Tech Zolo Deployment Package..." -ForegroundColor Green

$deploymentDir = "tech-zolo-deployment-package-zipped"
$zipFile = "tech-zolo-deployment-package.zip"

# Remove old deployment directory if exists
if (Test-Path $deploymentDir) {
    Write-Host "Cleaning old deployment directory..." -ForegroundColor Yellow
    Remove-Item -Path $deploymentDir -Recurse -Force
}

# Create new deployment directory
New-Item -ItemType Directory -Path $deploymentDir -Force | Out-Null
Write-Host "Created deployment directory: $deploymentDir" -ForegroundColor Green

# Files and directories to include
$includeItems = @(
    "app",
    "components",
    "hooks",
    "lib",
    "public",
    "server.js",
    "next.config.mjs",
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "postcss.config.mjs",
    "components.json",
    "next-env.d.ts",
    ".htaccess",
    "CPANEL_DEPLOYMENT_GUIDE.md",
    "QUICK_START.md",
    "DEPLOYMENT_CHECKLIST.md",
    "DEPLOYMENT_SUMMARY.md",
    "ENV_TEMPLATE.txt"
)

Write-Host "`nCopying files..." -ForegroundColor Cyan

foreach ($item in $includeItems) {
    if (Test-Path $item) {
        $destPath = Join-Path $deploymentDir $item
        $destParent = Split-Path $destPath -Parent
        
        if (-not (Test-Path $destParent)) {
            New-Item -ItemType Directory -Path $destParent -Force | Out-Null
        }
        
        Copy-Item -Path $item -Destination $destPath -Recurse -Force
        Write-Host "  [OK] Copied: $item" -ForegroundColor Gray
    } else {
        Write-Host "  [SKIP] Not found: $item" -ForegroundColor Yellow
    }
}

Write-Host "`n[OK] All files copied successfully!" -ForegroundColor Green

# Remove old zip if exists
if (Test-Path $zipFile) {
    Remove-Item -Path $zipFile -Force
    Write-Host "Removed old zip file" -ForegroundColor Yellow
}

# Create zip file
Write-Host "`nCreating zip file..." -ForegroundColor Cyan
Compress-Archive -Path "$deploymentDir\*" -DestinationPath $zipFile -Force

$zipSize = (Get-Item $zipFile).Length / 1MB
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Deployment package created successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Package: $zipFile" -ForegroundColor White
Write-Host "Size: $([math]::Round($zipSize, 2)) MB" -ForegroundColor White
Write-Host "`nReady for deployment!" -ForegroundColor Green
