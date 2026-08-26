// Data + geometry for the interactive EQ-i 2.0 wheel shown on /profiel/eq-i.
//
// Everything in this module is PURE and evaluated at import time, so the wheel
// renders identically during the build (prerender) and in the browser. Do not
// introduce anything here that reads the DOM, the viewport, the clock or
// randomness – the wheel is baked into the static HTML and any divergence would
// cause a hydration mismatch (see .agents/memory/q4-prerender-hydration.md).
import type { Lang } from "@/lib/i18n";
import { EQI_WHEEL_COLORS } from "@/lib/profiles";

/* ---------------------------------------------------------------- *
 * Content
 * ---------------------------------------------------------------- */

/**
 * One of the fifteen subscales.
 *
 * `name` is what the wheel draws on its bands; `explanation` and `practice`
 * are only read by the surrounding page (the model's detail panel, the
 * subscale overview and the mobile cards), so all three live together and no
 * consumer has to keep a parallel list of names in step with this one.
 */
/**
 * A subscale of a composite scale.
 *
 * Only `name` is shown to the public: Q4 does not want the subscale
 * definitions on the website, because they belong in the debrief of an actual
 * profile and in the certification training. `explanation` and `practice` are
 * kept here for surfaces where a certified professional is present.
 */
export type EqiSub = {
  name: Record<Lang, string>;
  explanation: Record<Lang, string>;
  /** "How do you see this at work?" – one concrete situation. */
  practice: Record<Lang, string>;
};

export type EqiComposite = {
  id: string;
  name: Record<Lang, string>;
  question: Record<Lang, string>;
  explanation: Record<Lang, string>;
  subs: EqiSub[];
  /** Base colour, taken from the official EQ-i 2.0 palette. */
  color: string;
  /** Lighter tint used for the three subscale bands. */
  light: string;
  /** Darker shade, used for label text on the light bands. */
  dark: string;
};

/** The three subscale names of a composite, in wheel order. */
export function subNames(comp: EqiComposite, lang: Lang): string[] {
  return comp.subs.map((s) => s.name[lang]);
}

/** Mix a hex colour towards a target hex colour. `t` runs 0 → 1. */
function mix(hex: string, target: string, t: number): string {
  const parse = (h: string) =>
    [1, 3, 5].map((i) => parseInt(h.substr(i, 2), 16));
  const [r1, g1, b1] = parse(hex);
  const [r2, g2, b2] = parse(target);
  const c = (a: number, b: number) => Math.round(a + (b - a) * t);
  return (
    "#" +
    [c(r1, r2), c(g1, g2), c(b1, b2)]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
  );
}

const WHITE = "#ffffff";
const BLACK = "#000000";

type CompositeSeed = Omit<EqiComposite, "color" | "light" | "dark">;

