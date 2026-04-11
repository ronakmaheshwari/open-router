#!/bin/sh

cat <<EOF > /usr/share/nginx/html/env-config.js
window.env_ = {
  BACKEND_URL: "${BACKEND_URL}"
}
EOF

exec "$@"