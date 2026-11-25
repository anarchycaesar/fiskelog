import { fishById, spots } from '../data/sample.js';
import { guideFor, genericSpecies, genericNotes, baitFor, starterGear, commonGear, rules, ruleLinks, steps } from '../data/guide.js';
import { knownPlaces, findNearby, fmtDist } from '../data/nearby.js';
import { collectionStats } from '../data/store.js';
import { esc } from '../ui/util.js';
import { fishArt } from '../ui/fish-art.js';
import { icon } from '../ui/icons.js';
import { denmarkMapArt } from '../ui/scenery.js';
import { loadGoogleMaps, hasMapsKey, createLocationMap } from '../ui/google-maps.js';
import { openCatchForm } from '../components/catch-modals.js';
import { PageLayout } from '../components/page.js';
import { Card, Note, Pill } from '../components/card.js';
import { Section } from '../components/section-title.js';
import { Button } from '../components/button.js';
import { ChipGroup } from '../components/input.js';

export const title = 'Hjem';

const list = (items) => `<ul class="guide-list">${items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`;
const routeUrl = (p) => `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;

/** Nybegynderguide for ét sted: fisk, grej, regler, trin og første fangst. */
function PlaceGuide(place, { nearest = false } = {}) {
  const known = place.known;
  const g = known ? guideFor(place.spotId) : { notes: genericNotes[place.type] || [], bait: {} };
  const speciesIds = (known ? Object.keys(g.bait) : genericSpecies[place.type] || []).filter((id) => fishById[id]);
  const shown = known ? speciesIds : speciesIds.slice(0, 3);

  const fishRows = shown.map((id) => {
    const f = fishById[id];
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

  const gearBlocks = shown.filter((id) => starterGear[id]).slice(0, 3).map((id) => {
    const k = starterGear[id];
    return `<div class="gear-block"><p class="t-h3">${esc(fishById[id].name)}</p>${list([`Stang: ${k.rod}`, `Line: ${k.line}`, `Agn: ${k.lure}`])}</div>`;
  }).join('');

  const generalHint = known ? '' : Note({ text: `Appen kender ikke ${place.name} endnu. Det her er generel viden for ${place.type === 'Sø' ? 'søer' : place.type === 'Å' ? 'åer' : 'kyst og hav'}, ikke noter om netop dette vand.` });

  return `
    <div class="stack-l">
      <div class="guide-head">
        <div>
          ${nearest ? '<p class="guide-eyebrow">Dit nærmeste vand</p>' : ''}
          <h2 class="t-h2">${esc(place.name)}</h2>
          <p class="t-meta">${place.km != null ? `${esc(fmtDist(place.km))} fra dig` : esc(place.area || 'Fast fiskested')}</p>
        </div>
        ${Pill({ text: place.type, iconName: 'water' })}
      </div>
      <div class="guide-actions">
        ${Button({ label: 'Vis vej', variant: 'primary', iconName: 'pin', href: routeUrl(place), attrs: 'target="_blank" rel="noopener"' })}
        ${Button({ label: 'Registrér fangst her', variant: 'secondary', attrs: `data-new-catch data-place="${esc(place.name)}"` })}
      </div>
      ${generalHint}
      ${fishRows ? Section({ title: known ? 'Det kan du fange' : 'Det kan du typisk fange', id: 'guide-fish', body: Card({ flush: true, body: `<ul class="guide-fish-list">${fishRows}</ul>` }) }) : ''}
      ${gearBlocks ? Section({ title: 'Det skal du bruge', id: 'guide-gear', body: Card({ body: `<div class="stack-m">${gearBlocks}<div><p class="t-h3">Udover det</p>${list(commonGear)}</div></div>` }) }) : ''}
      ${g.notes.length ? Section({ title: 'Vær opmærksom på', id: 'guide-notes', body: Card({ body: list(g.notes) }) }) : ''}
      ${Section({ title: 'Det skal du vide først', id: 'guide-rules', body: Card({ body: `${list(rules)}<div class="guide-links">${ruleLinks.map((l) => `<a class="link" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('')}</div>` }) })}
      ${Section({ title: 'Sådan gør du', id: 'guide-steps', body: Card({ body: `<ol class="guide-steps">${steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>` }) })}
      ${Note({ text: 'Udkast med generel viden. Tjek altid gældende regler, mindstemål og fiskekort.' })}
    </div>`;
}

function Collection() {
  const { species, speciesTotal } = collectionStats();
  return `<a class="collection-link" href="#/fisk">${icon('fish', { size: 18 })}<span>Din samling: <strong>${species} af ${speciesTotal}</strong> arter</span><span aria-hidden="true">›</span></a>`;
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

const HINT = '<p class="t-meta guide-hint">Tillad din position, så finder jeg det nærmeste vand. Eller vælg et sted på kortet.</p>';

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
      ${Collection()}
    </div>`;
  return PageLayout({ route: 'hjem', eyebrow: 'Hvor fisker du?', title: 'Hjem', body });
}

let liveRoot = null;

/** Kaldes, når fangster ændres: opdatér kun samlingslinjen, så kortet og det valgte sted bliver stående. */
export function onDataChange() {
  const el = liveRoot?.isConnected && liveRoot.querySelector('.collection-link');
  if (el) el.outerHTML = Collection();
}

export function mount(root) {
  liveRoot = root;
  const $ = (sel) => root.querySelector(sel);
  const state = { places: knownPlaces(), selected: '', user: null, nearestId: '' };
  let gmap = null;

  const alive = () => root.isConnected;
  const setStatus = (key) => { $('#geo-status').textContent = MESSAGES[key]; $('[data-geo-retry]').hidden = key === 'ok' || key === 'asking'; };

  function paint() {
    $('#spot-chips').innerHTML = Chips(state.places, state.selected);
    const place = state.places.find((p) => p.id === state.selected);
    $('#spot-guide').innerHTML = place ? PlaceGuide(place, { nearest: state.nearestId === place.id }) : HINT;
    $('#mini-pins').innerHTML = FallbackPins(place?.known ? place.spotId : '');
    gmap?.update({ user: state.user, places: state.places, selectedId: state.selected });
  }

  root.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-chip-value]');
    if (chip) { state.selected = chip.dataset.chipValue; paint(); return; }
    const nc = e.target.closest('[data-new-catch]');
    if (nc) { openCatchForm({ place: nc.dataset.place || '' }); return; }
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
      state.nearestId = places[0]?.id || '';
      if (!places.some((x) => x.id === state.selected)) state.selected = state.nearestId;
      paint();
      setStatus(osmOk ? 'ok' : 'osm');
    }, (err) => {
      if (!alive()) return;
      setStatus(err.code === 1 ? 'denied' : err.code === 3 ? 'timeout' : 'unavailable');
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
  }

  locate();
}
