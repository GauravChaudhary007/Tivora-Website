# Tivora ERP marketing website — production image.
#
#     docker build -t tivora-website:latest .
#     docker run -p 3100:3000 tivora-website:latest

FROM node:22-alpine AS base
RUN apk add --no-cache tini
WORKDIR /srv/web

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM base AS build
COPY --from=deps /srv/web/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -S web && adduser -S web -G web
COPY --from=build --chown=web:web /srv/web/.next/standalone ./
COPY --from=build --chown=web:web /srv/web/.next/static ./.next/static
COPY --from=build --chown=web:web /srv/web/public ./public
USER web
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health > /dev/null || exit 1
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]
