import { useState, useCallback } from 'react';
import { PERSONAS, getPersona, DEFAULT_PERSONA_SLUG } from '@/lib/personas';
import type { Persona } from '@/lib/personas';
import PersonaOrbit from './PersonaOrbit';
import LiveModels from './LiveModels';
import AIEcosystem from './AIEcosystem';

// ── Section: Persona selector ─────────────────────────────────────────────────

function SectionPersonaSelector({
  selected,
  onSelect,
}: {
  selected: Persona;
  onSelect: (p: Persona) => void;
}) {
  return (
    <section className="bg-[#0c1022] py-16 border-y border-white/10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
            First Vocabulary, Then Product
          </p>
          <h2 className="text-3xl font-bold text-white mb-4">
            Every stakeholder speaks a different language
          </h2>
          <p className="text-white/60 max-w-xl mx-auto text-sm leading-relaxed">
            Select your persona. The page adapts its language, examples, and framing
            to your field of concerns — because context shapes everything.
          </p>
        </div>
        <div className="flex justify-center overflow-x-auto">
          <PersonaOrbit selected={selected} onSelect={onSelect} />
        </div>
      </div>
    </section>
  );
}

// ── Section: Journey (ThenVsNow) ──────────────────────────────────────────────

const ERA_CONFIG = [
  {
    key: 'waterfall' as const,
    label: 'Waterfall',
    period: '1990s–2000s',
    icon: '🏗️',
    badgeClass: 'bg-red-100 text-red-700',
    borderClass: 'bg-red-400',
    duration: '6–18 months',
    steps: ['Requirements', 'Architecture', 'Engineering', 'QA', 'Deploy'],
    stepColor: 'bg-red-100 text-red-700',
  },
  {
    key: 'agile' as const,
    label: 'Agile',
    period: '2010s',
    icon: '🔄',
    badgeClass: 'bg-amber-100 text-amber-700',
    borderClass: 'bg-amber-400',
    duration: '4–8 weeks',
    steps: ['Backlog', 'Standups', 'Sprints', 'Review', 'Release'],
    stepColor: 'bg-amber-100 text-amber-700',
  },
  {
    key: 'aiNative' as const,
    label: 'AI-Native',
    period: '2024+',
    icon: '🤖',
    badgeClass: 'bg-green-100 text-green-700',
    borderClass: 'bg-green-400',
    duration: 'Hours to days',
    steps: ['Idea', 'AI writes code', 'Human reviews', 'Ship'],
    stepColor: 'bg-green-100 text-green-700',
    highlight: true,
  },
];