// Order is the official clockwise reading order of the wheel, starting at
// Self-Perception. It must stay in step with EQI_WHEEL_COLORS in profiles.ts,
// which drives the colour bar on the EQ-i profile cards – one palette site-wide.
const COMPOSITE_SEEDS: CompositeSeed[] = [
  {
    id: "zelfperceptie",
    name: { nl: "Zelfperceptie", en: "Self-Perception" },
    question: { nl: "Hoe zie ik mezelf?", en: "How do I see myself?" },
    explanation: {
      nl: "Zelfperceptie gaat over hoe goed je jezelf kent en waardeert, en of je richting geeft aan je eigen ontwikkeling. Het is het fundament van het model: wie zichzelf niet scherp ziet, kan zich ook moeilijk uiten of anderen goed inschatten.",
      en: "Self-Perception is about how well you know and value yourself, and whether you give direction to your own development. It is the foundation of the model: if you do not see yourself clearly, it is hard to express yourself or to read others well.",
    },
    subs: [
      {
        name: { nl: "Zelfbeeld", en: "Self-Regard" },
        explanation: {
          nl: "Jezelf waarderen met een realistisch oog voor zowel je kwaliteiten als je beperkingen. Zelfrespect zonder zelfoverschatting.",
          en: "Valuing yourself with a realistic eye for both your qualities and your limitations. Self-respect without overestimating yourself.",
        },
        practice: {
          nl: "Je kunt kritiek ontvangen zonder dat je zelfvertrouwen erdoor onderuit gaat.",
          en: "You can take criticism without it knocking your confidence over.",
        },
      },
      {
        name: { nl: "Zelfactualisatie", en: "Self-Actualization" },
        explanation: {
          nl: "Betekenisvolle doelen nastreven en jezelf blijven ontwikkelen. Het gevoel dat je bezig bent met iets wat ertoe doet.",
          en: "Pursuing meaningful goals and continuing to develop yourself. The sense that you are working on something that matters.",
        },
        practice: {
          nl: "Je zoekt uit jezelf nieuwe uitdagingen op in plaats van te wachten tot ze langskomen.",
          en: "You seek out new challenges yourself instead of waiting for them to come along.",
        },
      },
      {
        name: { nl: "Emotioneel zelfbewustzijn", en: "Emotional Self-Awareness" },
        explanation: {
          nl: "Herkennen wat je voelt, begrijpen waar dat vandaan komt, en zien welk effect het heeft op je denken en doen.",
          en: "Recognising what you feel, understanding where it comes from, and seeing the effect it has on your thinking and doing.",
        },
        practice: {
          nl: "Je merkt tijdens een overleg op dat je geïrriteerd raakt – en weet waarom, vóórdat je reageert.",
          en: "In a meeting you notice you are getting irritated – and know why, before you react.",
        },
      },
    ],
  },
  {
    id: "zelfexpressie",
    name: { nl: "Zelfexpressie", en: "Self-Expression" },
    question: { nl: "Hoe uit ik mezelf?", en: "How do I express myself?" },
    explanation: {
      nl: "Zelfexpressie is zelfperceptie in actie: laten zien en horen wat er in je omgaat, op een manier die anderen begrijpen. Het gaat om openheid, opkomen voor wat je belangrijk vindt en op eigen benen kunnen staan.",
      en: "Self-Expression is Self-Perception in action: showing and voicing what goes on inside you, in a way others understand. It is about openness, standing up for what matters to you, and being able to stand on your own feet.",
    },
    subs: [
      {
        name: { nl: "Emotionele expressie", en: "Emotional Expression" },
        explanation: {
          nl: "Gevoelens open en begrijpelijk overbrengen, in woorden én in non-verbaal gedrag.",
          en: "Conveying feelings openly and understandably, in words as well as in non-verbal behaviour.",
        },
        practice: {
          nl: "Collega's hoeven niet te raden hoe je ergens in staat – je zegt het.",
          en: "Colleagues do not have to guess where you stand – you say it.",
        },
      },
      {
        name: { nl: "Assertiviteit", en: "Assertiveness" },
        explanation: {
          nl: "Je gedachten, gevoelens en overtuigingen op een constructieve manier uitspreken en opkomen voor wat je belangrijk vindt.",
          en: "Voicing your thoughts, feelings and beliefs constructively, and standing up for what matters to you.",
        },
        practice: {
          nl: "Je zegt 'nee' tegen een verzoek zonder de relatie te beschadigen.",
          en: "You say 'no' to a request without damaging the relationship.",
        },
      },
      {
        name: { nl: "Onafhankelijkheid", en: "Independence" },
        explanation: {
          nl: "Zelfsturend zijn en beslissingen kunnen nemen zonder emotioneel afhankelijk te zijn van de bevestiging van anderen.",
          en: "Being self-directed and able to make decisions without being emotionally dependent on other people's approval.",
        },
        practice: {
          nl: "Je houdt vast aan een goed onderbouwd standpunt, ook als de meerderheid iets anders vindt.",
          en: "You hold on to a well-founded position, even when the majority thinks otherwise.",
        },
      },
    ],
  },
  {
    id: "interpersoonlijk",
    name: { nl: "Interpersoonlijk", en: "Interpersonal" },
    question: { nl: "Hoe verbind ik me met anderen?", en: "How do I connect with others?" },
    explanation: {
      nl: "Deze compositeschaal gaat over het opbouwen en onderhouden van relaties die rusten op vertrouwen en wederzijds respect, over aanvoelen wat er bij anderen speelt, en over je verbonden voelen met een groter geheel dan jezelf.",
      en: "This composite scale is about building and maintaining relationships that rest on trust and mutual respect, about sensing what is going on with others, and about feeling connected to something larger than yourself.",
    },
    subs: [
      {
        name: {
          nl: "Interpersoonlijke relaties",
          en: "Interpersonal Relationships",
        },
        explanation: {
          nl: "Wederzijds bevredigende relaties opbouwen en onderhouden, gebaseerd op vertrouwen en oprechte betrokkenheid.",
          en: "Building and maintaining mutually satisfying relationships, based on trust and genuine involvement.",
        },
        practice: {
          nl: "Je investeert in contact als er niets te halen valt – en hebt daardoor krediet als het spannend wordt.",
          en: "You invest in contact when there is nothing to gain – and so have credit when things get tense.",
        },
      },
      {
        name: { nl: "Empathie", en: "Empathy" },
        explanation: {
          nl: "Herkennen, begrijpen en waarderen hoe een ander zich voelt, en daar oprecht rekening mee houden.",
          en: "Recognising, understanding and appreciating how someone else feels, and genuinely taking that into account.",
        },
        practice: {
          nl: "Je merkt dat iemand afhaakt in een gesprek en past je aanpak aan in plaats van door te drukken.",
          en: "You notice someone disengaging in a conversation and adjust your approach instead of pushing on.",
        },
      },
      {
        name: {
          nl: "Sociale verantwoordelijkheid",
          en: "Social Responsibility",
        },
        explanation: {
          nl: "Je verbonden voelen met een groter geheel en bijdragen aan de groep, het team of de samenleving.",
          en: "Feeling connected to a larger whole and contributing to the group, the team or society.",
        },
        practice: {
          nl: "Je pakt taken op die niemands 'eigen' werk zijn, omdat het team er beter van wordt.",
          en: "You pick up tasks that are nobody's 'own' work, because the team is better for it.",
        },
      },
    ],
  },
  {
    id: "besluitvorming",
    name: { nl: "Besluitvorming", en: "Decision Making" },
    question: {
      nl: "Hoe beïnvloeden emoties mijn beslissingen?",
      en: "How do emotions influence my decisions?",
    },
    explanation: {
      nl: "Emoties zijn informatie. Deze compositeschaal gaat over de vraag of je die informatie gebruikt bij het maken van keuzes, zonder je erdoor te laten meeslepen: helder blijven kijken naar wat er werkelijk speelt en niet te snel handelen.",
      en: "Emotions are information. This composite scale is about whether you use that information when making choices, without being swept along by it: keeping a clear view of what is really going on and not acting too quickly.",
    },
    subs: [
      {
        name: { nl: "Probleemoplossen", en: "Problem Solving" },
        explanation: {
          nl: "Problemen aanpakken waarbij emoties een rol spelen, en tot doordachte, werkbare oplossingen komen.",
          en: "Tackling problems in which emotions play a part, and arriving at considered, workable solutions.",
        },
        practice: {
          nl: "Bij een conflict in het team zoek je naar de oorzaak in plaats van naar de schuldige.",
          en: "In a team conflict you look for the cause rather than for the culprit.",
        },
      },
      {
        name: { nl: "Realiteitstoetsing", en: "Reality Testing" },
        explanation: {
          nl: "Objectief blijven kijken naar wat er werkelijk speelt, ook als je eigen wensen of angsten het beeld willen kleuren.",
          en: "Keeping an objective view of what is really going on, even when your own wishes or fears want to colour the picture.",
        },
        practice: {
          nl: "Je toetst je aanname bij anderen voordat je er beleid op maakt.",
          en: "You check your assumption with others before you base policy on it.",
        },
      },
      {
        name: { nl: "Impulscontrole", en: "Impulse Control" },
        explanation: {
          nl: "De neiging tot direct handelen kunnen uitstellen: eerst pauzeren en denken, dan pas doen.",
          en: "Being able to postpone the urge to act at once: pause and think first, act after.",
        },
        practice: {
          nl: "Je slaapt een nacht over die felle e-mail – en verstuurt hem de volgende dag anders.",
          en: "You sleep on that sharply worded email – and send a different one the next day.",
        },
      },
    ],
  },
  {
    id: "stressmanagement",
    name: { nl: "Stressmanagement", en: "Stress Management" },
    question: {
      nl: "Hoe ga ik om met druk en verandering?",
      en: "How do I deal with pressure and change?",
    },
    explanation: {
      nl: "Stressmanagement gaat over veerkracht. Kun je meebewegen als de omstandigheden veranderen, effectief blijven functioneren als de spanning oploopt, en hoopvol blijven na een tegenslag?",
      en: "Stress Management is about resilience. Can you move with changing circumstances, keep functioning effectively when tension rises, and stay hopeful after a setback?",
    },
    subs: [
      {
        name: { nl: "Flexibiliteit", en: "Flexibility" },
        explanation: {
          nl: "Je denken, voelen en gedrag aanpassen aan nieuwe, onbekende of onvoorspelbare situaties.",
          en: "Adapting your thinking, feeling and behaviour to new, unfamiliar or unpredictable situations.",
        },
        practice: {
          nl: "Een koerswijziging halverwege het project brengt je niet uit balans.",
          en: "A change of course halfway through the project does not throw you off balance.",
        },
      },
      {
        name: { nl: "Stresstolerantie", en: "Stress Tolerance" },
        explanation: {
          nl: "Effectief en kalm blijven functioneren onder druk, tegenslag of langdurige belasting.",
          en: "Continuing to function effectively and calmly under pressure, setbacks or prolonged strain.",
        },
        practice: {
          nl: "In een crisissituatie word jij juist rustiger in plaats van gejaagder.",
          en: "In a crisis you actually become calmer rather than more rushed.",
        },
      },
      {
        name: { nl: "Optimisme", en: "Optimism" },
        explanation: {
          nl: "Een hoopvolle, veerkrachtige houding houden, ook na tegenslag – zonder de realiteit uit het oog te verliezen.",
          en: "Keeping a hopeful, resilient attitude, even after a setback – without losing sight of reality.",
        },
        practice: {
          nl: "Na een afwijzing zoek je naar wat er te leren valt in plaats van naar bevestiging dat het toch niet lukt.",
          en: "After a rejection you look for what there is to learn rather than for proof that it will never work.",
        },
      },
    ],
  },
];

