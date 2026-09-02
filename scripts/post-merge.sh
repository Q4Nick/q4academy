#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

test -s E-learning/app.js
test -s E-learning/index.html
test -s E-learning/styles.css
node --check E-learning/app.js

echo "Post-merge checks passed."