#!/usr/bin/env bash
set -e
ROOT=$(cd "$(dirname "$0")" && pwd)
OUTPUT="$ROOT/build"

rm -rf "$OUTPUT"
mkdir -p "$OUTPUT"

echo "Publishing backend"
pushd "$ROOT/backend" >/dev/null
pip install -r requirements.txt --target "$OUTPUT/backend" >/dev/null
cp app.py "$OUTPUT/backend/"
popd >/dev/null

echo "Building frontend"
pushd "$ROOT/frontend" >/dev/null
npm install >/dev/null
npm run build >/dev/null
cp -r dist "$OUTPUT/frontend"
popd >/dev/null

echo "Packaging"
rm -f "$ROOT/legal-suite.tar.gz"
tar -czf "$ROOT/legal-suite.tar.gz" -C "$OUTPUT" .

echo "Build complete: $ROOT/legal-suite.tar.gz"
