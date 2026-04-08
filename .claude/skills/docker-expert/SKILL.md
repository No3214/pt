# Docker Expert Skill

Containerization patterns (for local dev and future scaling).

## PT Dockerfile (if needed)
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

## Docker Compose (Local Dev)
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:80"
    volumes:
      - ./dist:/usr/share/nginx/html
    environment:
      - NODE_ENV=production
```

## Notes
- PT currently deploys to Cloudflare Pages (no Docker needed)
- Docker useful for: local testing, future self-hosting, CI/CD
- Keep images small: alpine base, multi-stage builds
- .dockerignore: node_modules, .git, .env
