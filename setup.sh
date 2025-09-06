#!/usr/bin/env bash
set -euo pipefail
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found. Install Node 20 LTS (recommended) or 18+."
  exit 1
fi
echo "Node version: $(node -v)"
if ! command -v npm >/dev/null 2>&1; then
  echo "npm not found. Install Node which includes npm."
  exit 1
fi
echo "Installing deps..."
npm install
echo "Starting dev server (Ctrl+C to stop)..."
npm run dev