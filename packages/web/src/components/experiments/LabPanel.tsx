/**
 * LabPanel — the transparent A/B testing control panel.
 *
 * This is what makes this site different from a normal A/B test:
 * visitors can see the experiments, understand the hypothesis, and
 * switch between variants themselves. The goal is to demystify the
 * process, not to manipulate behavior without the user's knowledge.
 *
 * In production (Optimizely, LaunchDarkly, Vercel Flags) this panel
 * wouldn't exist — the assignment happens invisibly. Here, visibility
 * IS the product.
 */

import { useState, useEffect } from 'react';
import { experiments, type VariantAssignments, type Experiment } from '@/lib/experiments';

async function fetchAssignments(): Promise<VariantAssignments> {
  const res = await fetch('/api/experiments');
  if (!res.ok) return {};
  return res.json();
}

async function applyVariant(experimentId: string, variantId: string): Promise<void> {
  await fetch('/api/experiments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ experimentId, variantId }),
  });
  window.location.reload();
}

async function resetAll(): Promise<void> {
  await fetch('/api/experiments', { method: 'DELETE' });
  window.location.reload();
}

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
      {/* Header row */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`shrink-0 w-2 h-2 rounded-full ${isControl ? 'bg-gray-300' : 'bg-brand-500'}`}
          />
          <span className="text-sm font-medium text-gray-800 truncate">{experiment.name}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-gray-400 hidden sm:block">
            {currentVariant?.label ?? currentVariantId}
          </span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100 space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-3 mb-1">
              What's being tested
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">{experiment.description}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Hypothesis
            </p>
            <p className="text-xs text-gray-600 leading-relaxed italic">"{experiment.hypothesis}"</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Success metric
            </p>
            <p className="text-xs text-gray-600">{experiment.metric}</p>
          </div>

          {/* Variant selector */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Variants
            </p>
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

export default function LabPanel() {
  const [open, setOpen] = useState(false);
  const [assignments, setAssignments] = useState<VariantAssignments>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchAssignments().then((a) => {
      setAssignments(a);
      setLoaded(true);
    });
  }, []);

  // Count how many experiments are on a non-control variant
  const activeCount = loaded
    ? Object.values(assignments).filter((v) => v !== 'control').length
    : 0;

  return (
    <>
      {/* Floating trigger button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
          aria-label="Open A/B testing lab panel"
        >
          <span>🧪</span>
          <span>Lab</span>
          {activeCount > 0 && (
            <span className="bg-brand-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center -mr-1">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Panel overlay */}
      {open && (
        <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-end pointer-events-none">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 pointer-events-auto"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="relative pointer-events-auto w-full sm:w-[420px] max-h-[85vh] sm:max-h-[80vh] sm:mr-6 sm:mb-20 bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Panel header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-3 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🧪</span>
                  <h2 className="font-bold text-gray-900">A/B Testing Lab</h2>
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  This site runs live experiments — you can see the variants and switch between
                  them. In production tools like Optimizely or Vercel Flags, this happens
                  invisibly. Here, transparency is the lesson.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="shrink-0 text-gray-400 hover:text-gray-600 mt-0.5"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* How it works callout */}
            <div className="px-5 py-3 bg-brand-50 border-b border-brand-100 shrink-0">
              <p className="text-xs text-brand-800 leading-relaxed">
                <strong>How it works:</strong> Your variant assignment lives in a cookie. The home
                page is server-rendered (SSR) so the right variant is in the HTML before your
                browser sees it — no flicker. Changing a variant reloads the page with the new
                server-rendered content.{' '}
                <a
                  href="https://github.com/josh803316/from-idea-to-customer/blob/main/packages/web/src/lib/experiments.ts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium"
                >
                  Read the source →
                </a>
              </p>
            </div>

            {/* Experiment list */}
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3">
              {experiments.map((exp) => (
                <ExperimentCard
                  key={exp.id}
                  experiment={exp}
                  currentVariantId={assignments[exp.id] ?? 'control'}
                />
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between shrink-0">
              <span className="text-xs text-gray-400">
                {activeCount === 0
                  ? 'All experiments on control'
                  : `${activeCount} variant${activeCount !== 1 ? 's' : ''} active`}
              </span>
              {activeCount > 0 && (
                <button
                  onClick={resetAll}
                  className="text-xs text-gray-500 hover:text-red-600 underline transition-colors"
                >
                  Reset all to control
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
