import { spots, fishById } from '../data/sample.js';
import { esc } from '../ui/util.js';
import { icon } from '../ui/icons.js';
import { denmarkMapArt, placeArt } from '../ui/scenery.js';
import { PageLayout } from '../components/page.js';
import { Card, Note, Pill } from '../components/card.js';
import { Section } from '../components/section-title.js';
import { ChipGroup, bindChips } from '../components/input.js';
import { hasMapsKey, loadGoogleMaps, createSpotMap, mapsAuthFailed } from '../ui/google-maps.js';

export const title = 'Kort';

const TYPES = ['Alle', 'Sø', 'Å', 'Kyst'];

const STATUS = {
  'no-key': 'Viser det stiliserede reservekort. Indsæt en Google Maps API-nøgle i js/config.js for at vise det rigtige kort.',
  'load-error': 'Google Maps kunne ikke indlæses her, så det stiliserede reservekort vises i stedet.',
  timeout: 'Google Maps svarede ikke, så det stiliserede reservekort vises i stedet.',
  auth: 'Google afviste API-nøglen (tjek nøgle, fakturering og tilladte domæner). Viser reservekortet.',
  ok: 'Fiskestederne er eksempeldata. Flere fiskevande tilføjes senere.',
};

function pinsHtml(list, selectedId) {
  return list.map((s) => `<button type="button" class="dk-pin" data-spot-id="${s.id}"
      style="left:${(s.x / 400) * 100}%;top:${(s.y / 360) * 100}%"
      aria-pressed="${s.id === selectedId}" aria-label="${esc(s.name)}, ${esc(s.area)}">
      ${icon('pin', { size: 18, stroke: 2 })}<span class="dk-pin__label">${esc(s.name)}</span></button>`).join('');
}

function detailHtml(s) {
  const species = s.species.map((id) => Pill({ text: fishById[id].name, iconName: 'fish' })).join('');
  return `<div class="spot-detail">
    <div class="spot-detail__img">${placeArt(s.type)}</div>
    <div class="stack-s" style="min-width:0">
      <div class="cluster" style="justify-content:space-between">
        <h3 class="t-h3">${esc(s.name)}</h3>${Pill({ text: s.type, iconName: 'water' })}
      </div>
      <p class="t-meta">${icon('pin', { size: 14, className: 'inline-icon' })}${esc(s.area)}</p>
      <div class="cluster" aria-label="Arter registreret her">${species}</div>
    </div>
  </div>`;
}

function listHtml(list, selectedId) {
  return `<ul class="list">${list.map((s) => `<li>
      <button type="button" class="row spot-row" data-spot-id="${s.id}" aria-pressed="${s.id === selectedId}">
        <span class="row__art row__art--square">${icon('pin', { size: 22 })}</span>
        <span class="row__main"><span class="row__title">${esc(s.name)}</span><span class="row__meta">${esc(s.area)}</span></span>
        ${Pill({ text: s.type })}
      </button></li>`).join('')}</ul>`;
}

export function render() {
  const sel = spots[0];
  const body = `
    ${ChipGroup({ group: 'spot-type', label: 'Filtrér efter type', items: TYPES.map((t) => ({ value: t, label: t === 'Alle' ? 'Alle steder' : t })), active: 'Alle' })}
    <div class="split">
      ${Card({ flush: true, className: 'map-card', attrs: 'aria-label="Kort over fiskesteder"', body: `
        <div class="gmap" id="gmap" hidden></div>
        <div class="dk-map" id="dk-map">${denmarkMapArt()}<div class="dk-map__pins" id="dk-pins">${pinsHtml(spots, sel.id)}</div>
          ${hasMapsKey() ? `<div class="map-loading" id="map-loading">${icon('pin', { size: 18 })}<span>Indlæser Google Maps …</span></div>` : ''}
        </div>` })}
      <div class="stack-l">
        ${Card({ body: `<div id="spot-detail" aria-live="polite">${detailHtml(sel)}</div>` })}
        ${Section({ title: 'Fiskesteder', id: 'spot-list-title', body: Card({ flush: true, body: `<div id="spot-list">${listHtml(spots, sel.id)}</div>` }) })}
      </div>
    </div>
    <div id="map-status">${Note({ text: hasMapsKey() ? 'Indlæser Google Maps …' : STATUS['no-key'], iconName: 'pin' })}</div>`;

  return PageLayout({ route: 'kort', eyebrow: 'Fiskevande i Danmark', title: 'Kort', body });
}

export function mount(root) {
  const state = { type: 'Alle', selected: spots[0].id };
  const pins = root.querySelector('#dk-pins');
  const list = root.querySelector('#spot-list');
  const detail = root.querySelector('#spot-detail');

  const visible = () => spots.filter((s) => state.type === 'Alle' || s.type === state.type);
  const status = root.querySelector('#map-status');
  const setStatus = (key) => { status.innerHTML = Note({ text: STATUS[key], iconName: 'pin' }); };
  let gmap = null; // Google-kortet, når det er indlæst

  const update = () => {
    const v = visible();
    if (!v.some((s) => s.id === state.selected) && v.length) state.selected = v[0].id;
    gmap?.select(state.selected);
    pins.innerHTML = pinsHtml(v, state.selected);
    list.innerHTML = listHtml(v, state.selected);
    const s = spots.find((x) => x.id === state.selected);
    detail.innerHTML = s ? detailHtml(s) : '';
  };

  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-spot-id]');
    if (!b) return;
    state.selected = b.dataset.spotId;
    update();
  });
  bindChips(root, 'spot-type', (v) => {
    state.type = v;
    gmap?.filter(visible().map((s) => s.id));
    update();
  });

  // Google Maps: forsøg kun med nøgle. Ved fejl bliver reservekortet stående.
  if (!hasMapsKey()) return;
  const showFallback = (key) => {
    root.querySelector('#map-loading')?.remove();
    root.querySelector('#gmap').hidden = true;
    root.querySelector('#dk-map').hidden = false;
    gmap = null;
    setStatus(key);
  };
  if (mapsAuthFailed()) { showFallback('auth'); return; }
  const onAuthFailure = () => {
    if (root.isConnected) showFallback('auth');
    else document.removeEventListener('fiskelog:maps-auth-failure', onAuthFailure);
  };
  document.addEventListener('fiskelog:maps-auth-failure', onAuthFailure);

  loadGoogleMaps()
    .then((maps) => {
      if (!root.isConnected) return; // brugeren har forladt siden
      const el = root.querySelector('#gmap');
      el.hidden = false;
      root.querySelector('#dk-map').hidden = true;
      gmap = createSpotMap(el, maps, spots, {
        selectedId: state.selected,
        onSelect: (id) => { state.selected = id; update(); },
      });
      gmap.filter(visible().map((s) => s.id));
      setStatus('ok');
    })
    .catch((err) => { if (root.isConnected) showFallback(err.message in STATUS ? err.message : 'load-error'); });
}
