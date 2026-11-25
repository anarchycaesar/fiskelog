import { esc, cx } from '../ui/util.js';
import { icon } from '../ui/icons.js';

/**
 * Knap. Bliver et <a> når href er sat, ellers en <button>.
 * variant: 'primary' | 'secondary' | 'tertiary' | 'on-dark'
 */
export function Button({ label, variant = 'primary', iconName, href, size, block = false, attrs = '', type = 'button' }) {
  const className = cx('btn', `btn--${variant}`, size === 'sm' && 'btn--sm', block && 'btn--block');
  const inner = `${iconName ? icon(iconName, { size: size === 'sm' ? 16 : 18 }) : ''}<span>${esc(label)}</span>`;
  return href
    ? `<a class="${className}" href="${esc(href)}" ${attrs}>${inner}</a>`
    : `<button type="${esc(type)}" class="${className}" ${attrs}>${inner}</button>`;
}

/** Rund ikonknap (fx i topbaren). label er påkrævet af hensyn til skærmlæsere. */
export function IconButton({ iconName, label, href, onDark = false, current = false, className = '', attrs = '' }) {
  const cls = cx('icon-btn', onDark && 'icon-btn--on-dark', className);
  const aria = `aria-label="${esc(label)}" title="${esc(label)}" ${current ? 'aria-current="page"' : ''}`;
  return href
    ? `<a class="${cls}" href="${esc(href)}" ${aria} ${attrs}>${icon(iconName, { size: 20 })}</a>`
    : `<button type="button" class="${cls}" ${aria} ${attrs}>${icon(iconName, { size: 20 })}</button>`;
}
