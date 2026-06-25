# PrivNav — Privacy-respecting navigation

A self-contained navigation PWA using TomTom traffic data and OpenStreetMap.

## Privacy design
- Traffic tiles queried by bounding box only — no route transmitted
- Routing queries padded with chaff decoys
- No analytics, no tracking, no ads
- API key stored locally in browser only
