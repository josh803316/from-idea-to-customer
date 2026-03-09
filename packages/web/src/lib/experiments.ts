/**
 * Feature flags & A/B experiments — the same concept as Optimizely or LaunchDarkly,
 * built from scratch so you can see every moving part.
 *
 * How it works:
 *   1. Every experiment has a set of named variants. One is always "control" (the default).
 *   2. A user's assignments live in a cookie: fitc_experiments = { "hero-headline": "outcome" }
 *   3. The home page is SSR — it reads the cookie on the server and renders the correct
 *      variant before sending HTML. No flash. No layout shift.
 *   4. The LabPanel component (client island) lets visitors see and change their assignment.
 *   5. In a real product you'd also log an "experiment viewed" event to your analytics
 *      provider and compare conversion rates across variants.
 *
 * The tradeoff this demonstrates:
 *   Static pages are fast but can't vary per user. SSR pages can vary per user but add
 *   latency. Feature flag tools like Vercel Edge Config + Flags SDK solve this by running
 *   the assignment at the CDN edge — zero latency, full per-user control. That's the next
 *   level after understanding what we've built here.
 */

export const COOKIE_NAME = 'fitc_experiments';

export interface Variant {
  id: string;
  label: string;
  /** One sentence shown in the Lab panel explaining what's different */
  description: string;
}

export interface Experiment {
  id: string;
  name: string;
  /** What's being tested and why it matters */
  description: string;
  /** The falsifiable prediction — this is what separates A/B testing from guessing */
  hypothesis: string;
  /** What you'd measure to decide a winner */
  metric: string;
  variants: Variant[];
}

// ─── Experiment Definitions ───────────────────────────────────────────────────

export const experiments: Experiment[] = [
  {
    id: 'hero-headline',
    name: 'Hero Headline',
    description:
      'The main headline is the first thing every visitor reads. Small copy changes here can have outsized effects on engagement.',
    hypothesis:
      'An outcome-oriented headline ("Stop executing tasks. Start owning outcomes.") will drive higher scroll depth than a philosophy-oriented one because engineers respond to concrete skill promises over abstract concepts.',
    metric: 'Scroll depth past the hero section + waitlist conversion rate',
    variants: [
      {
        id: 'control',
        label: 'Control — Philosophy',
        description: '"You can manage it. Or it will manage you."',
      },
      {
        id: 'outcome',
        label: 'Variant A — Outcome',
        description: '"Stop executing tasks. Start owning outcomes."',
      },
      {
        id: 'direct',
        label: 'Variant B — Direct',
        description: '"From junior engineer to system owner."',
      },
    ],
  },
  {
    id: 'hero-cta',
    name: 'Primary CTA Button',
    description:
      'The CTA is the single most important conversion point on the page. Testing copy is one of the highest-ROI experiments you can run.',
    hypothesis:
      'Action-oriented copy ("Start Learning Free") will outperform curiosity-driven copy ("See How It Works") because it sets a clearer expectation of what happens next.',
    metric: 'CTA click-through rate',
    variants: [
      {
        id: 'control',
        label: 'Control — Curiosity',
        description: '"Start with the Checkerboard"',
      },
      {
        id: 'action',
        label: 'Variant A — Action',
        description: '"Start Learning Free"',
      },
      {
        id: 'curiosity',
        label: 'Variant B — Outcome',
        description: '"Show Me the Roadmap"',
      },
    ],
  },
  {
    id: 'chessboard',
    name: '3D Complexity Visualization',
    description:
      'The interactive 3D chess board illustrates the OS vs OEM complexity multiplier. The question is whether the depth aids comprehension or adds friction before the CTA.',
    hypothesis:
      'Visitors who see the chess board will have higher time-on-page but lower conversion rates, because they get absorbed in the visualization. Removing it will increase conversions at the cost of engagement quality.',
    metric: 'Time on page vs. waitlist signup rate',
    variants: [
      {
        id: 'control',
        label: 'Control — Interactive',
        description: 'Show the interactive 3D chess board with OS/OEM toggle',
      },
      {
        id: 'simplified',
        label: 'Variant A — Simplified',
        description: 'Replace with a static two-column comparison card',
      },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export type VariantAssignments = Record<string, string>;

export function parseAssignments(cookieValue: string | undefined): VariantAssignments {
  if (!cookieValue) return {};
  try {
    return JSON.parse(decodeURIComponent(cookieValue)) as VariantAssignments;
  } catch {
    return {};
  }
}

export function serializeAssignments(assignments: VariantAssignments): string {
  return encodeURIComponent(JSON.stringify(assignments));
}

/** Returns the active variant id for an experiment, defaulting to "control". */
export function getVariant(assignments: VariantAssignments, experimentId: string): string {
  return assignments[experimentId] ?? 'control';
}

/** Returns assignments with one experiment updated. */
export function setVariant(
  assignments: VariantAssignments,
  experimentId: string,
  variantId: string,
): VariantAssignments {
  return { ...assignments, [experimentId]: variantId };
}

/** Cycles to the next variant in the list (wraps around). */
export function nextVariant(
  assignments: VariantAssignments,
  experimentId: string,
): VariantAssignments {
  const experiment = experiments.find((e) => e.id === experimentId);
  if (!experiment) return assignments;
  const current = getVariant(assignments, experimentId);
  const currentIndex = experiment.variants.findIndex((v) => v.id === current);
  const next = experiment.variants[(currentIndex + 1) % experiment.variants.length];
  return setVariant(assignments, experimentId, next.id);
}
