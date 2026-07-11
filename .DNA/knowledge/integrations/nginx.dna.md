# Nginx Reverse Proxy

## Use when
- Self-hosted on VM/bare metal
- TLS termination in front of Node containers
- Path-based routing to multiple services
- WebSocket upgrade for real-time features

## Baseline config
```nginx
upstream app { server 127.0.0.1:8080; }
server {
  listen 443 ssl http2;
  location /api/ { proxy_pass http://app; proxy_set_header Host $host; }
  location / { proxy_pass http://app; }
}
```

## Security headers
Add HSTS, X-Frame-Options, CSP (coordinate with app Helmet config).

## Rate limiting
`limit_req_zone` for auth endpoints.

## Custom systems
Route `/legacy/` to older upstream; document in Impressions integration-map.
