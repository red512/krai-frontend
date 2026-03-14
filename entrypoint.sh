#!/bin/sh
# Generate runtime config from environment variables.
# This runs at container startup so the React app picks up
# the correct backend URL without rebuilding the image.
cat <<EOF > /app/build/config.js
window.__CONFIG__ = {
  API_URL: "${REACT_APP_API_URL:-http://localhost:8080}",
  API_KEY: "${REACT_APP_API_KEY:-demo-key-change-me}",
  GOOGLE_CLIENT_ID: "${REACT_APP_GOOGLE_CLIENT_ID:-}"
};
EOF

exec serve -s build -l 8080
