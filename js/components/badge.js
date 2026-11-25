import { esc, cx } from '../ui/util.js';
import { badgeArt } from '../ui/badge-art.js';
import { Pill, Note } from './card.js';

/**
 * Badge for en fiskeklasse. interactive = knap der åbner detaljer (data-badge-id).
 * size: 'sm' | 'md' | 'lg'
 */
export function Badge(cls, { size = 'md', interactive = true, showLabel = true } = {}) {
  const className = cx('badge', `badge--${size}`, !cls.unlocked && 'is-locked');
  const inner = `<span class="badge__art">${badgeArt(cls)}</span>${showLabel ? `<span class="badge__label">${esc(cls.name)}</span>` : ''}`;
  const status = cls.unlocked ? 'oplåst' : 'låst';
  return interactive
    ? `<button type="button" class="${className}" data-badge-id="${esc(cls.id)}" aria-label="${esc(cls.name)}-badge, ${status}. Vis detaljer">${inner}</button>`
    : `<div class="${className}" role="img" aria-label="${esc(cls.name)}-badge, ${status}">${inner}</div>`;
}

export const BadgeStrip = (list) => `<div class="badge-strip">${list.map((c) => Badge(c)).join('')}</div>`;
export const BadgeGrid = (list) => `<div class="badge-grid">${list.map((c) => Badge(c)).join('')}</div>`;

/** Indhold til badge-modal. */
export function BadgeDetail(cls) {
  return `<div class="badge-detail">
      ${Badge(cls, { size: 'lg', interactive: false, showLabel: false })}
      <div class="cluster" style="justify-content:center">
        ${cls.special ? Pill({ text: 'Særligt badge', variant: 'gold', iconName: 'medal' }) : Pill({ text: 'Fiskeklasse', iconName: 'layers' })}
        ${cls.unlocked ? Pill({ text: 'Oplåst', variant: 'success', iconName: 'check' }) : Pill({ text: 'Låst', variant: 'muted', iconName: 'lock' })}
      </div>
    </div>`;
}