export const EQI_COMPOSITES: EqiComposite[] = COMPOSITE_SEEDS.map(
  (seed, i) => {
    const color = EQI_WHEEL_COLORS[i];
    return {
      ...seed,
      color,
      light: mix(color, WHITE, 0.55),
      dark: mix(color, BLACK, 0.35),
    };
  },
);

export const EQI_WELLBEING = {
  id: "welbevinden",
  name: { nl: "Welbevinden", en: "Well-Being" },
  question: { nl: "Het hart van het model", en: "The heart of the model" },
  explanation: {
    nl: "Welbevinden staat in het hart van het EQ-i 2.0. Het is geen zesde compositeschaal, maar een graadmeter van je algehele tevredenheid en levensvreugde. Het zegt iets over hoe de vijf schalen samen uitpakken.",
    en: "Well-Being sits at the heart of the EQ-i 2.0. It is not a sixth composite scale, but a gauge of your overall satisfaction and joy in life. It says something about how the five scales work out together.",
  },
} as const;

/** Charcoal – the EQ-i theme colour used when nothing is selected. */
export const EQI_NEUTRAL = "#404040";

/** Deep blue of the wheel's core and outer rim lettering. */
export const EQI_CORE = "#173b8f";

export const EQI_WHEEL_TEXT: Record<
  Lang,
  {
    heading: string;
    intro: string;
    heartLine1: string;
    heartLine2: string;
    rimOuter: string;
    rimInner: string;
    wellbeingRing: string;
    selectionLabel: string;
    emptyTitle: string;
    emptyBody: string;
    compositeLabel: string;
    subsHeading: string;
    subsNote: string;
    /**
     * Prefix before a subscale's workplace example.
     *
     * Not rendered on the public site: subscale definitions belong in the
     * debrief and the certification training (see `subsNote`). Kept for
     * internal/certified-partner surfaces that may show them.
     */
    practiceLabel: string;
    reset: string;
    tip: string;
    svgLabel: string;
    trademark: string;
  }
