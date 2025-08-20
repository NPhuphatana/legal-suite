#!/usr/bin/env pwsh
$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Output = Join-Path $Root 'build'

if (Test-Path $Output) { Remove-Item $Output -Recurse -Force }
New-Item -ItemType Directory -Path $Output | Out-Null

Write-Host 'Publishing backend'
Push-Location (Join-Path $Root 'backend')
pip install -r requirements.txt --target (Join-Path $Output 'backend') | Out-Null
Copy-Item app.py (Join-Path $Output 'backend')
Pop-Location

Write-Host 'Building frontend'
Push-Location (Join-Path $Root 'frontend')
npm install | Out-Null
npm run build | Out-Null
Copy-Item 'dist' (Join-Path $Output 'frontend') -Recurse
Pop-Location

Write-Host 'Packaging'
if (Test-Path (Join-Path $Root 'legal-suite.zip')) { Remove-Item (Join-Path $Root 'legal-suite.zip') }
Compress-Archive -Path (Join-Path $Output '*') -DestinationPath (Join-Path $Root 'legal-suite.zip')

Write-Host "Build complete: $(Join-Path $Root 'legal-suite.zip')"
