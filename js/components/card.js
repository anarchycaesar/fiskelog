import { esc, cx } from '../ui/util.js';
import { icon } from '../ui/icons.js';

/**
 * Informationskort. `body` er betroet HTML (fra andre komponenter).
 * variant: undefined | 'tint' | 'deep' ; flush = ingen indre padding (til lister).
 */
export function Card({ body, variant, flush = false, tag = 'div', className = '', attrs = '' }) {
  const cls = cx('card', variant && `card--${variant}`, flush && 'card--flush', className);
  return `<${tag} class="${cls}" ${attrs}>${body}</${tag}>`;
}

/** Ærlig statusnote, fx "kommer i en senere version". */
export function Note({ text, iconName = 'info' }) {
  return `<p class="note">${icon(iconName, { size: 18 })}<span>${esc(text)}</span></p>`;
}

/** Lille tag/pill. `html` tillader fx <strong>. */
export function Pill({ text, html, variant, iconName }) {
  return `<span class="${cx('pill', variant && `pill--${variant}`)}">${iconName ? icon(iconName, { size: 14 }) : ''}${html ?? esc(text)}</span>`;
}

/** Tomtilstand til lister/filtre uden resultater. */
export function EmptyState({ title, text, iconName = 'search', action = '' }) {
  return `<div class="empty"><div class="empty__icon">${icon(iconName)}</div>
    <p class="t-h3" style="color:var(--c-deep)">${esc(title)}</p>
    ${text ? `<p class="t-meta" style="margin-top:4px">${esc(text)}</p>` : ''}
    ${action ? `<div class="empty__action">${action}</div>` : ''}</div>`;
}
