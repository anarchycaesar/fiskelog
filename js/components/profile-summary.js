import { esc } from '../ui/util.js';
import { icon } from '../ui/icons.js';
import { avatarInitial } from '../ui/scenery.js';
import { StatRow } from './stat.js';

/** Profilhoved: billede, navn og aktivitet. Placeres i topbarens extra-område. */
export function ProfileSummary(user, { catchCount }) {
  return `<div class="profile-summary">
    <div class="avatar avatar--ring" role="img" aria-label="Profilbillede for ${esc(user.name)}">${avatarInitial(user.name)}</div>
    <div>
      <p class="t-h2 profile-summary__name">${esc(user.name)}</p>
      <p class="profile-summary__since">${icon('log', { size: 16 })}${catchCount === 0 ? 'Ingen fangster endnu' : `${catchCount} ${catchCount === 1 ? 'fangst' : 'fangster'} registreret`}</p>
    </div>
  </div>`;
}

/** Nøgletal på Profil: arter og klasser. */
export function ProfileStats({ species, speciesTotal }, classes) {
  const regular = classes.filter((c) => !c.special);
  return StatRow([
    { iconName: 'fish', value: species, total: speciesTotal, label: 'Arter' },
    { iconName: 'medal', value: regular.filter((c) => c.unlocked).length, total: regular.length, label: 'Klasser' },
  ]);
}
