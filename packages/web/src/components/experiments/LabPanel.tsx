/**
 * LabPanel — transparent feature flag and A/B testing control panel.
 *
 * Two tabs:
 *   Experiments — A/B variants with hypotheses and metrics
 *   Feature Flags — binary on/off gates with real-world context
 *
 * Both tabs explain what they are, why they exist, and how they differ.
 * This is the panel you'd never ship to users in production — but here,
 * transparency is the entire point.
 */

import { useState, useEffect } from 'react';
import { experiments, type VariantAssignments, type Experiment } from '@/lib/experiments';
import { featureFlags, type FlagOverrides, type FeatureFlag } from '@/lib/flags';

// ─── Data fetching ────────────────────────────────────────────────────────────

async function fetchAssignments(): Promise<VariantAssignments> {
  const res = await fetch('/api/experiments');
  return res.ok ? res.json() : {};
}

async function fetchFlags(): Promise<Record<string, boolean>> {
  const res = await fetch('/api/flags');
  return res.ok ? res.json() : {};
}

async function applyVariant(experimentId: string, variantId: string) {
  await fetch('/api/experiments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ experimentId, variantId }),
  });
  window.location.reload();
}

async function toggleFlag(flagId: string, enabled: boolean) {
  await fetch('/api/flags', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ flagId, enabled }),
  });
  window.location.reload();
}

async function resetAllExperiments() {
  await fetch('/api/experiments', { method: 'DELETE' });
  window.location.reload();
}

async function resetAllFlags() {
  await fetch('/api/flags', { method: 'DELETE' });
  window.location.reload();
}

// ─── Experiment card ──────────────────────────────────────────────────────────

