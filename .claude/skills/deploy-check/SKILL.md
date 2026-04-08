---
name: deploy-check
description: Pre-deploy validation for Cloudflare Pages. Triggers on deploy, build, push, yayınla.
autoTrigger: true
---
# Deploy Check — Ela Ebeoğlu PT
## 1. npx tsc --noEmit (zero errors)
## 2. npm ci (lock file sync — .npmrc legacy-peer-deps=true)
## 3. npm run build (output /dist, no asset >500KB)
## 4. Cloudflare: build cmd=npm run build, output=/dist, NODE_VERSION=20, build system v3
## Gotchas: ERESOLVE→.npmrc fixes, lock mismatch→npm install --legacy-peer-deps