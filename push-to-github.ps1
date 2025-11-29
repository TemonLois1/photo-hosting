# Push Project to GitHub
# Usage: .\push-to-github.ps1

Write-Host "Uploading to GitHub..." -ForegroundColor Cyan

$gitCheck = Get-Command git -ErrorAction SilentlyContinue
if ($null -eq $gitCheck) {
    Write-Host "Error: Git not installed" -ForegroundColor Red
    Write-Host "Download from: https://git-scm.com" -ForegroundColor Yellow
    exit 1
}

Write-Host "Git found" -ForegroundColor Green
$repoUrl = Read-Host "Enter GitHub repository URL"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "Error: URL required" -ForegroundColor Red
    exit 1
}

Set-Location d:\project\three

git init
git config user.name "Developer"
git config user.email "dev@example.com"
git add .
git commit -m "Initial commit: Photo hosting platform"

git remote add origin $repoUrl
git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS! Repository uploaded:" -ForegroundColor Green
    Write-Host $repoUrl -ForegroundColor Cyan
} else {
    Write-Host "Error during push" -ForegroundColor Red
    Write-Host "Generate token at: https://github.com/settings/tokens/new" -ForegroundColor Yellow
}
