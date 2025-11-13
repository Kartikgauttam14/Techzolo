Start-Sleep -Seconds 2
if (Test-Path 'tech-zolo-deployment-package.zip') { 
    Remove-Item 'tech-zolo-deployment-package.zip' -Force 
}
Compress-Archive -Path 'tech-zolo-deployment-package-zipped\*' -DestinationPath 'tech-zolo-deployment-package.zip' -Force
if (Test-Path 'tech-zolo-deployment-package.zip') { 
    $size = (Get-Item 'tech-zolo-deployment-package.zip').Length / 1MB
    Write-Host "Zip created successfully! Size: $([math]::Round($size, 2)) MB" 
} else { 
    Write-Host "Zip creation failed" 
}




