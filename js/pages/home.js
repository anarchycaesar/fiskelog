import { fishById, spots } from '../data/sample.js';
import { guideFor, genericSpecies, genericNotes, baitFor } from '../data/guide.js';
import { knownPlaces, findNearby, fmtDist } from '../data/nearby.js';
import { esc } from '../ui/util.js';
import { fishArt } from '../ui/fish-art.js';
import { icon } from '../ui/icons.js';
import { denmarkMapArt } from '../ui/scenery.js';
import { loadGoogleMaps, hasMapsKey, createLocationMap } from '../ui/google-maps.js';
import { PageLayout } from '../components/page.js';
import { Card, Note, Pill } from '../components/card.js';
import { Section } from '../components/section-title.js';
import { Button } from '../components/button.js';
import { ChipGroup } from '../components/input.js';

export const title = 'Hjem';

const list = (items) => `<ul class="guide-list">${items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`;

function PlaceGuide(place) {
  const known = place.known;
  const g = known ? guideFor(place.spotId) : { notes: genericNotes[place.type] || [], bait: {} };
  const speciesIds = known ? Object.keys(g.bait) : genericSpecies[place.type] || [];
  const fishRows = speciesIds.map((id) => {
    const f = fishById[id];
    if (!f) return '';
    const bait = known ? g.bait[id] || [] : baitFor(id);
    return `<li class="guide-fish">
      <span class="guide-fish__art">${fishArt(f)}</span>
      <div class="guide-fish__body">
        <p class="t-h3">${esc(f.name)}</p>
        <p class="guide-fish__latin">${esc(f.latin)}</p>
        ${bait.length ? `<p class="guide-fish__label">Bait</p>${list(bait)}` : ''}
      </div>
    </li>`;
  }).join('');

  return `
    <div class="stack-l">
      <div class="guide-head">
        <div>
          <h2 class="t-h2">${esc(place.name)}</h2>
          <p class="t-meta">${place.km != null ? `${esc(fmtDist(place.km))} fra dig` : 'Fast fiskested'}</p>
        </div>
        ${Pill({ text: place.type, iconName: 'water' })}
      </div>
      ${known ? '' : Note({ text: `Appen kender ikke ${place.name} endnu. Det her er generel viden for ${place.type === 'Sø' ? 'søer' : place.type === 'Å' ? 'åer' : 'kyst og hav'}, ikke noter om netop dette vand.` })}
      ${fishRows ? Section({ title: known ? 'Det kan du fange' : 'Det kan du typisk fange', id: 'guide-fish', body: Card({ flush: true, body: `<ul class="guide-fish-list">${fishRows}</ul>` }) }) : ''}
      ${g.notes.length ? Section({ title: 'Vær opmærksom på', id: 'guide-notes', body: Card({ body: list(g.notes) }) }) : ''}
      ${Note({ text: 'Tjek altid gældende regler, mindstemål og fiskekort.' })}
    </div>`;
}

const chipLabel = (p) => (p.km != null ? `${p.name} · ${fmtDist(p.km)}` : p.name);

function Chips(places, active) {
  return ChipGroup({ group: 'spot', label: 'Fiskested', items: places.map((p) => ({ value: p.id, label: chipLabel(p) })), active });
}

/** Pins som SVG i kortets eget koordinatsystem, så de altid sidder rigtigt på landkortet. */
function FallbackPins(selectedId) {
  return spots.map((s) => (s.id === selectedId
    ? `<circle class="mini-dot is-selected" cx="${s.x}" cy="${s.y}" r="13"/>`
    : `<circle class="mini-dot" cx="${s.x}" cy="${s.y}" r="9"/>`)).join('');
}

const HINT = '<p class="t-meta guide-hint">Vælg et sted for at se fisk, bait og opmærksomhedspunkter.</p>';

