// FAST REFERENCEDATA (midlertidigt eksempeludvalg)
// Arter, fiskeklasser, fiskesteder og grejkategorier. Brugerens egne data (profil, fangster)
// ligger IKKE her, men i store.js.

export const user = {
  name: 'Marcus',
  firstName: 'Marcus',
};

/** Fiskeklasser (badges). Big Five er et særligt badge og tælles ikke som klasse.
 *  Alle er låst; der er intet pointsystem. */
export const classes = [
  { id: 'ferskvand',   name: 'Ferskvand',   colors: ['#5FAF86', '#1B5E52'], unlocked: false,  featured: true },
  { id: 'saltvand',    name: 'Saltvand',    colors: ['#4FA3CC', '#164B70'], unlocked: false,  featured: true },
  { id: 'brakvand',    name: 'Brakvand',    colors: ['#9CC27A', '#3E7A52'], unlocked: false },
  { id: 'laksefisk',   name: 'Laksefisk',   colors: ['#6FB0D2', '#1E5C86'], unlocked: false },
  { id: 'karpefisk',   name: 'Karpefisk',   colors: ['#EDB54A', '#B06E16'], unlocked: false },
  { id: 'rovfisk',     name: 'Rovfisk',     colors: ['#7FA878', '#34503F'], unlocked: false,  featured: true },
  { id: 'aleklassen',  name: 'Åleklassen',  colors: ['#5C9DB0', '#1F4F63'], unlocked: false },
  { id: 'pelagiske',   name: 'Pelagiske',   colors: ['#6AA6DA', '#1D4F86'], unlocked: false },
  { id: 'vandrefisk',  name: 'Vandrefisk',  colors: ['#55B0C0', '#1C5F78'], unlocked: false },
  { id: 'stationaere', name: 'Stationære',  colors: ['#8DB087', '#3F6B4A'], unlocked: false },
  { id: 'bigfive',     name: 'Big Five',    colors: ['#F2CE5C', '#B3800A'], unlocked: false,  featured: true, special: true },
];

/** Udvalg af arter til fiskesamlingen. Rekorder og "fanget" udledes af brugerens fangster (store.js). */
export const fish = [
  { id: 'aborre', name: 'Aborre', latin: 'Perca fluviatilis', water: 'Ferskvand', art: { depth: 21, back: '#3E5A2A', body: '#86A043', belly: '#EBE4B2', fin: '#E0672A', dorsalColor: '#56653F', pattern: 'bars', bars: 6, dorsal: [56, 122], dorsalH: 0.7 } },
  { id: 'gedde', name: 'Gedde', latin: 'Esox lucius', water: 'Ferskvand', photo: 'img/fisk/gedde.jpg', art: { depth: 12, back: '#3D5528', body: '#7A8C40', belly: '#E6E2B8', fin: '#A08E42', pattern: 'spots', dorsal: [124, 152], anal: [122, 150], snout: 0.35, tail: 1.4 } },
  { id: 'havorred', name: 'Havørred', latin: 'Salmo trutta trutta', water: 'Saltvand', art: { depth: 15.5, back: '#4D6577', body: '#BCC9D2', belly: '#F4F6F7', fin: '#7F95A3', pattern: 'dots', dorsal: [72, 104] } },
  { id: 'orred', name: 'Bækørred', latin: 'Salmo trutta fario', water: 'Ferskvand', art: { depth: 15, back: '#5C5A3A', body: '#B39A5A', belly: '#F1E6C8', fin: '#8C7A50', pattern: 'dots', red: true, dorsal: [72, 104] } },
  { id: 'sandart', name: 'Sandart', latin: 'Sander lucioperca', water: 'Brakvand', photo: 'img/fisk/sandart.jpg', art: { depth: 14, back: '#4D5A4A', body: '#9AA48B', belly: '#ECEBDD', fin: '#7E8A72', pattern: 'bars', bars: 7, dorsal: [52, 108] } },
  { id: 'torsk', name: 'Torsk', latin: 'Gadus morhua', water: 'Saltvand', art: { depth: 16, back: '#6B6440', body: '#ABA170', belly: '#EFEBDD', fin: '#8C8460', pattern: 'mottled', lateral: true, dorsal: [56, 96], anal: [100, 140] } },
  { id: 'skalle', name: 'Skalle', latin: 'Rutilus rutilus', water: 'Ferskvand', art: { depth: 16, back: '#3E5562', body: '#B9C5C8', belly: '#F2F2EC', fin: '#D85A3A', pattern: 'scales', dorsal: [76, 104] } },
  { id: 'karpe', name: 'Karpe', latin: 'Cyprinus carpio', water: 'Ferskvand', art: { depth: 22, back: '#6B4E1E', body: '#C2953A', belly: '#F0D99A', fin: '#9A6A2A', pattern: 'scales', dorsal: [62, 140], dorsalH: 0.45 } },
  { id: 'hornfisk', name: 'Hornfisk', latin: 'Belone belone', water: 'Saltvand', art: { depth: 7, back: '#2E6E66', body: '#7FB0A8', belly: '#EAF2EF', fin: '#5E8E86', pattern: 'none', snout: 1, dorsal: [138, 154], anal: [134, 152], dorsalH: 1 } },
];

