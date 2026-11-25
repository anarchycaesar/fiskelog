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
  susaaen: {
    notes: [
      'Sjællands længste å løber gennem Næstved og ud i Karrebæk Fjord. Ved Gerdrup, få kilometer fra Næstved, er der dybe huller og store fisk.',
      'Flere foreninger har fiskeretten i Susåen. Du skal have et fiskekort eller være medlem, før du fisker. Spørg lokalt, hvor du må være.',
      'Søg dybe huller, bagvande og kanter. Gedden står ofte stille i de rolige partier.',
      'Der sejler kanoer og kajakker på åen om sommeren. Pas på dem, og pas på glatte bredder.',
    ],
    bait: {
      gedde: ['Gummifisk (shad) 12-18 cm', 'Wobler eller jerkbait', 'Brug altid stålforfang'],
      aborre: ['Små spinnere og mini-jigs', 'Regnorm på fast bund', 'Små gummifisk (5-8 cm)'],
      skalle: ['Majs, maddiker eller brød på flåd', 'Lille krog og tynd line'],
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

/** Enkel startgrej pr. art, skrevet til nybegyndere. UDKAST. */
export const starterGear = {
  aborre: { rod: 'Let spinnestang, ca. 2-2,4 m (5-25 g)', line: 'Monofil 0,20 mm', lure: 'Små spinnere, mini-jigs eller regnorm' },
  gedde: { rod: 'Middel spinnestang, ca. 2,4-2,7 m (10-40 g)', line: 'Flettet line 0,15-0,20 mm', lure: 'Gummifisk eller wobler, og stålforfang (gedden bider line over)' },
  skalle: { rod: 'Let fladfiskestang eller teleskopstang', line: 'Monofil 0,16 mm med flåd', lure: 'Krog str. 14-16 med majs, maddiker eller brød' },
  orred: { rod: 'Let spinnestang, ca. 2-2,4 m (3-15 g)', line: 'Monofil 0,20 mm', lure: 'Små spinnere eller blink' },
  havorred: { rod: 'Kystspinnestang, ca. 2,7-3 m (10-40 g)', line: 'Flettet line 0,15-0,20 mm', lure: 'Kystblink 15-25 g' },
  torsk: { rod: 'Kraftig pilkestang eller kyststang', line: 'Flettet line 0,25-0,30 mm', lure: 'Pilk 100-200 g eller jig' },
  hornfisk: { rod: 'Let kyststang', line: 'Monofil 0,25 mm', lure: 'Små blink eller flue, ofte om foråret' },
  karpe: { rod: 'Karpestang eller kraftig fladfiskestang', line: 'Monofil 0,30 mm', lure: 'Majs, boilies eller brød på bundløb' },
  sandart: { rod: 'Middel spinnestang', line: 'Flettet line 0,15 mm', lure: 'Små gummifisk (8-12 cm)' },
};

/** Det alle begyndere skal have: fælles ekstra udstyr. */
export const commonGear = ['Fisketegn (se reglerne)', 'Net eller grebstang til at lande fisken', 'Tang til at fjerne krogen', 'Målebånd, så du kan tjekke mindstemål'];

/** Regler, kvalitetssikret mod Fiskeristyrelsen og fisketegn.dk. Tjek altid de gældende regler. */
export const rules = [
  'Fisketegn: Alle fra 18 år og til folkepensionsalderen skal have et fisketegn for at lystfiske. Det kan købes som dagstegn, ugetegn eller årstegn.',
  'Fiskekort: I mange søer og åer skal du også have et fiskekort fra den lokale forening eller lodsejeren. Put & take-søer er undtaget fisketegnet.',
  'Mindstemål og fredningstider: De gælder for mange arter. Tjek dem, før du tager en fisk med hjem.',
];

export const ruleLinks = [
  { label: 'Køb fisketegn', url: 'https://www.fisketegn.dk' },
  { label: 'Regler og fredningstider', url: 'https://fiskeristyrelsen.dk/lyst-og-fritidsfiskeri/' },
];

export const steps = [
  'Køb fisketegn og tjek, om vandet kræver fiskekort.',
  'Tag startgrejet med, og kom tidligt om morgenen eller sidst på dagen. Det er ofte bedst.',
  'Find en plads med adgang til vandet. Vær stille, og kast mod kanter, sivbælter og dybdeskift.',
  'Behandl fisken forsigtigt. Tjek mindstemålet, og sæt for små eller fredede fisk ud igen.',
  'Registrér din fangst her i appen.',
];