const MESSAGES = {
  asking: 'Finder din position …',
  ok: 'Vande inden for 15 km af dig, nærmeste først.',
  osm: 'Kunne ikke hente vande i nærheden lige nu. Viser de steder, appen kender.',
  denied: 'Appen har ikke adgang til din position. Giv adgang i browserens indstillinger, eller vælg et sted herunder.',
  unavailable: 'Din browser kan ikke give din position her. Vælg et sted herunder.',
  timeout: 'Din position blev ikke fundet i tide. Prøv igen, eller vælg et sted herunder.',
};

export function render() {
  const places = knownPlaces();
  const body = `
    <div class="stack-l">
      <div class="mini-map" id="mini-map">
        <div class="mini-map__gmap" id="mini-gmap" hidden></div>
        <div class="mini-map__fallback" id="mini-fallback">${denmarkMapArt({ bleed: true, pins: `<g id="mini-pins">${FallbackPins('')}</g>` })}</div>
        <a class="mini-map__link" href="#/kort" aria-label="Åbn kort over fiskesteder"><span class="mini-map__cta">${icon('pin', { size: 16 })} Åbn kort</span></a>
        <div class="mini-map__chips" id="spot-chips">${Chips(places, '')}</div>
      </div>
      <div class="geo-line">
        <p class="t-meta" id="geo-status" role="status">${MESSAGES.asking}</p>
        <span id="geo-retry">${Button({ label: 'Brug min position', variant: 'secondary', size: 'sm', iconName: 'pin', attrs: 'data-geo-retry hidden' })}</span>
      </div>
      <div id="spot-guide" aria-live="polite">${HINT}</div>
    </div>`;
  return PageLayout({ route: 'hjem', eyebrow: 'Hvor fisker du?', title: 'Hjem', body });
}

export function mount(root) {
  const $ = (sel) => root.querySelector(sel);
  const state = { places: knownPlaces(), selected: '', user: null };
  let gmap = null;

  const alive = () => root.isConnected;
  const setStatus = (key) => { $('#geo-status').textContent = MESSAGES[key]; $('[data-geo-retry]').hidden = key === 'ok' || key === 'asking'; };

  function paint() {
    $('#spot-chips').innerHTML = Chips(state.places, state.selected);
    const place = state.places.find((p) => p.id === state.selected);
    $('#spot-guide').innerHTML = place ? PlaceGuide(place) : HINT;
    $('#mini-pins').innerHTML = FallbackPins(place?.known ? place.spotId : '');
    gmap?.update({ user: state.user, places: state.places, selectedId: state.selected });
  }

  root.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-chip-value]');
    if (chip) { state.selected = chip.dataset.chipValue; paint(); return; }
    if (e.target.closest('[data-geo-retry]')) locate();
  });

  // Google Maps oven på reservekortet. Fejler det, forbliver det stiliserede kort synligt.
  const showFallback = () => { $('#mini-gmap').hidden = true; $('#mini-fallback').hidden = false; gmap = null; };
  const onAuthFail = () => showFallback();
  document.addEventListener('fiskelog:maps-auth-failure', onAuthFail, { once: true });
  if (hasMapsKey()) {
    loadGoogleMaps().then((maps) => {
      if (!alive()) return;
      $('#mini-gmap').hidden = false;
      $('#mini-fallback').hidden = true;
      gmap = createLocationMap($('#mini-gmap'), maps);
      paint();
    }).catch(() => {});
  }

  async function locate() {
    if (!navigator.geolocation) { setStatus('unavailable'); return; }
    setStatus('asking');
    navigator.geolocation.getCurrentPosition(async (p) => {
      if (!alive()) return;
      state.user = { lat: p.coords.latitude, lng: p.coords.longitude };
      state.places = knownPlaces(state.user).sort((a, b) => a.km - b.km);
      paint();
      const { places, osmOk } = await findNearby(state.user);
      if (!alive()) return;
      state.places = places;
      if (!places.some((x) => x.id === state.selected)) state.selected = '';
      paint();
      setStatus(osmOk ? 'ok' : 'osm');
    }, (err) => {
      if (!alive()) return;
      setStatus(err.code === 1 ? 'denied' : err.code === 3 ? 'timeout' : 'unavailable');
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
  }

  locate();
}
