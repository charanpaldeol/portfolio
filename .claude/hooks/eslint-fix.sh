#!/usr/bin/env bash
# Optional post-edit hook: run ESLint fix on repo (non-blocking).
set -euo pipefail
cd "$(dirname "$0")/../.." || exit 0
pnpm lint:fix 2>/dev/null || true
exit 0
