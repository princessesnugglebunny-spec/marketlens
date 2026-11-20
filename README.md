# MarketLens

Universal, ToS-safe Facebook Marketplace assistant for Chrome/Edge.

## Features

### Filtering & Declutter
- Hide sponsored, keyword, out-of-range, shipping-only, seller-ad, unknown-city, seen listings
- US, Australia, and New Zealand geo support
- 15mi grace toggle

### Profit Intelligence
- Profit-after-fees calculator (eBay, Poshmark, Mercari, Depop, Vinted, FB shipping, local cash, AUD, NZD)
- Max buy price, deal verdict, multi-currency (10 currencies)
- Buy log with CSV export, status tracking, analytics

### AI Drafting
- OpenAI-compatible API (any provider)
- Compliance rule engine (Amazon US rules)
- Restricted-claim flagging
- Targeted rewrite of failed rules

### Monetization (Pro tier)
- License key activation
- Tax report generation (CSV)
- Price history tracking (90-day)
- Cross-platform arbitrage finder
- SEO optimizer for listings
- Inventory tracker with cost basis
- Webhook notifications (Discord/Telegram)

### Agentic Assistant
- Chat panel with OpenAI-compatible transport
- Approval-gated tools (human-in-the-loop)
- Conversation history browser
- Reply draft suggestions (user sends manually)

### UI
- 4 floating buttons (one per corner), draggable
- Slim collapsible top/bottom bars
- Glassmorphism bubble design
- Floating chat bubble
- Assist mode overlay
- Dark/light theme toggle
- 10 locales (en, es, fr, de, pt, it, ja, zh, ko, ru)

### ToS-Safe Parity (co-pilot, not autopilot)
- One-click posting (pre-fills form, user clicks Publish)
- Reply drafts (user clicks Send)
- Repricing suggestions (user applies)
- Bulk draft + sequential confirmation
- Read-only page awareness

## Development
```
npm install
npm run typecheck
npm test
npm run lint
npm run build
npx playwright test
```
Load `dist/` as an unpacked extension in Chrome.

## Privacy
All filtering/calculation runs in-browser. No telemetry. API key stored locally only. No automated actions on your Facebook account.

## Limitations
- Geo filtering: US, AU, NZ only
- Data files: ~1.6MB (city tables)
- Image pipeline: requires optional backend (backend/)
- Messenger Platform: requires Facebook app review

## License
MIT
