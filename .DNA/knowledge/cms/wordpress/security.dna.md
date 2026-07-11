# WordPress — Security (mandatory)

- Auto-updates for core; staged plugin updates
- Disable file editor, XML-RPC if unused
- Least-privilege DB user; no `wp_` table prefix security theater only
- WAF + rate limit `wp-login.php`
- No nulled plugins; composer for premium when possible
