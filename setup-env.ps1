# PowerShell script to create .env.local file
# Run this script in your project directory

$envContent = @"
# Database Configuration for TodoBloom
DATABASE_URL="mysql://webappss_arafat:arafat330$$@49.12.82.48:3306/webappss_commonDB"

# Alternative with SSL if needed:
# DATABASE_URL="mysql://webappss_arafat:arafat330$$@49.12.82.48:3306/webappss_commonDB?sslaccept=strict"
"@

# Create .env.local file
$envContent | Out-File -FilePath ".env.local" -Encoding UTF8

Write-Host "✅ .env.local file created successfully!" -ForegroundColor Green
Write-Host "📝 File contents:" -ForegroundColor Yellow
Get-Content ".env.local" | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }

Write-Host "`n🚀 Next steps:" -ForegroundColor Cyan
Write-Host "1. Test database connection: npm run db:push" -ForegroundColor White
Write-Host "2. Seed database: npm run db:seed" -ForegroundColor White
Write-Host "3. Start app: npm run dev" -ForegroundColor White
