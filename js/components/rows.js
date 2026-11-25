import { esc, fmtNumber, fmtDate, fmtShortDate } from '../ui/util.js';
import { icon } from '../ui/icons.js';
import { fishArt } from '../ui/fish-art.js';
import { gearArt } from '../ui/scenery.js';
import { Pill } from './card.js';

/** Fangstrække (åbner detaljer via data-catch-id): illustration, art, sted/dato, længde og vægt. */
export function CatchRow(c, fish) {
  return `<li>
    <button type="button" class="row row--button" data-catch-id="${esc(c.id)}" aria-label="${esc(fish.name)}, ${fmtNumber(c.cm)} cm. Vis detaljer">
      <span class="row__art">${fishArt(fish)}</span>
      <span class="row__main">
        <span class="row__title">${esc(fish.name)}</span>
        <span class="row__meta">${c.place ? `${esc(c.place)} · ` : ''}<time datetime="${esc(c.date)}" title="${esc(fmtDate(c.date))}">${esc(fmtShortDate(c.date))}</time></span>
      </span>
      <span class="row__aside">
        <span class="row__value">${fmtNumber(c.cm)} cm</span>
        ${c.kg != null ? `<span class="t-meta t-num">${fmtNumber(c.kg)} kg</span>` : ''}
      </span>
      <span class="row__chev">${icon('chevronRight', { size: 18 })}</span>
    </button>
  </li>`;
}

export const CatchList = (list, fishById) =>
  `<ul class="list">${list.map((c) => CatchRow(c, fishById[c.fishId])).join('')}</ul>`;

/** Grejrække. Ingen pil – der er endnu ingen detaljeside (ingen døde knapper). */
export function GearRow(g) {
  return `<li class="row">
    <span class="row__art row__art--square">${gearArt(g.cat, g.accent)}</span>
    <span class="row__main">
      <span class="row__title">${esc(g.name)}${g.primary ? Pill({ text: 'Primær', variant: 'success' }) : ''}</span>
      <span class="row__meta">${esc(g.spec)}</span>
    </span>
    ${g.qty > 1 ? `<span class="row__aside"><span class="row__value">${g.qty}</span><span class="t-meta">stk.</span></span>` : ''}
  </li>`;
}

/** Fremhævet personlig rekord (stort fiskebillede). fish = art fra fishWithRecords() med .record. */
export function RecordCard(fish) {
  const r = fish.record;
  return `<article class="card record-card">
    <div class="record-card__art">${fishArt(fish)}</div>
    <div class="record-card__info">
      <div>
        <h3 class="t-h3">${esc(fish.name)}</h3>
        <p class="t-meta" style="font-style:italic">${esc(fish.latin)}</p>
      </div>
      <dl class="record-card__stats t-num">
        <div><dt class="sr-only">Længde</dt><dd>${fmtNumber(r.cm)} cm</dd></div>
        ${r.kg != null ? `<div><dt class="sr-only">Vægt</dt><dd>${fmtNumber(r.kg)} kg</dd></div>` : ''}
        <div><dt class="sr-only">Fanget</dt><dd class="t-meta">${esc(fmtShortDate(r.date))}</dd></div>
      </dl>
    </div>
  </article>`;
}

/** Kompakt rekordrække til "Se alle". */
export function RecordRow(fish) {
  const r = fish.record;
  return `<li class="row">
    <span class="row__art">${fishArt(fish)}</span>
    <span class="row__main"><span class="row__title">${esc(fish.name)}</span><span class="row__meta">${r.kg != null ? `${fmtNumber(r.kg)} kg · ` : ''}${esc(fmtShortDate(r.date))}</span></span>
    <span class="row__aside"><span class="row__value">${fmtNumber(r.cm)} cm</span></span>
  </li>`;
}
