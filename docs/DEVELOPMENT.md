# Developer guide

Use Node 22 and Python 3.12. Run npm ci, npm run build, python scripts/package-practicals.py, python scripts/check-site.py, and node scripts/parity-test.mjs. Run python -m unittest discover -s "Bab N" for each chapter. For browser tests install Playwright 1.56.1 without saving to the lockfile and install chromium, then node scripts/browser-smoke.mjs.

## Architecture
The build derives curriculum topics from the seven chapter HTML fragments, validates chapter sequence, progress IDs and quiz answer keys, and embeds the registry in each generated page. app.js retains legacy interactions; math.js contains shared pure arithmetic; academy.js contains study tools and runtime UI; assessment.js contains generated numeric practice; tools.js contains command palette, flowchart and achievements. styles.css is the legacy base, workspace.css contains new responsive components. dist is generated; do not edit it manually.

## Release policy
Do not claim Stable based on successful static build alone. Keep a passing unit/parity/build/browser gate, verify live deployment, test real Pyodide runtime and cross-browser behavior, and resolve academic source/rights review. Browser emulation is not physical-device testing. Review docs/RELEASE-CHECKLIST.md before tagging.
