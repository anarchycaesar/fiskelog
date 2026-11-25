// Stedsguide: hvad kan man fange, hvad skal man være opmærksom på, og hvilken bait.
// UDKAST med generel viden – ret til, efterhånden som du lærer vandene at kende.
// Regler (mindstemål, fredningstid, fiskekort) varierer: tjek altid de gældende regler.

export const guide = {
  buresoe: {
    notes: [
      'Gedden står ofte i kanten af sivbælter og over undervandsplanter.',
      'Tjek om der kræves fiskekort, og hvad der gælder for gedde i fredningstiden.',
      'Varmt, stille vejr om sommeren giver ofte aborrer tæt på kanten morgen og aften.',
    ],
    bait: {
      gedde: ['Wobler eller jerkbait i naturlige farver', 'Gummifisk (shad) 12–18 cm', 'Blink/spinner langs sivkanten'],
      aborre: ['Små spinnere eller mini-jigs', 'Orm eller regnorm på flåd', 'Små gummifisk (5–8 cm)'],
    },
  },
  furesoeen: {
    notes: [
      'Stor og dyb sø: fisk langs kanter, skrænter og ved moler.',
      'Der kan være bådtrafik og bølger, så vær opmærksom på vejret.',
      'Tjek lokale regler og fiskekort.',
    ],
    bait: {
      aborre: ['Små gummifisk og jigs', 'Mini-spinnere', 'Regnorm på fast bund'],
      skalle: ['Fladfiskeri med majs, maddike eller brød', 'Lille krog og tynd line'],
      gedde: ['Shad og wobler', 'Spinnerbait over vegetation'],
    },
  },
  gudenaaen: {
    notes: [
      'Strømmen skifter: søg dybe huller, bagvande og kanter bag sten.',
      'Pas på glatte bredder og stigende vandstand efter regn.',
      'Ørred er ofte fredet i dele af året – tjek reglerne for din strækning.',
    ],
    bait: {
      orred: ['Små spinnere og blink', 'Små wobler', 'Orm i strømmen (hvor det er tilladt)'],
      gedde: ['Gummifisk og wobler i rolige partier', 'Spinner ved vegetation'],
    },
  },
  limfjorden: {
    notes: [
      'Vind og strøm betyder meget – fisk gerne ved skiftende strøm.',
      'Mange stenrev og tangbælter, som kan give hug, men også tabte fisk.',
      'Mindstemål og fredningstider for havørred og torsk skal tjekkes.',
    ],
    bait: {
      havorred: ['Kystblink', 'Små fluer eller strømmer med flue', 'Wobler langs kanter'],
      torsk: ['Pilk eller jig fra båd', 'Hel sild eller makrel som agn'],
    },
  },
  vejlefjord: {
    notes: [
      'Fisk tæt på kysten ved skiftende lys: morgen og aften er ofte bedst.',
      'Tjek regler for havørred, især fredning og mindstemål.',
      'Vær opmærksom på tang og bund, så du undgår at hænge fast.',
    ],
    bait: {
      havorred: ['Kystblink 18–25 g', 'Fluer/strømmer', 'Små wobler'],
    },
  },
  oeresund: {
    notes: [
      'Skiftende strøm og vind – brug vindudsigten og vær forsigtig fra kyst og båd.',
      'Torsk og havørred har egne regler: mindstemål, fredning og fangstgrænser.',
      'Tjek vejret, og fisk aldrig alene ved høj sø.',
    ],
    bait: {
      torsk: ['Pilk og jig', 'Sild eller makrel som agn'],
      havorred: ['Kystblink', 'Fluer og små wobler'],
    },
  },
};

export const guideFor = (spotId) => guide[spotId] || { notes: [], bait: {} };

/** Generel viden for vande, appen ikke kender endnu – efter vandtype. */
export const genericSpecies = {
  'Sø': ['aborre', 'gedde', 'skalle', 'karpe'],
  'Å': ['orred', 'gedde'],
  'Kyst': ['havorred', 'torsk', 'hornfisk'],
  'Hav': ['torsk', 'havorred', 'hornfisk'],
  'Ø': ['havorred', 'torsk', 'hornfisk'],
};

export const genericNotes = {
  'Sø': ['Fisk langs kanter, sivbælter, undervandsplanter og dybdeskift.', 'Tjek om der kræves fiskekort, og hvilke regler der gælder.'],
  'Å': ['Søg dybe huller, bagvande og kanter bag sten.', 'Pas på glatte bredder og stigende vandstand efter regn. Tjek fredningstider.'],
  'Kyst': ['Fisk ved skiftende lys og strøm. Tjek vejr og vind.', 'Mindstemål og fredningstider gælder for havørred og torsk.'],
  'Hav': ['Tjek vejr, vind og strøm. Fisk aldrig alene ved høj sø.', 'Mindstemål og fredningstider gælder for havørred og torsk.'],
  'Ø': ['Fisk langs kysten, hvor der er strøm, tang og skift i dybden.', 'Mindstemål og fredningstider gælder for havørred og torsk.'],
};

/** Bait til en art: første kendte guide, hvor arten optræder. */
export function baitFor(fishId) {
  for (const g of Object.values(guide)) if (g.bait?.[fishId]) return g.bait[fishId];
  return [];
}
