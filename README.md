# FiskeLog – grundstruktur (Opgave 01)

Moderne dansk fiskeapp. Designretning: **Nordic Blue × Deep Water**.

## Kør lokalt
ES-moduler kræver en lokal server (ikke `file://`):

```bash
cd fiskelog
python3 -m http.server 8000
# åbn http://localhost:8000
```

Ingen afhængigheder og intet build-trin.

## Google Maps (Kort-siden)
1. Aktivér **Maps JavaScript API** i Google Cloud Console (kræver betalingskonto; der er et gratis månedligt forbrug).
2. Opret en API-nøgle og begræns den til jeres domæner (HTTP referrers), fx `http://localhost:8000/*` og `https://jeres-domæne.dk/*`.
3. Indsæt nøglen i `js/config.js` (`googleMapsApiKey`). Valgfrit: `googleMapsMapId` for Advanced Markers og stil fra Cloud Console.

Uden nøgle, hvis Google ikke kan nås, eller hvis nøglen afvises, viser siden det stiliserede reservekort og en forklarende note. Fiskesteder med koordinater ligger i `js/data/sample.js` (`lat`/`lng`).

Bemærk: Claude-forhåndsvisningen (artifact) blokerer scripts fra Google, så det rigtige kort kan kun ses, når appen køres lokalt eller fra jeres egen server.

## Struktur
```
index.html            App-skal (sidebar, view, bundnavigation)
css/
  tokens.css          Farver, spacing, radier, skygger, typografi (eneste sted med rå værdier)
  base.css            Reset, typografiskala, hjælpeklasser
  layout.css          Topbar, indholdsark, bundnav, sidebar, grids, breakpoints
  components.css      Knapper, kort, pills, statistik, fiskekort, badges, inputs, chips, modal
  pages.css           Kun sidespecifik styling
assets/fonts/         Inter (lokal, Latin-subset)
js/
  config.js           Konfiguration (Google Maps-nøgle)
  main.js             Hash-router (#/hjem, #/fisk …) og app-skal
  data/sample.js      Faste referencedata (arter, steder, badges) – ingen brugerdata
  data/store.js       Brugerens fangster i localStorage + afledte rekorder/samling
  ui/                 Ikoner, util, SVG-illustrationer (fisk, badges, kort, grej)
  components/         Genanvendelige UI-komponenter (rene funktioner → HTML)
  pages/              Én fil pr. side: render() + mount()
```

## Ruter
`hjem`, `fisk`, `fangster`, `kort`, `grej`, `profil` + `ai` (AI-rådgiver, skabelon) og `design` (levende designsystem).

## Breakpoints
- < 600 px: mobil (bundnavigation, bundark-modal)
- 600–959 px: tablet (bundnavigation, centreret modal)
- ≥ 960 px: desktop (sidebar), to-kolonne layout fra 1100 px

## Konventioner
- Komponenter escaper tekstparametre; parametre ved navn `body`/`html` er betroet HTML.
- Nye sider: opret `js/pages/x.js` med `title`, `render()`, evt. `mount(root)`, og registrér i `main.js`.
- Ting der ikke er bygget endnu vises med en `Note` – ingen døde knapper.

## Ikke implementeret (bevidst)
Pointsystem (fjernet bevidst), database, login, AI-integration, fisketegn, fuldt fiskebibliotek, avatar/MMO.


## Brugerdata og fangstregistrering
Profilen er Marcus og starter helt tom. Fangster registreres via "Registrér fangst" (Hjem, Fangster, Profil), valideres og gemmes i `localStorage` (`fiskelog.catches.v1`). Rekorder, artssamling og statistik udledes af fangsterne. Der er intet pointsystem. Test: `tests/catch_check.py`.

## Hjem: position og vande i nærheden
Hjem beder om din position (GPS), viser et lille Google-kort med dig som blå prik og lister vande inden for 15 km (`js/data/nearby.js`). Kendte steder kommer fra `sample.js`/`guide.js`; andre navngivne søer, åer, kyster og øer hentes fra OpenStreetMap (Overpass, ingen nøgle). Ukendte vande får generel viden efter vandtype. Kræver HTTPS og tilladelse fra browseren. Google Maps-nøglen ligger i `js/config.js` og bør begrænses til jeres domæne (HTTP referrers) i Google Cloud Console.
