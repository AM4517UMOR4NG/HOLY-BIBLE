# Test Registration Script
$body = @{
    email = "testuser$(Get-Date -Format 'yyyyMMddHHmmss')@example.com"
    password = "Test1234"
    name = "Test User"
} | ConvertTo-Json

Write-Host "Testing Registration..." -ForegroundColor Cyan
Write-Host "Request Body:" -ForegroundColor Yellow
Write-Host $body

try {
    $response = Invoke-RestMethod -Uri "http://localhost:4000/auth/register" -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "`nSuccess!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Yellow
    $response | ConvertTo-Json -Depth 10
}
catch {
    Write-Host "`nError!" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
    
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $responseBody = $reader.ReadToEnd()
    
    Write-Host "Error Details:" -ForegroundColor Yellow
    $responseBody | ConvertFrom-Json | ConvertTo-Json -Depth 10
}
