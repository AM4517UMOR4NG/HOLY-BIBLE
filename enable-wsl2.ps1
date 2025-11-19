# Enable WSL2 for Docker Desktop
# Run this script as Administrator

Write-Host "Enabling Windows Subsystem for Linux..." -ForegroundColor Cyan
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux -NoRestart

Write-Host "Enabling Virtual Machine Platform..." -ForegroundColor Cyan
Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform -NoRestart

Write-Host "`nFeatures enabled successfully!" -ForegroundColor Green
Write-Host "`nIMPORTANT: You must restart your computer for changes to take effect." -ForegroundColor Yellow
Write-Host "`nAfter restart:" -ForegroundColor Cyan
Write-Host "1. Start Docker Desktop" -ForegroundColor White
Write-Host "2. Open PowerShell and run: wsl --install -d Ubuntu" -ForegroundColor White
Write-Host "3. Once Ubuntu is installed, run: docker compose up -d" -ForegroundColor White

$restart = Read-Host "`nDo you want to restart now? (y/n)"
if ($restart -eq 'y') {
    Restart-Computer
}
