import { useState, useEffect, useCallback } from 'react';
import { PERSONAS, getPersona, DEFAULT_PERSONA_SLUG } from '@/lib/personas';
import type { Persona } from '@/lib/personas';

// ── Constants ─────────────────────────────────────────────────────────────────

const ORBIT_R = 230;      // px, radius of orbit ring
const CENTER_SIZE = 130;  // px, center circle diameter
const NODE_SIZE = 72;     // px, persona node diameter
const CANVAS = 560;       // px, total canvas size

// ── Session helpers ───────────────────────────────────────────────────────────

function getOrCreateSessionId(): string {
  let id = localStorage.getItem('fitc_session_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('fitc_session_id', id);
  }
  return id;
}

async function persistPersona(sessionId: string, slug: string) {
  try {
    await fetch('/api/persona', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, slug }),
    });
  } catch { /* non-blocking */ }
}

async function resetPersona(sessionId: string) {
  try {
    await fetch(`/api/persona?sessionId=${sessionId}`, { method: 'DELETE' });
  } catch { /* non-blocking */ }
}

// ── Orbit node ────────────────────────────────────────────────────────────────

function OrbitNode({
  persona,
  index,
  total,
  isSelected,
  onSelect,
}: {
  persona: Persona;
  index: number;
  total: number;
  isSelected: boolean;
  onSelect: (p: Persona) => void;
}) {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  const cx = CANVAS / 2 + ORBIT_R * Math.cos(angle) - NODE_SIZE / 2;
  const cy = CANVAS / 2 + ORBIT_R * Math.sin(angle) - NODE_SIZE / 2;

  return (
    <button
      onClick={() => onSelect(persona)}
      style={{ left: cx, top: cy, width: NODE_SIZE, height: NODE_SIZE }}
      className={`
        absolute rounded-full flex flex-col items-center justify-center
        border-2 transition-all duration-300 cursor-pointer group
        ${isSelected
          ? `${persona.color} border-white/80 scale-110 shadow-lg shadow-white/20`
          : `bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40 hover:scale-105`
        }
      `}
      title={persona.name}
    >
      <span className="text-xl leading-none">{persona.emoji}</span>
      <span
        className={`
          absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium
          transition-colors duration-200
          ${isSelected ? 'text-white' : 'text-white/60 group-hover:text-white/90'}
        `}
      >
        {persona.name}
      </span>
    </button>
  );
}

// ── SVG connection lines ──────────────────────────────────────────────────────

