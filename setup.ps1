Write-Host "Checking Node.js..."
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error "Node.js not found. Install Node 20 LTS (recommended) or 18+."
  exit 1
}
Write-Host ("Node version: " + (node -v))
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Error "npm not found. Install Node which includes npm."
  exit 1
}
Write-Host "Installing deps..."
npm install
Write-Host "Starting dev server (Ctrl+C to stop)..."
npm run dev