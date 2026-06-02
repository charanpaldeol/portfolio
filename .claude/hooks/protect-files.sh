#!/usr/bin/env bash
# Warn when editing frozen paths (see .claude/rules/layout-frozen-files.md)
set -euo pipefail

input=$(cat)
file_path=$(echo "$input" | node -e "
  let d=''; process.stdin.on('data',c=>d+=c); process.stdin.on('end',()=>{
    try { const j=JSON.parse(d); console.log(j.file_path||j.path||''); }
    catch { console.log(''); }
  });
")

frozen_patterns=(
  'app/layout.tsx'
  'components/layout/GlobalChrome.tsx'
  'components/layout/PortfolioShell.tsx'
  'components/layout/Navbar.tsx'
  'components/layout/Footer.tsx'
  'components/home/Navbar.tsx'
  'components/home/Footer.tsx'
  'design-system.ts'
  'styles/tailwind.css'
  'playwright.config.ts'
  'vitest.config.ts'
  'vitest.setup.ts'
)

for pattern in "${frozen_patterns[@]}"; do
  if [[ "$file_path" == *"$pattern"* ]]; then
    echo "Warning: editing frozen file $file_path — confirm this was explicitly requested." >&2
    exit 0
  fi
done

if [[ "$file_path" == *"/e2e/"* ]] || [[ "$file_path" == e2e/* ]]; then
  echo "Warning: editing frozen path $file_path — confirm this was explicitly requested." >&2
  exit 0
fi

exit 0
