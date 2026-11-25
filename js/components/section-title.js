import { esc } from '../ui/util.js';
import { icon } from '../ui/icons.js';

/**
 * Sektionstitel med valgfri handling til højre ("Se alle ›").
 * action: { label, href } for navigation eller { label, attrs } for en knap (fx udvid/fold sammen).
 */
export function SectionTitle({ title, id, level = 2, action }) {
  let actionHtml = '';
  if (action?.href) {
    actionHtml = `<a class="link-btn" href="${esc(action.href)}">${esc(action.label)}${icon('chevronRight', { size: 16 })}</a>`;
  } else if (action) {
    actionHtml = `<button type="button" class="link-btn" ${action.attrs ?? ''}>${esc(action.label)}${icon('chevronRight', { size: 16 })}</button>`;
  }
  return `<div class="section-title"><h${level} class="t-h${level === 2 ? 2 : 3}" ${id ? `id="${esc(id)}"` : ''}>${esc(title)}</h${level}>${actionHtml}</div>`;
}

/** Sektion = titel + indhold, med korrekt aria-labelledby. */
export function Section({ title, id, action, body, className = '' }) {
  return `<section class="section ${className}" aria-labelledby="${esc(id)}">${SectionTitle({ title, id, action })}${body}</section>`;
}