function ExperimentCard({
  experiment,
  currentVariantId,
}: {
  experiment: Experiment;
  currentVariantId: string;
}) {
  const [open, setOpen] = useState(false);
  const currentVariant = experiment.variants.find((v) => v.id === currentVariantId);
  const isControl = currentVariantId === 'control';

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={`shrink-0 w-2 h-2 rounded-full ${isControl ? 'bg-gray-300' : 'bg-brand-500'}`} />
          <span className="text-sm font-medium text-gray-800 truncate">{experiment.name}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-gray-400 hidden sm:block">
            {currentVariant?.label ?? currentVariantId}
          </span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100 space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-3 mb-1">What's being tested</p>
            <p className="text-xs text-gray-600 leading-relaxed">{experiment.description}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Hypothesis</p>
            <p className="text-xs text-gray-600 leading-relaxed italic">"{experiment.hypothesis}"</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Success metric</p>
            <p className="text-xs text-gray-600">{experiment.metric}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Variants</p>
            <div className="space-y-1">
              {experiment.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => applyVariant(experiment.id, v.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                    v.id === currentVariantId
                      ? 'bg-brand-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-brand-300 hover:text-brand-700'
                  }`}
                >
                  <span className="font-medium">{v.label}</span>
                  <span className={`block mt-0.5 ${v.id === currentVariantId ? 'text-brand-100' : 'text-gray-400'}`}>
                    {v.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Flag card ────────────────────────────────────────────────────────────────

function FlagCard({
  flag,
  enabled,
}: {
  flag: FeatureFlag;
  enabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const isDefault = enabled === flag.defaultEnabled;

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 bg-white">
        {/* Expand button */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex-1 flex items-center gap-3 min-w-0 text-left"
        >
          <span className={`shrink-0 w-2 h-2 rounded-full ${isDefault ? 'bg-gray-300' : 'bg-amber-400'}`} />
          <span className="text-sm font-medium text-gray-800 truncate">{flag.name}</span>
        </button>

        {/* Toggle switch */}
        <button
          onClick={() => toggleFlag(flag.id, !enabled)}
          className={`relative shrink-0 w-10 h-6 rounded-full transition-colors focus:outline-none ${
            enabled ? 'bg-brand-600' : 'bg-gray-200'
          }`}
          aria-label={`${enabled ? 'Disable' : 'Enable'} ${flag.name}`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
              enabled ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {open && (
        <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100 space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-3 mb-1">What it does</p>
            <p className="text-xs text-gray-600 leading-relaxed">{flag.description}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">On-screen effect</p>
            <p className="text-xs text-gray-600 leading-relaxed">{flag.effect}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Real-world use case</p>
            <p className="text-xs text-gray-600 leading-relaxed italic">"{flag.realWorldReason}"</p>
          </div>
          {!isDefault && (
            <button
              onClick={() => toggleFlag(flag.id, flag.defaultEnabled)}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              Reset to default ({flag.defaultEnabled ? 'on' : 'off'})
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────

type Tab = 'experiments' | 'flags';

export default function LabPanel() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('experiments');
  const [assignments, setAssignments] = useState<VariantAssignments>({});
  const [flagStates, setFlagStates] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([fetchAssignments(), fetchFlags()]).then(([a, f]) => {
      setAssignments(a);
      setFlagStates(f);
      setLoaded(true);
    });
  }, []);

  const activeExperiments = loaded
    ? Object.values(assignments).filter((v) => v !== 'control').length
    : 0;

  const overriddenFlags = loaded
    ? featureFlags.filter((f) => f.id in flagStates && flagStates[f.id] !== f.defaultEnabled).length
    : 0;

  const totalActive = activeExperiments + overriddenFlags;

  return (
    <>
      {/* Floating trigger */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
          aria-label="Open feature flags and A/B testing panel"
        >
          <span>🧪</span>
          <span>Lab</span>
          {totalActive > 0 && (
            <span className="bg-brand-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center -mr-1">
              {totalActive}
            </span>
          )}
        </button>
      </div>

      {/* Panel */}
      {open && (
        <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-end pointer-events-none">
          <div
            className="absolute inset-0 bg-black/20 pointer-events-auto"
            onClick={() => setOpen(false)}
          />

          <div className="relative pointer-events-auto w-full sm:w-[440px] max-h-[88vh] sm:max-h-[82vh] sm:mr-6 sm:mb-20 bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">

            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-3 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🧪</span>
                  <h2 className="font-bold text-gray-900">Feature Lab</h2>
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  A live look at how modern teams ship software — feature flags and A/B tests
                  running on this site, made visible so you can understand how they work.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="shrink-0 text-gray-400 hover:text-gray-600 mt-0.5"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 shrink-0">
              <button
                onClick={() => setTab('experiments')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  tab === 'experiments'
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                A/B Experiments
                {activeExperiments > 0 && (
                  <span className="ml-2 bg-brand-100 text-brand-700 text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {activeExperiments}
                  </span>
                )}
              </button>
              <button
                onClick={() => setTab('flags')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  tab === 'flags'
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Feature Flags
                {overriddenFlags > 0 && (
                  <span className="ml-2 bg-amber-100 text-amber-700 text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {overriddenFlags}
                  </span>
                )}
              </button>
            </div>

            {/* Explainer callout — changes per tab */}
            <div className="px-5 py-3 bg-brand-50 border-b border-brand-100 shrink-0">
              {tab === 'experiments' ? (
                <p className="text-xs text-brand-800 leading-relaxed">
                  <strong>A/B experiments</strong> test which variant of a UI element drives a
                  better outcome. Each experiment has a hypothesis and a metric. The page is
                  server-rendered (SSR) so there's no flicker when your variant is assigned.{' '}
                  <a
                    href="https://github.com/josh803316/from-idea-to-customer/blob/main/packages/web/src/lib/experiments.ts"
                    target="_blank" rel="noopener noreferrer"
                    className="underline font-medium"
                  >
                    Read the source →
                  </a>
                </p>
              ) : (
                <p className="text-xs text-brand-800 leading-relaxed">
                  <strong>Feature flags</strong> are on/off gates — no variants, no winner. Used for
                  kill switches, gradual rollouts, and plan-gating features. The toggle writes a
                  cookie; the SSR page reads it and includes or excludes the component.{' '}
                  <a
                    href="https://github.com/josh803316/from-idea-to-customer/blob/main/packages/web/src/lib/flags.ts"
                    target="_blank" rel="noopener noreferrer"
                    className="underline font-medium"
                  >
                    Read the source →
                  </a>
                </p>
              )}
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3">
              {tab === 'experiments' &&
                experiments.map((exp) => (
                  <ExperimentCard
                    key={exp.id}
                    experiment={exp}
                    currentVariantId={assignments[exp.id] ?? 'control'}
                  />
                ))}

              {tab === 'flags' &&
                featureFlags.map((flag) => (
                  <FlagCard
                    key={flag.id}
                    flag={flag}
                    enabled={flagStates[flag.id] ?? flag.defaultEnabled}
                  />
                ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between shrink-0">
              {tab === 'experiments' ? (
                <>
                  <span className="text-xs text-gray-400">
                    {activeExperiments === 0 ? 'All on control' : `${activeExperiments} variant${activeExperiments !== 1 ? 's' : ''} active`}
                  </span>
                  {activeExperiments > 0 && (
                    <button
                      onClick={resetAllExperiments}
                      className="text-xs text-gray-500 hover:text-red-600 underline transition-colors"
                    >
                      Reset all to control
                    </button>
                  )}
                </>
              ) : (
                <>
                  <span className="text-xs text-gray-400">
                    {overriddenFlags === 0 ? 'All flags at default' : `${overriddenFlags} flag${overriddenFlags !== 1 ? 's' : ''} overridden`}
                  </span>
                  {overriddenFlags > 0 && (
                    <button
                      onClick={resetAllFlags}
                      className="text-xs text-gray-500 hover:text-red-600 underline transition-colors"
                    >
                      Reset all to defaults
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