> = {
  nl: {
    heading: "Het EQ-i 2.0 wiel",
    intro:
      "Klik op een van de vijf gekleurde segmenten voor een korte uitleg van die composietschaal en de drie subschalen die eronder vallen. Klik op het hart voor Welbevinden.",
    heartLine1: "Emotionele",
    heartLine2: "intelligentie",
    rimOuter: "EMOTIONEEL EN SOCIAAL FUNCTIONEREN",
    rimInner: "HANDELEN",
    wellbeingRing: "WELBEVINDEN",
    selectionLabel: "Selectie",
    emptyTitle: "Kies een composietschaal",
    emptyBody:
      "Klik op een van de vijf gekleurde segmenten in het wiel voor een korte uitleg, of op het hart voor Welbevinden.",
    compositeLabel: "Composietschaal",
    subsHeading: "De drie subschalen",
    subsNote:
      "De definities van de individuele subschalen komen aan bod in de debriefing van je profiel en in de certificatietraining.",
    practiceLabel: "Op het werk:",
    reset: "Reset wiel",
    tip: "Ook klik op een subschaalband selecteert de hele composietschaal. Met Tab en Enter werkt het wiel zonder muis; Esc reset.",
    svgLabel:
      "Interactief EQ-i 2.0 wiel met vijf composietschalen en vijftien subschalen",
    trademark:
      "EQ-i 2.0® en EQ 360® zijn geregistreerde handelsmerken van Multi-Health Systems Inc. (MHS).",
  },
  en: {
    heading: "The EQ-i 2.0 wheel",
    intro:
      "Click one of the five coloured segments for a short explanation of that composite scale and the three subscales beneath it. Click the heart for Well-Being.",
    heartLine1: "Emotional",
    heartLine2: "intelligence",
    rimOuter: "EMOTIONAL AND SOCIAL FUNCTIONING",
    rimInner: "PERFORMANCE",
    wellbeingRing: "WELL-BEING",
    selectionLabel: "Selection",
    emptyTitle: "Choose a composite scale",
    emptyBody:
      "Click one of the five coloured segments in the wheel for a short explanation, or the heart for Well-Being.",
    compositeLabel: "Composite scale",
    subsHeading: "The three subscales",
    subsNote:
      "The definitions of the individual subscales are covered in the debrief of your profile and in the certification training.",
    practiceLabel: "At work:",
    reset: "Reset wheel",
    tip: "Clicking a subscale band also selects the whole composite scale. Tab and Enter operate the wheel without a mouse; Esc resets.",
    svgLabel:
      "Interactive EQ-i 2.0 wheel with five composite scales and fifteen subscales",
    trademark:
      "EQ-i 2.0® and EQ 360® are registered trademarks of Multi-Health Systems Inc. (MHS).",
  },
};

