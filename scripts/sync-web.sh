#!/bin/bash
# Copies the static web assets Capacitor should bundle into www/, leaving
# everything else (supabase/, *.sql, .git, node_modules, ios/, android/,
# middleware.mjs — that's Vercel-only edge middleware, meaningless inside
# a native app bundle) out of the app package. No build step otherwise —
# matches the rest of this project's manual-CLI, no-bundler workflow.
set -euo pipefail
cd "$(dirname "$0")/.."

rm -rf www
mkdir -p www

cp ./*.html www/
cp ./*.js www/
cp manifest.json www/
cp -R images www/images

echo "Synced $(ls www/*.html | wc -l | tr -d ' ') html files + images/ into www/"
