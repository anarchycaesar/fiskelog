// App-konfiguration. Udfyld lokalt / på jeres server – læg aldrig rigtige nøgler i offentlige kommentarer.
//
// GOOGLE MAPS
// 1. Opret et projekt i Google Cloud Console og aktivér "Maps JavaScript API".
// 2. Opret en API-nøgle og begræns den til jeres domæne(r) (HTTP referrers), fx
//    http://localhost:8000/*  og  https://jeres-domæne.dk/*
// 3. Indsæt nøglen herunder. Uden nøgle viser Kort-siden det stiliserede kort.
//
// mapId er valgfri. Med et Map ID bruges "Advanced Markers" og kortets stil styres i
// Google Cloud Console (Map Styles). Uden Map ID bruges appens egen Nordic Blue-kortstil.

export const config = {
  googleMapsApiKey: 'AIzaSyCaiFPpL6qbypcrTnIxHi2Wne1WNvYoNYc',
  googleMapsMapId: '',
};