/* ---------------------------------------------------------------- *
 * Geometry
 * ---------------------------------------------------------------- */

export const VIEWBOX = 820;
const CX = 820 / 2;
const CY = 820 / 2;

export const RADII = {
  heart: 84,
  heartRing: 92,
  subInner: 94,
  subOuter: 212,
  compInner: 212,
  compOuter: 302,
  wbInner: 302,
  wbOuter: 346,
  rimInner: 346,
  rimOuter: 396,
};

const START = -126; // Self-Perception starts top-left, centred at the top
const SPAN = 72; // 360 / 5
const PAD = 1.3; // white gap between composites

const n = (v: number) => v.toFixed(2);

function polar(r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}

/** Ring segment between two radii and two angles. */
function sector(r0: number, r1: number, a0: number, a1: number): string {
  const [x0, y0] = polar(r1, a0);
  const [x1, y1] = polar(r1, a1);
  const [x2, y2] = polar(r0, a1);
  const [x3, y3] = polar(r0, a0);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${n(x0)} ${n(y0)} A ${n(r1)} ${n(r1)} 0 ${large} 1 ${n(x1)} ${n(y1)} L ${n(x2)} ${n(y2)} A ${n(r0)} ${n(r0)} 0 ${large} 0 ${n(x3)} ${n(y3)} Z`;
}

/** Arc used as a baseline for curved text; drawn backwards along the bottom. */
function arc(r: number, a0: number, a1: number, flipped: boolean): string {
  const s = flipped ? a1 : a0;
  const e = flipped ? a0 : a1;
  const [x0, y0] = polar(r, s);
  const [x1, y1] = polar(r, e);
  const large = Math.abs(e - s) > 180 ? 1 : 0;
  const sweep = e > s ? 1 : 0;
  return `M ${n(x0)} ${n(y0)} A ${n(r)} ${n(r)} 0 ${large} ${sweep} ${n(x1)} ${n(y1)}`;
}

function normalise(deg: number): number {
  let d = deg % 360;
  if (d >= 180) d -= 360;
  if (d < -180) d += 360;
  return d;
}

/** Text along the bottom half has to be drawn the other way round. */
function isFlipped(midAngle: number): boolean {
  return normalise(midAngle) > 0;
}

/* ---------------- text fitting ---------------- */

/**
 * Average glyph width as a fraction of the font size. Bold uppercase runs much
 * wider than bold mixed case, and getting this wrong is what makes a long label
 * such as STRESSMANAGEMENT spill out of its segment.
 */
export const WIDTH_UPPERCASE = 0.68;
export const WIDTH_MIXED_CASE = 0.54;

/** Extra tracking on the composite names; it has to be paid for per character. */
export const COMPOSITE_TRACKING = 1.5;

/** Fraction of the arc a label may occupy, leaving a margin at both ends. */
export const ARC_USAGE = 0.92;

const SEGMENT_RAD = (((SPAN - 2 * PAD) * Math.PI) / 180);

function arcLength(radius: number): number {
  return SEGMENT_RAD * radius;
}

/** Largest font size at which `text` still fits on the arc at `radius`. */
function fitSize(
  text: string,
  radius: number,
  widthFactor: number,
  tracking: number,
  max: number,
  min: number,
): number {
  const usable = arcLength(radius) * ARC_USAGE;
  const size = (usable / text.length - tracking) / widthFactor;
  return Math.max(min, Math.min(max, size));
}

/**
 * One font size shared by all five composite names, dictated by the longest of
 * them. A single size reads as a set; per-label sizes made the wheel look
 * accidental, and the widest label is the one that decides whether any of them
 * fit at all.
 */
export function compositeFontSize(lang: Lang): number {
  return Math.min(
    ...EQI_COMPOSITES.map((comp, i) =>
      fitSize(
        comp.name[lang].toUpperCase(),
        COMPOSITE_GEOMETRY[i].labelRadius,
        WIDTH_UPPERCASE,
        COMPOSITE_TRACKING,
        26,
        11,
      ),
    ),
  );
}

export type SubLabelLayout = { lines: string[]; fontSize: number };

const subLabelCache: Partial<Record<Lang, SubLabelLayout[][]>> = {};

/**
 * Wrapping and sizing for the fifteen subscale labels, as `[composite][band]`.
 *
 * Labels that would end up too small on one line are split over two, and every
 * band ring then gets a single size – the smallest that all five labels in that
 * ring can live with – so the three rings read cleanly.
 */
export function subLabelLayouts(lang: Lang): SubLabelLayout[][] {
  const cached = subLabelCache[lang];
  if (cached) return cached;

  const measured = EQI_COMPOSITES.map((comp, ci) =>
    subNames(comp, lang).map((name, si) => {
      const band = COMPOSITE_GEOMETRY[ci].bands[si];
      const oneLine = fitSize(name, band.radius, WIDTH_MIXED_CASE, 0, 13, 7.5);
      if (oneLine >= 10.2 || !name.includes(" ")) {
        return { lines: [name], size: oneLine };
      }
      const words = name.split(" ");
      const half = Math.ceil(words.length / 2);
      const first = words.slice(0, half).join(" ");
      const second = words.slice(half).join(" ");
      return {
        lines: [first, second],
        size: Math.min(
          fitSize(first, band.firstRadius, WIDTH_MIXED_CASE, 0, 11.5, 7.5),
          fitSize(second, band.secondRadius, WIDTH_MIXED_CASE, 0, 11.5, 7.5),
        ),
      };
    }),
  );

  // Smallest size per ring – never larger than what any single label needs, so
  // shrinking a label can only ever give it more room.
  const perRing = [0, 1, 2].map((si) =>
    Math.min(...measured.map((rows) => rows[si].size)),
  );

  const layouts = measured.map((rows) =>
    rows.map((row, si) => ({ lines: row.lines, fontSize: perRing[si] })),
  );
  subLabelCache[lang] = layouts;
  return layouts;
}

export type ArcDef = { id: string; d: string };

export type SubBandGeometry = {
  /** Filled band behind the subscale label. */
  path: string;
  /** Baseline for a single-line label. */
  single: ArcDef;
  /** Baselines for a two-line label, in reading order. */
  first: ArcDef;
  second: ArcDef;
  /** Angular width, needed to size the label. */
  span: number;
  /** Radius of the single-line baseline, needed to size the label. */
  radius: number;
  firstRadius: number;
  secondRadius: number;
};

export type CompositeGeometry = {
  id: string;
  /** Filled ring segment carrying the composite name. */
  path: string;
  /** Baseline for the composite name. */
  label: ArcDef;
  labelRadius: number;
  span: number;
  bands: SubBandGeometry[];
};

const LINE_OFFSET = 6.5;

export const COMPOSITE_GEOMETRY: CompositeGeometry[] = EQI_COMPOSITES.map(
  (comp, ci) => {
    const a0 = START + ci * SPAN + PAD;
    const a1 = START + (ci + 1) * SPAN - PAD;
    const mid = (a0 + a1) / 2;
    const flipped = isFlipped(mid);
    const span = a1 - a0;

    const labelRadius =
      RADII.compInner + (RADII.compOuter - RADII.compInner) * 0.54;

    const SUB_BANDS = (() => {
      const total = RADII.subOuter - RADII.subInner;
      const thickness = total / 3;
      return [0, 1, 2].map((i) => {
        const outer = RADII.subOuter - i * thickness;
        return { outer, inner: outer - thickness, mid: outer - thickness / 2 };
      });
    })();

    return {
      id: comp.id,
      path: sector(RADII.compInner, RADII.compOuter, a0, a1),
      label: {
        id: `eqi-arc-${comp.id}`,
        d: arc(labelRadius, a0, a1, flipped),
      },
      labelRadius,
      span,
      bands: SUB_BANDS.map((band, si) => {
        const firstRadius = flipped ? band.mid - LINE_OFFSET : band.mid + LINE_OFFSET;
        const secondRadius = flipped ? band.mid + LINE_OFFSET : band.mid - LINE_OFFSET;
        return {
          path: sector(band.inner, band.outer, a0, a1),
          single: {
            id: `eqi-arc-${comp.id}-${si}`,
            d: arc(band.mid, a0, a1, flipped),
          },
          first: {
            id: `eqi-arc-${comp.id}-${si}-a`,
            d: arc(firstRadius, a0, a1, flipped),
          },
          second: {
            id: `eqi-arc-${comp.id}-${si}-b`,
            d: arc(secondRadius, a0, a1, flipped),
          },
          span,
          radius: band.mid,
          firstRadius,
          secondRadius,
        };
      }),
    };
  },
);

const RIM_RADIUS = (RADII.rimInner + RADII.rimOuter) / 2;
const WB_RADIUS = (RADII.wbInner + RADII.wbOuter) / 2;

/** Outer rim lettering: two long arcs and two short ones. */
export const RIM_LABELS: (ArcDef & { kind: "outer" | "inner" })[] = [
  { a0: -144, a1: -36, kind: "outer" as const },
  { a0: 36, a1: 144, kind: "outer" as const },
  { a0: -26, a1: 26, kind: "inner" as const },
  { a0: 154, a1: 206, kind: "inner" as const },
].map((seg, i) => ({
  id: `eqi-rim-${i}`,
  d: arc(RIM_RADIUS, seg.a0, seg.a1, isFlipped((seg.a0 + seg.a1) / 2)),
  kind: seg.kind,
}));

/** "WELBEVINDEN" repeated on the white ring, once per composite boundary. */
export const WELLBEING_LABELS: ArcDef[] = [-126, -54, 18, 90, 162].map(
  (boundary, i) => ({
    id: `eqi-wb-${i}`,
    d: arc(
      WB_RADIUS,
      boundary - 15,
      boundary + 15,
      isFlipped(boundary),
    ),
  }),
);

export const CENTER = { x: CX, y: CY };
