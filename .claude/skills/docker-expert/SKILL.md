---
name: docker-expert
description: 2026 containerization patterns PT (Node 22 + nginx/caddy). Triggers on docker, container, compose.
---
# Docker Expert — 2026 PT

## Current State
PT deploy: Cloudflare Pages (no Docker). Bu skill gelecek self-host / CI için.

## Multi-Stage Dockerfile (2026)
```dockerfile
# syntax=docker/dockerfile:1.7

# --- Build stage ---
FROM node:22-alpine AS build
WORKDIR /app

# Install deps cached
COPY package*.json .npmrc ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --legacy-peer-deps

# Build
COPY . .
RUN npm run build

# --- Runtime: Caddy (modern, auto-HTTPS) ---
FROM caddy:2-alpine
COPY --from=build /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 80 443
# HEALTHCHECK
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget --spider -q http://localhost/ || exit 1
```

## Caddyfile
```
:80 {
    root * /srv
    file_server
    try_files {path} /index.html
    encode zstd gzip
    header {
        Strict-Transport-Security "max-age=31536000;"
        X-Content-Type-Options "nosniff"
        Content-Security-Policy "default-src 'self'..."
        Cache-Control "public, max-age=31536000, immutable"
    }
    @html path *.html
    header @html Cache-Control "no-cache"
}
```

## Docker Compose (Dev)
```yaml
services:
  app:
    build:
      context: .
      target: build
    ports:
      - "5173:5173"
    volumes:
      - ./src:/app/src
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev -- --host
    develop:
      watch:
        - path: ./src
          action: sync
          target: /app/src

  supabase:
    image: supabase/postgres:15
    environment:
      - POSTGRES_PASSWORD=dev
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

## Best Practices (2026)
- **Alpine base** + `npm ci` (small + reproducible)
- **Multi-stage** — build artifact only in final
- **BuildKit cache mount** — npm cache persistent
- **Non-root user** — `USER node` production
- **HEALTHCHECK** — orchestrator know alive
- **.dockerignore**:
  ```
  node_modules
  .git
  .env
  .env.*
  dist
  coverage
  *.log
  ```
- **Distroless** alternative (gcr.io/distroless/nodejs22)
- **SBOM** — `docker sbom <image>` supply chain
- **Sign image** — cosign + Sigstore

## Image Size Target
- App build stage: ≤800MB
- Final runtime: ≤50MB (Caddy alpine)
- Distroless: ≤30MB

## CI Build
```yaml
# .github/workflows/docker.yml
- uses: docker/build-push-action@v5
  with:
    cache-from: type=gha
    cache-to: type=gha,mode=max
    platforms: linux/amd64,linux/arm64
    push: true
```

## Notes
- PT currently Cloudflare Pages (no Docker needed)
- Docker useful: local Supabase, future self-host, CI preview
- Keep image small: alpine + multi-stage + distroless
- Security: scan with `trivy` or `grype` in CI
