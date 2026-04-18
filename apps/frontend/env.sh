#!/bin/sh
set -e
echo "BACKEND_URL is: $BACKEND_URL"
cat <<EOF > /usr/share/nginx/html/env-config.js
window.env_ = {
  BACKEND_URL: "${BACKEND_URL}"
};

console.log("Loaded env config:", window.env_);
EOF

exec "$@"