function SectionJourney({ persona }: { persona: Persona }) {
  const { journey } = persona.content;

  return (
    <section className="py-16 bg-gray-50 border-y border-gray-100">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
            The evolution
          </p>
          <h2 className="text-3xl font-bold text-gray-900">How We Got Here</h2>
          <p className="text-sm text-gray-500 mt-2">
            Seen through the eyes of{' '}
            <span className="font-semibold text-gray-700">{persona.name}</span>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {ERA_CONFIG.map((era) => {
            const eraContent = journey[era.key];
            return (
              <div
                key={era.key}
                className={`bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm ${era.highlight ? 'ring-2 ring-green-400 ring-offset-2' : ''}`}
              >
                <div className={`h-1.5 ${era.borderClass}`} />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl">{era.icon}</span>
                      <h3 className="font-bold text-gray-900 mt-1">{era.label}</h3>
                      <p className="text-xs text-gray-400">{era.period}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${era.badgeClass}`}>
                      {era.duration}
                    </span>
                  </div>

                  {/* Persona-specific feeling */}
                  <p className="text-sm font-medium text-gray-800 mb-2 leading-snug">
                    {eraContent.feeling}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">
                    {eraContent.pain}
                  </p>

                  {/* Generic steps */}
                  <ol className="space-y-1.5 border-t border-gray-100 pt-4">
                    {era.steps.map((step, i) => (
                      <li key={step} className="flex items-center gap-2 text-xs text-gray-600">
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${era.stepColor}`}
                        >
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom insight */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 italic max-w-2xl mx-auto">
            "{journey.insight}"
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Section: Foundation Models ────────────────────────────────────────────────

function SectionModels({ persona }: { persona: Persona }) {
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
            The brains
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Foundation Models</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm leading-relaxed">
            {persona.content.modelsIntro}
          </p>
        </div>
        <LiveModels />
      </div>
    </section>
  );
}

// ── Section: Ecosystem ────────────────────────────────────────────────────────

function SectionEcosystem() {
  return (
    <section id="ecosystem" className="py-16 bg-gray-50 border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
            The map
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">The Full AI Ecosystem</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm">
            Foundation models are just the start. A rich ecosystem of tools has emerged around them.
          </p>
        </div>
        <AIEcosystem />
      </div>
    </section>
  );
}

// ── Section: How to Build Today ───────────────────────────────────────────────

function SectionHowToBuild({ persona }: { persona: Persona }) {
  const { howToBuild } = persona.content;

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
            The method
          </p>
          <h2 className="text-3xl font-bold text-gray-900">
            How to Build Today
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            As a <span className="font-semibold text-gray-700">{persona.name}</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-stretch gap-4 sm:gap-0">
          {howToBuild.map((step, i) => (
            <div key={step.label} className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-0 flex-1">
              <div className="flex items-center gap-2 sm:flex-col sm:items-center sm:text-center w-full">
                <div className="w-14 h-14 rounded-2xl bg-white border-2 border-gray-200 flex items-center justify-center text-2xl shadow-sm shrink-0">
                  {step.emoji}
                </div>
                <div className="sm:mt-3">
                  <p className="font-semibold text-gray-900 text-sm">{step.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
              {i < howToBuild.length - 1 && (
                <div className="hidden sm:flex items-center justify-center w-8 self-center shrink-0">
                  <span className="text-gray-300 text-xl font-light">→</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Vocabulary chips */}
        <div className="mt-10 pt-8 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 text-center">
            Vocabulary that matters to {persona.name}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {persona.content.vocabulary.map((term) => (
              <span
                key={term}
                className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full border border-gray-200"
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section: Waitlist ─────────────────────────────────────────────────────────

function SectionWaitlist({ persona, show }: { persona: Persona; show: boolean }) {
  if (!show) return null;

  return (
    <section id="waitlist" className="py-16 text-center border-t border-gray-100">
      <div className="max-w-md mx-auto px-4">
        <div className="text-4xl mb-4">🎓</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {persona.content.waitlist.headline}
        </h2>
        <p className="text-gray-600 mb-8 text-sm leading-relaxed">
          {persona.content.waitlist.subtext}
        </p>
        {/* Inline simple form — WaitlistForm as a separate island caused hydration issues in nested context */}
        <WaitlistInline source={`homepage-${persona.slug}`} />
      </div>
    </section>
  );
}

function WaitlistInline({ source }: { source: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
        ✅ You're on the list — we'll be in touch.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60"
      >
        {status === 'loading' ? '…' : 'Join'}
      </button>
    </form>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

interface PersonaHomePageProps {
  showWaitlist: boolean;
}

export default function PersonaHomePage({ showWaitlist }: PersonaHomePageProps) {
  const [persona, setPersona] = useState<Persona>(getPersona(DEFAULT_PERSONA_SLUG));

  const handleSelect = useCallback((p: Persona) => {
    setPersona(p);
  }, []);

  return (
    <div>
      {/* Section 1: Persona selector */}
      <SectionPersonaSelector selected={persona} onSelect={handleSelect} />

      {/* Sections keyed on persona so they re-render on change */}
      <div key={persona.slug}>
        {/* Section 2: Journey */}
        <SectionJourney persona={persona} />

        {/* Section 3: Foundation Models */}
        <SectionModels persona={persona} />

        {/* Section 4: Ecosystem (static, no key needed but inside key div) */}
        <SectionEcosystem />

        {/* Section 5: How to Build Today */}
        <SectionHowToBuild persona={persona} />

        {/* Section 6: Waitlist */}
        <SectionWaitlist persona={persona} show={showWaitlist} />
      </div>

      {/* Footer note */}
      <div className="py-6 text-center border-t border-gray-100">
        <p className="text-sm text-gray-400">
          Looking for the original?
          <a href="/classic" className="text-brand-600 hover:underline ml-1">
            View classic page →
          </a>
        </p>
      </div>
    </div>
  );
}
