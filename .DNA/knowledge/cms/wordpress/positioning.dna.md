# WordPress — Positioning

**Legacy support** — WordPress is widely deployed but has higher security and plugin debt than modern headless CMS options.

## DNA guidance
- **Greenfield:** prefer `cms/sanity`, `cms/payload`, `cms/strapi`, or `cms/contentful`
- **Brownfield:** headless via WPGraphQL/REST + separate frontend (`wordpress-headless` archetype)
- **Never:** new WooCommerce + custom React in same PHP theme without clear boundaries

See also `platforms/wordpress-headless` for engineering patterns.
