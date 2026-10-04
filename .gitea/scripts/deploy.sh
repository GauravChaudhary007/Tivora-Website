#!/bin/bash
# Run on the target server by .gitea/workflows/deploy.yml, via:
#   IMAGE_TAG=<short-commit-sha> bash /tmp/tivora-website-deploy.sh
# Assumes /tmp/tivora-website.tar has already been copied there.
#
# /opt/tivora-website is rebuilt in place on every deploy. Its
# .env.production is hand-maintained on the server and never comes from the
# tarball, so it is stashed and restored around the extract.
set -eu
set -o pipefail 2>/dev/null || true

DEPLOY_DIR=/opt/tivora-website
TARBALL=/tmp/tivora-website.tar

: "${IMAGE_TAG:?IMAGE_TAG not set - pass the short commit sha this build came from}"

mkdir -p "$DEPLOY_DIR"

KEEP_DIR=$(mktemp -d)
[ -f "$DEPLOY_DIR/.env.production" ] && cp "$DEPLOY_DIR/.env.production" "$KEEP_DIR/.env.production"

# Clear the old tree (except the env file) so deleted files don't linger.
find "$DEPLOY_DIR" -mindepth 1 -maxdepth 1 ! -name .env.production -exec rm -rf {} +
tar -xf "$TARBALL" -C "$DEPLOY_DIR"
rm -f "$TARBALL"

[ -f "$KEEP_DIR/.env.production" ] && cp "$KEEP_DIR/.env.production" "$DEPLOY_DIR/.env.production"
rm -rf "$KEEP_DIR"

# First deploy: start with defaults rather than failing.
if [ ! -f "$DEPLOY_DIR/.env.production" ]; then
  printf 'WEB_PORT=3100\nDEMO_WEBHOOK_URL=\n' > "$DEPLOY_DIR/.env.production"
  echo "Created $DEPLOY_DIR/.env.production with defaults (WEB_PORT=3100)."
fi

cd "$DEPLOY_DIR"
PORT=$(grep -E '^WEB_PORT=' .env.production | cut -d= -f2)
PORT=${PORT:-3100}

docker compose --env-file .env.production up -d --build web
docker tag tivora-website:latest "tivora-website:${IMAGE_TAG}"

ok=""
for i in $(seq 1 15); do
  if curl -fsS "http://127.0.0.1:${PORT}/api/health" > /dev/null 2>&1; then ok=1; break; fi
  sleep 3
done
if [ -z "$ok" ]; then
  echo "tivora-website never reported healthy on port ${PORT}" >&2
  docker compose logs --tail=60 web >&2 || true
  exit 1
fi

# Keep the last few tagged images for rollback; drop dangling layers.
docker image prune -f > /dev/null
echo "tivora-website ${IMAGE_TAG} is live on port ${PORT}"
