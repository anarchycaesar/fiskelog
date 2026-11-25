import { esc, cx, fmtNumber } from '../ui/util.js';
import { icon } from '../ui/icons.js';
import { fishArt } from '../ui/fish-art.js';
import { Pill, Note } from './card.js';
import { StatTile } from './stat.js';

/**
 * Fiskekort til samlingen. f = art fra fishWithRecords() (med .record og .catchCount).
 * Klik åbner detaljer (håndteres via data-fish-id).
 */
export function FishCard(f) {
  const caught = Boolean(f.record);
  const meta = caught
    ? Pill({ html: `Min rekord: <strong>${fmtNumber(f.record.cm)} cm</strong>` }) +
      (f.record.kg != null ? Pill({ html: `<strong>${fmtNumber(f.record.kg)}</strong> kg`, variant: 'gold', iconName: 'scale' }) : '')
    : Pill({ text: 'Ikke fanget endnu', variant: 'muted', iconName: 'lock' });

  return `<button type="button" class="${cx('card card--interactive fish-card', !caught && 'is-locked')}" data-fish-id="${esc(f.id)}"
      aria-label="${esc(f.name)} – ${caught ? `rekord ${fmtNumber(f.record.cm)} cm` : 'ikke fanget endnu'}. Vis detaljer">
    <span class="fish-card__art">${fishArt(f)}</span>
    <span class="fish-card__body">
      <span class="fish-card__name t-h3">${esc(f.name)}</span>
      <span class="fish-card__latin">${esc(f.latin)}</span>
      <span class="fish-card__meta">${meta}</span>
    </span>
    <span class="fish-card__chev">${icon('chevronRight', { size: 20 })}</span>
  </button>`;
}

/** Indhold til fiskens detaljemodal. */
export function FishDetail(f) {
  const caught = Boolean(f.record);
  return `
    <div class="fish-detail__art ${caught ? '' : 'is-locked'}">${fishArt(f, { decorative: false })}</div>
    <div class="cluster">${Pill({ text: f.water, iconName: 'water' })}${caught ? Pill({ text: 'Fanget', variant: 'success', iconName: 'check' }) : Pill({ text: 'Ikke fanget endnu', variant: 'muted', iconName: 'lock' })}</div>
    ${caught ? `<div class="grid grid--3">
        ${StatTile({ iconName: 'ruler', value: `${fmtNumber(f.record.cm)} cm`, label: 'Rekord' })}
        ${StatTile({ iconName: 'scale', value: f.record.kg == null ? '–' : `${fmtNumber(f.record.kg)} kg`, label: 'Vægt' })}
        ${StatTile({ iconName: 'log', value: f.catchCount, label: f.catchCount === 1 ? 'Fangst' : 'Fangster' })}
      </div>` : ''}
    ${Note({ text: 'Fiskeguiden med levested, sæson og metoder tilføjes, når fiskebiblioteket bygges.', iconName: 'book' })}`;
}
