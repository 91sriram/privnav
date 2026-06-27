# PrivNav MapLibre Fork

Experimental fork of the working PrivNav app. The original Leaflet build is untouched.

This version keeps the same service roles:
- OSM-based rendering via OpenFreeMap/MapLibre style
- GraphHopper routing
- TomTom traffic raster overlay and incidents
- Nominatim search

The main experiment is native MapLibre camera control for navigation:
- `bearing` rotates the map without CSS transforms
- `pitch` gives a driving-view camera
- route, traffic, markers, and hit-testing remain in the map engine's coordinate system

Run it through a local/static server or GitHub Pages. Geolocation requires HTTPS or localhost.
