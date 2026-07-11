# WordPress Headless — Security

- Hide `/wp-admin` behind VPN or IP allowlist when possible
- Disable XML-RPC if unused
- Separate DB credentials; no WP on public internet without WAF
- Frontend: static generation where possible; revalidate webhooks secured with HMAC
