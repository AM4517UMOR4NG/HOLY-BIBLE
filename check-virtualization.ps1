# Check if virtualization is enabled
# This script does NOT require administrator privileges

Write-Host "Checking virtualization status..." -ForegroundColor Cyan
Write-Host ""

# Check if virtualization is enabled
$computerSystem = Get-WmiObject -Class Win32_ComputerSystem
$hypervisorPresent = $computerSystem.HypervisorPresent

if ($hypervisorPresent) {
    Write-Host "✓ Virtualization is ENABLED" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next step: Run enable-wsl2.ps1 as Administrator" -ForegroundColor Yellow
    Write-Host "Right-click enable-wsl2.ps1 -> 'Run with PowerShell (Admin)'" -ForegroundColor White
} else {
    Write-Host "✗ Virtualization is DISABLED" -ForegroundColor Red
    Write-Host ""
    Write-Host "You need to enable virtualization in your BIOS/UEFI settings." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Steps:" -ForegroundColor Cyan
    Write-Host "1. Restart your computer" -ForegroundColor White
    Write-Host "2. Enter BIOS/UEFI (usually by pressing F2, F10, F12, or Del during boot)" -ForegroundColor White
    Write-Host "3. Look for 'Virtualization Technology', 'Intel VT-x', or 'AMD-V'" -ForegroundColor White
    Write-Host "4. Enable it and save settings" -ForegroundColor White
    Write-Host "5. Boot back into Windows" -ForegroundColor White
    Write-Host "6. Run this script again to verify" -ForegroundColor White
}

Write-Host ""
Read-Host "Press Enter to exit"
