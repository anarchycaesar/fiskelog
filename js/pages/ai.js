import { PageLayout } from '../components/page.js';
import { Card, Note, EmptyState } from '../components/card.js';

export const title = 'AI-fiskerådgiver';

export function render() {
  const body = `
    ${Card({ body: EmptyState({
      title: 'Rådgiveren er ikke koblet på endnu',
      text: 'Den skal give forslag til grej og fremgangsmåde ud fra fiskested, årstid og forhold – og dit eget udstyr.',
      iconName: 'sparkle',
    }) })}
    ${Note({ text: 'Selve AI-rådgivningen bygges i en senere opgave.', iconName: 'sparkle' })}`;

  return PageLayout({ route: 'ai', eyebrow: 'Personlig rådgivning', title: 'AI Fiskerådgiver', body });
}
