# MarketLens

Universal, ToS-safe Facebook Marketplace assistant for Chrome/Edge.

## Features (ToS-safe only)
- Filter sponsored, keyword, out-of-range, shipping-only, seller-ad, unknown-city, seen listings (DOM-only)
- Profit-after-fees calculator per listing (editable fee tables)
- Buy log with CSV export + analytics
- AI-assisted listing drafting via OpenAI-compatible API (user-reviewed)
- Compliance rule engine + restricted-claim flagging
- Agentic assistant with approval-gated tools
- Monitoring/alerts (read-only, browser notifications + webhooks)
- 4 floating buttons + 2 collapsible bars UI shell

## Development
```
npm install
npm run typecheck
npm test
npm run build
```
Load `dist/` as an unpacked extension in Chrome.

## Limitations
- Geo filtering is US-only (city table from US census).
- Data files are large (~5.5MB) due to city/neighborhood tables.
- Image pipeline requires optional backend.

## Privacy
All filtering/calculation runs in-browser. No telemetry. API key stored locally only. No automated actions on your Facebook account.