export const fishById = Object.fromEntries(fish.map((f) => [f.id, f]));

/** Fiskesteder. lat/lng bruges af Google Maps; x/y af det stiliserede reservekort (400×360). */
export const spots = [
  { id: 'buresoe',   name: 'Buresø',      area: 'Allerød, Nordsjælland', type: 'Sø',   lat: 55.9060, lng: 12.2370, x: 300, y: 178, species: ['gedde', 'aborre'] },
  { id: 'furesoeen', name: 'Furesøen',    area: 'Nordsjælland',          type: 'Sø',   lat: 55.7990, lng: 12.4140, x: 322, y: 150, species: ['aborre', 'skalle', 'gedde'] },
  { id: 'gudenaaen', name: 'Gudenåen',    area: 'Midtjylland',           type: 'Å',    lat: 56.1690, lng: 9.5450, x: 128, y: 158, species: ['orred', 'gedde'] },
  { id: 'limfjorden',name: 'Limfjorden',  area: 'Nordjylland',           type: 'Kyst', lat: 56.9700, lng: 9.2500, x: 112, y: 92,  species: ['havorred', 'torsk'] },
  { id: 'vejlefjord',name: 'Vejle Fjord', area: 'Østjylland',            type: 'Kyst', lat: 55.7010, lng: 9.6200, x: 172, y: 212, species: ['havorred'] },
  { id: 'susaaen',    name: 'Susåen',      area: 'Næstved, Sydsjælland',  type: 'Å',    lat: 55.2377, lng: 11.7513, x: 304, y: 202, species: ['gedde', 'aborre', 'skalle'] },
  { id: 'oeresund',  name: 'Øresund',     area: 'Kysten nord for København', type: 'Kyst', lat: 55.8550, lng: 12.6000, x: 350, y: 168, species: ['torsk', 'havorred'] },
];

/** Grej pr. kategori. unit: hvordan oversigten tæller ('stk' = antal i alt, 'typer' = antal poster). */
export const gearCategories = [
  { id: 'stang',    label: 'Stænger',  single: 'Stang',    unit: 'stk' },
  { id: 'hjul',     label: 'Hjul',     single: 'Hjul',     unit: 'stk' },
  { id: 'line',     label: 'Liner',    single: 'Line',     unit: 'typer' },
  { id: 'agn',      label: 'Agn',      single: 'Agn',      unit: 'stk' },
  { id: 'endegrej', label: 'Endegrej', single: 'Endegrej', unit: 'typer' },
];

export const gear = []; // brugerens grej – tilføjes i en senere opgave

