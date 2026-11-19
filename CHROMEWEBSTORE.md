# Chrome Web Store Listing — MarketLens

> Last Updated: 2026-11-19

## Store Listing

**Extension Name**
MarketLens — Facebook Marketplace assistant

**Short Description**
Filter Marketplace noise, calculate profit after fees, draft listings with AI. ToS-safe: no automated actions on your account.

**Detailed Description**
Filter Marketplace noise, calculate profit after fees, and draft listings with AI. ToS-safe: no automated actions on your account.

FEATURES
• Hide sponsored, keyword, out-of-range, shipping-only, seller-ad, and seen listings
• Profit-after-fees calculator for eBay, Poshmark, Mercari, Depop, Vinted, Facebook shipping, and local cash
• Max buy price and deal verdict for your target return
• Buy log with CSV export and analytics
• AI-assisted listing drafting via any OpenAI-compatible API (you review and post manually)
• Compliance rule engine flags restricted claims and listing issues
• Agentic assistant with approval-gated tools
• Monitoring and alerts (read-only)
• 4 floating buttons + 2 collapsible bars, draggable, themable

HOW TO USE
1. Install the extension and open Facebook Marketplace
2. Listings are filtered automatically as you browse
3. Click a listing to see the profit panel
4. Use the draft panel to generate compliant listing copy from your notes
5. Configure API keys and settings in the options page

PRIVACY
This extension does not collect any personal data. Your settings, filters, and buy log are stored locally on your device and never transmitted to any server. The only network requests are to an OpenAI-compatible API endpoint you configure, using a key you provide.

PERMISSIONS
• "Read and change data on sites you visit" — needed to filter Marketplace listings and inject the profit/draft panels. The extension only activates on facebook.com.
• "Storage" — needed to save your settings, filters, and buy log locally.
• "Alarms" — needed for periodic monitoring checks.
• "Notifications" — needed to alert you about new matches.

SUPPORT
Found a bug? Have a suggestion? Open an issue at https://github.com/marketlens/marketlens

Version 0.1.0 — Initial release

**Category**
Shopping

**Single Purpose**
Filter, analyze, and draft Facebook Marketplace listings locally without automating any account actions.

**Primary Language**
English

## Graphics & Assets

| Asset | Dimensions | Status | Filename |
|-------|-----------|--------|----------|
| Store Icon | 128×128 PNG | ✅ Ready | assets/icon128.png |
| Screenshot 1 | 1280×800 or 640×400 | ⬜ Not created | |
| Screenshot 2 | 1280×800 or 640×400 | ⬜ Not created | |
| Screenshot 3 | 1280×800 or 640×400 | ⬜ Not created | |
| Screenshot 4 | 1280×800 or 640×400 | ⬜ Not created | |
| Screenshot 5 | 1280×800 or 640×400 | ⬜ Not created | |
| Small Promo Tile | 440×280 | ⬜ Not created | |
| Marquee Promo Tile | 1400×560 | ⬜ Not created | |

### Screenshot Notes
1. Marketplace feed with sponsored/keyword/seen listings filtered out
2. Listing detail page with profit panel showing fees, profit, max buy, verdict
3. Draft panel generating compliant listing copy from seller notes
4. Settings page with blocked words, geo filter, and API configuration

## Permissions Justification

| Permission | Type | Justification |
|------------|------|---------------|
| storage | permissions | Save user settings, filters, buy log, and seen-listing IDs locally on the device. |
| activeTab | permissions | Access the current Marketplace tab to filter listings and inject panels. |
| alarms | permissions | Schedule periodic read-only monitoring checks for saved searches. |
| notifications | permissions | Alert the user when new matching listings are found during monitoring. |
| https://www.facebook.com/* | host_permissions | Required to read Marketplace listing cards and location filter on facebook.com. |

## Privacy & Data Use

### Data Collection

**Does the extension collect user data?** No

The extension does not collect, transmit, or sell any user data. All processing happens locally in the browser.

### Data Use Certification
- [x] Data is NOT sold to third parties
- [x] Data is NOT used for purposes unrelated to the extension's core functionality
- [x] Data is NOT used for creditworthiness or lending purposes

## Privacy Policy

**Privacy Policy URL**
https://github.com/marketlens/marketlens/blob/main/PRIVACY.md

## Distribution

**Visibility**: Public
**Regions**: All regions

## Developer Info

**Publisher Name**
MarketLens

**Contact Email**
marketlens@example.com

**Support URL / Email**
https://github.com/marketlens/marketlens/issues

**Homepage URL**
https://github.com/marketlens/marketlens

## Version History

| Version | Date | Changes | Status |
|---------|------|---------|--------|
| 0.1.0 | 2026-11-19 | Initial release | Draft |

## Review Notes

### Known Issues / Limitations
- Geo filtering is US, Australia, and New Zealand only.
- Data files are large (~5.5MB) due to city/neighborhood tables.
- Image pipeline requires optional backend.
- English-first i18n (4 locales shipped).

### Rejection History
None.