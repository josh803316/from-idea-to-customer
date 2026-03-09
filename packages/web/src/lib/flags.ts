/**
 * Feature flags — binary on/off gates for releasing functionality incrementally.
 *
 * Feature flags vs A/B experiments — the distinction matters:
 *
 *   Feature flag  → "Is this feature on or off for this user?"
 *                   Used for: dark launches, kill switches, gradual rollouts,
 *                   canary releases, and gating features behind a plan tier.
 *
 *   A/B experiment → "Which of these variants drives a better outcome?"
 *                    Used for: copy testing, layout testing, pricing experiments.
 *                    Has a winner. Gets cleaned up. Has a metric.
 *
 * In tools like LaunchDarkly, a flag can do both — you define targeting rules
 * that assign percentages of traffic to variants, then measure the impact.
 * Conceptually they're the same primitive: "for this user, return this value."
 *
 * What we've built here is the same concept with a cookie as the targeting rule.
 * The user IS the targeting rule — they choose their own assignment. In production
 * you'd replace the cookie read with an SDK call that evaluates your targeting
 * rules server-side at the edge.
 */

export const FLAGS_COOKIE = 'fitc_flags';

export interface FeatureFlag {
  id: string;
  name: string;
  /** What this feature is and why it might be gated */
  description: string;
  /** Concrete what-you-see-on-screen effect of toggling */
  effect: string;
  /** Real-world reason you'd put this behind a flag */
  realWorldReason: string;
  defaultEnabled: boolean;
}

export const featureFlags: FeatureFlag[] = [
  {
    id: 'live-metrics',
    name: 'Live Site Metrics',
    description:
      'Real-time Lighthouse performance scores and Google Analytics engagement data, fetched via API on each page load.',
    effect: 'Shows or hides the metrics dashboard section on the home page.',
    realWorldReason:
      'You might disable this during a Google API outage, or gate it behind a "Pro" plan to show paying users what their site looks like to Google.',
    defaultEnabled: true,
  },
  {
    id: 'site-agent',
    name: 'AI Site Assistant',
    description:
      'The conversational AI that answers questions about the curriculum, powered by You.com.',
    effect: 'Shows or hides the chat interface on the home page.',
    realWorldReason:
      'Kill switch for when the upstream API is down or over budget. Also useful for A/B testing whether the agent increases or decreases signup conversion.',
    defaultEnabled: true,
  },
  {
    id: 'waitlist-form',
    name: 'Waitlist Signup Form',
    description:
      'The email capture form at the bottom of the home page. Subscribers are stored in the database.',
    effect: 'Shows or hides the waitlist section.',
    realWorldReason:
      'Disable when the waitlist is closed or at capacity. Re-enable when you open a new cohort. No deploy required — just flip the flag.',
    defaultEnabled: true,
  },
  {
    id: 'feature-grid',
    name: 'Feature Grid',
    description:
      'The "what you will learn" grid of cards below the hero section.',
    effect: 'Shows or hides the feature grid section.',
    realWorldReason:
      'Classic "above the fold" experiment setup — you might hide the feature grid to test if a longer hero section or a faster path to the CTA increases conversion.',
    defaultEnabled: true,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Overrides are stored sparse — only flags that differ from defaultEnabled. */
export type FlagOverrides = Record<string, boolean>;

export function parseOverrides(cookieValue: string | undefined): FlagOverrides {
  if (!cookieValue) return {};
  try {
    return JSON.parse(decodeURIComponent(cookieValue)) as FlagOverrides;
  } catch {
    return {};
  }
}

export function serializeOverrides(overrides: FlagOverrides): string {
  return encodeURIComponent(JSON.stringify(overrides));
}

/** Returns true if the flag is enabled for the given overrides. */
export function isFlagEnabled(overrides: FlagOverrides, flagId: string): boolean {
  const flag = featureFlags.find((f) => f.id === flagId);
  if (!flag) return false;
  return flagId in overrides ? overrides[flagId] : flag.defaultEnabled;
}

/** Returns overrides with one flag updated. Removes the key if it matches the default. */
export function setFlag(
  overrides: FlagOverrides,
  flagId: string,
  enabled: boolean,
): FlagOverrides {
  const flag = featureFlags.find((f) => f.id === flagId);
  if (!flag) return overrides;

  const next = { ...overrides };
  if (enabled === flag.defaultEnabled) {
    // Back to default — remove the override so the cookie stays lean
    delete next[flagId];
  } else {
    next[flagId] = enabled;
  }
  return next;
}