function OrbitLines({ total, selectedIndex }: { total: number; selectedIndex: number | null }) {
  const cx = CANVAS / 2;
  const cy = CANVAS / 2;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${CANVAS} ${CANVAS}`}
    >
      {/* Orbit ring */}
      <circle
        cx={cx}
        cy={cy}
        r={ORBIT_R}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />
      {/* Connection lines */}
      {Array.from({ length: total }).map((_, i) => {
        const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
        const nx = cx + ORBIT_R * Math.cos(angle);
        const ny = cy + ORBIT_R * Math.sin(angle);
        const isSelected = i === selectedIndex;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={nx}
            y2={ny}
            stroke={isSelected ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.06)'}
            strokeWidth={isSelected ? 1.5 : 0.5}
          />
        );
      })}
      {/* Subtle particles */}
      {[...Array(12)].map((_, i) => {
        const a = (i / 12) * 2 * Math.PI;
        const r = ORBIT_R * 0.45 + (i % 3) * 18;
        return (
          <circle
            key={`p${i}`}
            cx={cx + r * Math.cos(a)}
            cy={cy + r * Math.sin(a)}
            r="1.5"
            fill="rgba(255,255,255,0.15)"
          />
        );
      })}
    </svg>
  );
}

// ── Mobile persona grid ───────────────────────────────────────────────────────

function MobileGrid({
  selected,
  onSelect,
}: {
  selected: Persona;
  onSelect: (p: Persona) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-3 px-4">
      {PERSONAS.map((p) => {
        const isSelected = p.slug === selected.slug;
        return (
          <button
            key={p.slug}
            onClick={() => onSelect(p)}
            className={`
              flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all
              ${isSelected
                ? `${p.color} border-white/60 shadow-lg`
                : 'bg-white/10 border-white/15 hover:bg-white/20'
              }
            `}
          >
            <span className="text-2xl">{p.emoji}</span>
            <span className="text-xs font-medium text-white/90 leading-tight text-center">
              {p.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface PersonaOrbitProps {
  onSelect: (persona: Persona) => void;
  selected: Persona;
}

export default function PersonaOrbit({ onSelect, selected }: PersonaOrbitProps) {
  const [initialized, setInitialized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);

    // Restore from localStorage + sync with DB
    const sessionId = getOrCreateSessionId();
    const saved = localStorage.getItem('fitc_persona');
    if (saved) {
      onSelect(getPersona(saved));
    } else {
      // Try to restore from DB
      fetch(`/api/persona?sessionId=${sessionId}`)
        .then((r) => r.json())
        .then((d: { slug?: string | null }) => {
          if (d.slug) {
            localStorage.setItem('fitc_persona', d.slug);
            onSelect(getPersona(d.slug));
          }
        })
        .catch(() => {});
    }
    setInitialized(true);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelect = useCallback(
    (persona: Persona) => {
      onSelect(persona);
      localStorage.setItem('fitc_persona', persona.slug);
      const sessionId = getOrCreateSessionId();
      persistPersona(sessionId, persona.slug);
    },
    [onSelect],
  );

  const handleReset = useCallback(() => {
    const def = getPersona(DEFAULT_PERSONA_SLUG);
    onSelect(def);
    localStorage.removeItem('fitc_persona');
    const sessionId = getOrCreateSessionId();
    resetPersona(sessionId);
  }, [onSelect]);

  const selectedIndex = PERSONAS.findIndex((p) => p.slug === selected.slug);

  if (!initialized) return null;

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Orbit (desktop) / Grid (mobile) */}
      <div className="hidden sm:block">
        <div
          className="relative"
          style={{ width: CANVAS, height: CANVAS }}
        >
          <OrbitLines total={PERSONAS.length} selectedIndex={selectedIndex} />

          {/* Center node */}
          <div
            className="absolute rounded-full flex flex-col items-center justify-center
              bg-gradient-to-br from-white/20 to-white/5 border border-white/30
              backdrop-blur-sm shadow-2xl"
            style={{
              width: CENTER_SIZE,
              height: CENTER_SIZE,
              left: CANVAS / 2 - CENTER_SIZE / 2,
              top: CANVAS / 2 - CENTER_SIZE / 2,
            }}
          >
            <span className="text-3xl mb-1">{selected.emoji}</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {selected.name}
            </span>
            <button
              onClick={handleReset}
              className="text-[10px] text-white/50 hover:text-white/80 mt-1 transition-colors"
            >
              ▼ change
            </button>
          </div>

          {/* Persona nodes */}
          {PERSONAS.map((persona, i) => (
            <OrbitNode
              key={persona.slug}
              persona={persona}
              index={i}
              total={PERSONAS.length}
              isSelected={persona.slug === selected.slug}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div className="sm:hidden w-full">
        {/* Current selection */}
        <div className="flex flex-col items-center mb-6">
          <div
            className={`w-20 h-20 rounded-full ${selected.color} flex items-center justify-center mb-2 shadow-lg`}
          >
            <span className="text-3xl">{selected.emoji}</span>
          </div>
          <span className="text-sm font-bold text-white">{selected.name}</span>
          <button
            onClick={handleReset}
            className="text-xs text-white/50 hover:text-white/80 mt-1 transition-colors"
          >
            ↺ reset
          </button>
        </div>
        <MobileGrid selected={selected} onSelect={handleSelect} />
      </div>

      {/* Selected persona tagline */}
      <div className="text-center max-w-xs">
        <p className={`text-sm font-medium ${selected.textColor}`}>{selected.tagline}</p>
        <p className="text-xs text-white/40 mt-1">"{selected.content.definitionOfDone}"</p>
      </div>
    </div>
  );
}
