import { esc, cx } from '../ui/util.js';
import { icon } from '../ui/icons.js';

/** Statistikfelt. value er allerede formateret tekst; `total` vises som " / 25". */
export function StatTile({ iconName, value, total, label, align }) {
  return `<div class="${cx('stat', align === 'left' && 'stat--left')}">
    ${iconName ? `<span class="stat__icon">${icon(iconName, { size: 26 })}</span>` : ''}
    <span class="stat__value">${esc(value)}${total != null ? `<small> / ${esc(total)}</small>` : ''}</span>
    <span class="stat__label">${esc(label)}</span>
  </div>`;
}

export function StatRow(tiles) {
  return `<div class="stat-row">${tiles.map(StatTile).join('')}</div>`;
}

/** Fremdriftsbjælke med overskrift og værdi. */
export function ProgressBar({ label, value, max, caption }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return `<div class="progress">
    <div class="progress__head"><span class="t-h3">${esc(label)}</span><span class="t-meta t-num">${esc(caption ?? `${value} / ${max}`)}</span></div>
    <div class="progress__track" role="progressbar" aria-label="${esc(label)}" aria-valuemin="0" aria-valuemax="${max}" aria-valuenow="${value}">
      <div class="progress__fill" style="width:${pct}%"></div>
    </div>
  </div>`;
}
