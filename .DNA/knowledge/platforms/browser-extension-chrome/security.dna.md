# Chrome Extension — Security

- Request narrow `host_permissions` — justify each domain in Impressions
- No remote code execution — all JS bundled and reviewed
- Use `chrome.storage.session` for sensitive ephemeral data
- Content scripts: assume hostile page DOM — validate messages
- Chrome Web Store privacy questionnaire must match actual data use
