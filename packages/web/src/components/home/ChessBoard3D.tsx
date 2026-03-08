import { useState } from 'react';

// ── Constants ──────────────────────────────────────────────────────────────

const HW = 52;   // half-width of one isometric tile
const HH = 30;   // half-height of one isometric tile
const CH = 28;   // pixel height per elevation unit

const SVG_W = 720;
const SVG_H = 480;
const OX = SVG_W / 2 - 10;  // isometric origin x
const OY = 145;               // isometric origin y

// ── Dimension labels ───────────────────────────────────────────────────────

const COL_LABELS = [
  'End Customers',
  'Channel Partners',
  'OEM Partners',
  'Vendors',
  'Ecosystem',
];

const ROW_LABELS = [
  'Engineering',
  'Product',
  'Sales & BD',
  'Marketing',
  'Exec & Events',
];

// ── Color palettes [top, mid/right, dark/left] per column ─────────────────

const PALETTE: [string, string, string][] = [
  ['#60a5fa', '#2563eb', '#1e3a8a'],  // Customers  — blue
  ['#34d399', '#059669', '#064e3b'],  // Channel    — teal
  ['#fb923c', '#c2410c', '#7c2d12'],  // OEM        — orange  ← stands out
  ['#c084fc', '#9333ea', '#581c87'],  // Vendors    — purple
  ['#86efac', '#16a34a', '#14532d'],  // Ecosystem  — green
];

// ── Interaction descriptions ───────────────────────────────────────────────

const DESCRIPTIONS: Record<string, string> = {
  '0-0': 'Beta programs, user research, direct tech support',
  '0-1': 'Discovery interviews, user testing, feature prioritisation',
  '0-2': 'Direct sales, account management, renewals',
  '0-3': 'Brand, demand gen, customer stories',
  '0-4': 'Executive briefings, customer advisory boards',

  '1-0': 'Channel tech enablement, partner integration support',
  '1-1': 'Partner product roadmap alignment, enablement kits',
  '1-2': 'Channel program management, deal registration, QBRs',
  '1-3': 'Partner marketing funds (MDF), joint campaigns',
  '1-4': 'Partner summits, incentive programs',

  '2-0': 'Co-engineering, hardware/software validation labs',
  '2-1': 'Joint product roadmap, bundling and packaging strategy',
  '2-2': 'OEM licensing negotiations, commercial terms',
  '2-3': 'Co-branded GTM, shelf placement, joint marketing programs',
  '2-4': 'C-suite alignment, joint seminars and analyst briefings',

  '3-0': 'Vendor SDK integration, performance tuning, certification',
  '3-1': 'Vendor roadmap alignment, co-development agreements',
  '3-2': 'Procurement, vendor contracts, preferred supplier programs',
  '3-3': 'Joint solution marketing (when strategically valuable)',
  '3-4': 'Executive vendor relationships, strategic alliance reviews',

  '4-0': 'Open source contributions, developer tools and SDKs',
  '4-1': 'Ecosystem strategy, ISV programs and developer relations',
  '4-2': 'Alliance partnerships, ecosystem monetisation models',
  '4-3': 'Developer community building, events, technical advocacy',
  '4-4': 'Keynotes, standards bodies, industry working groups',
};

// ── Height data per mode ───────────────────────────────────────────────────
//    [row][col] — rows are Engineering..Exec, cols are Customers..Ecosystem

const HEIGHTS = {
  os: [
    // Cust  Chan  OEM  Vend  Eco
    [   3,    2,    0,   3,    1  ],  // Engineering
    [   4,    3,    0,   2,    1  ],  // Product
    [   2,    4,    0,   0,    0  ],  // Sales & BD
    [   1,    2,    0,   0,    1  ],  // Marketing
    [   2,    1,    0,   1,    0  ],  // Exec & Events
  ],
  oem: [
    // Cust  Chan  OEM  Vend  Eco
    [   3,    2,    4,   3,    2  ],  // Engineering
    [   4,    3,    4,   2,    2  ],  // Product
    [   2,    4,    5,   1,    1  ],  // Sales & BD
    [   1,    2,    4,   1,    2  ],  // Marketing
    [   2,    1,    5,   1,    3  ],  // Exec & Events
  ],
} as const;

type Mode = 'os' | 'oem';

// ── Iso math ───────────────────────────────────────────────────────────────

function ix(col: number, row: number) { return OX + (col - row) * HW; }
function iy(col: number, row: number) { return OY + (col + row) * HH; }

// ── Single cube ────────────────────────────────────────────────────────────

function Cube({
  col, row, h, pal, hover, onEnter, onLeave,
}: {
  col: number; row: number; h: number;
  pal: [string, string, string];
  hover: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const cx = ix(col, row);
  const by = iy(col, row);   // base Y (ground level)
  const ty = by - h * CH;    // top Y

  // flat tile for h === 0
  if (h === 0) {
    const pts = `${cx},${by - HH} ${cx + HW},${by} ${cx},${by + HH} ${cx - HW},${by}`;
    return (
      <polygon
        points={pts}
        fill={hover ? '#e2e8f0' : '#f1f5f9'}
        stroke="#e2e8f0" strokeWidth="1"
        onMouseEnter={onEnter} onMouseLeave={onLeave}
        style={{ cursor: 'default' }}
      />
    );
  }

  const top   = `${cx},${ty - HH} ${cx + HW},${ty} ${cx},${ty + HH} ${cx - HW},${ty}`;
  const left  = `${cx - HW},${ty} ${cx},${ty + HH} ${cx},${by + HH} ${cx - HW},${by}`;
  const right = `${cx},${ty + HH} ${cx + HW},${ty} ${cx + HW},${by} ${cx},${by + HH}`;

  const [light, mid, dark] = pal;
  const glow = hover ? '0 0 12px 4px rgba(255,255,255,0.7)' : undefined;

  return (
    <g onMouseEnter={onEnter} onMouseLeave={onLeave} style={{ cursor: 'pointer' }}>
      <polygon points={right} fill={mid}  stroke="white" strokeWidth="0.5" />
      <polygon points={left}  fill={dark} stroke="white" strokeWidth="0.5" />
      <polygon
        points={top} fill={hover ? 'white' : light}
        stroke="white" strokeWidth={hover ? 2 : 1}
        style={glow ? { filter: `drop-shadow(${glow})` } : undefined}
      />
      {/* height label on top face */}
      {h >= 3 && (
        <text
          x={cx} y={ty}
          textAnchor="middle" dominantBaseline="middle"
          fontSize="9" fontWeight="bold"
          fill={hover ? light : 'rgba(255,255,255,0.85)'}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {h}
        </text>
      )}
    </g>
  );
}

// ── Axis label ─────────────────────────────────────────────────────────────

function AxisLabel({ x, y, text, small }: { x: number; y: number; text: string; small?: boolean }) {
  return (
    <text
      x={x} y={y}
      textAnchor="middle" dominantBaseline="middle"
      fontSize={small ? 9 : 10} fontWeight="600"
      fill="#6b7280"
      style={{ userSelect: 'none' }}
    >
      {text}
    </text>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function ChessBoard3D() {
  const [mode, setMode] = useState<Mode>('os');
  const [hovered, setHovered] = useState<{ col: number; row: number } | null>(null);

  const heights = HEIGHTS[mode];

  // Painter's algorithm: render back-to-front by (col + row) ascending
  const cells: { col: number; row: number }[] = [];
  for (let d = 0; d <= 8; d++) {
    for (let col = 0; col < 5; col++) {
      const row = d - col;
      if (row >= 0 && row < 5) cells.push({ col, row });
    }
  }

  const totalHeight = (heights as unknown as number[][]).flat().reduce((a, b) => a + b, 0);
  const osTotal = (HEIGHTS.os as unknown as number[][]).flat().reduce((a, b) => a + b, 0);
  const oemTotal = (HEIGHTS.oem as unknown as number[][]).flat().reduce((a, b) => a + b, 0);
  const complexityGrowth = Math.round(((oemTotal - osTotal) / osTotal) * 100);

  return (
    <section className="py-16 border-t border-gray-100">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
          <span aria-hidden="true">♟</span>
          <span>The field is 3-dimensional &mdash; and it compounds</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Every role adds another dimension.
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          In an OS role you manage engineering, product, and channel relationships.
          Step into an OEM role and you inherit everything above <em>plus</em> an entirely
          new column — co-engineering, joint roadmaps, licensing, co-branded GTM, C-suite
          alignment, seminars. The field doesn't grow linearly. It multiplies.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-gray-100 rounded-xl p-1 gap-1">
          {(['os', 'oem'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === m
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {m === 'os' ? '🖥  OS Role' : '🏭  OEM Role'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* SVG board */}
        <div className="flex-1 min-w-0 overflow-x-auto">
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            width="100%"
            style={{ maxHeight: 480 }}
            aria-label="3D isometric relationship board"
          >
            {/* Axis: columns (external) */}
            {COL_LABELS.map((label, col) => {
              const cx = ix(col, -0.7);
              const cy = iy(col, -0.7);
              return (
                <AxisLabel
                  key={col}
                  x={cx} y={cy - 10}
                  text={label.split(' ')[0]}
                  small
                />
              );
            })}

            {/* Axis: rows (internal functions) */}
            {ROW_LABELS.map((label, row) => {
              const cx = ix(-0.8, row);
              const cy = iy(-0.8, row);
              return (
                <AxisLabel key={row} x={cx} y={cy} text={label} small />
              );
            })}

            {/* Cubes */}
            {cells.map(({ col, row }) => {
              const h = heights[row][col];
              const isHovered = hovered?.col === col && hovered?.row === row;
              const key = `${col}-${row}`;
              return (
                <Cube
                  key={key}
                  col={col} row={row} h={h}
                  pal={PALETTE[col]}
                  hover={isHovered}
                  onEnter={() => setHovered({ col, row })}
                  onLeave={() => setHovered(null)}
                />
              );
            })}

            {/* Axis labels on the ground */}
            <AxisLabel x={OX - 5} y={OY + 5 * HH + 22} text="↙ Internal functions (rows)" small />
            <AxisLabel x={OX + 4 * HW + 30} y={OY + 4 * HH - 5} text="External ↘" small />
          </svg>
        </div>

        {/* Info panel */}
        <div className="lg:w-72 flex-shrink-0 space-y-4">
          {/* Hovered cell info */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 min-h-[140px]">
            {hovered ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: PALETTE[hovered.col][0] }}
                  />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {ROW_LABELS[hovered.row]} ↔ {COL_LABELS[hovered.col]}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {DESCRIPTIONS[`${hovered.col}-${hovered.row}`]}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-gray-400">Intensity:</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-sm"
                        style={{
                          backgroundColor:
                            i < heights[hovered.row][hovered.col]
                              ? PALETTE[hovered.col][0]
                              : '#e5e7eb',
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-gray-600">
                    {heights[hovered.row][hovered.col]}/5
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-400 italic">
                Hover over any tower to see what that relationship involves.
              </p>
            )}
          </div>

          {/* Mode stats */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {mode === 'oem' ? 'OEM Role' : 'OS Role'} — field complexity
            </p>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {totalHeight}
            </div>
            <p className="text-xs text-gray-500 mb-4">total interaction units across all functions</p>

            {mode === 'oem' && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl px-3 py-2 text-xs text-orange-800">
                ↑ {complexityGrowth}% more complex than OS role — <br />
                one new partner type multiplies across <em>every</em> internal function.
              </div>
            )}

            {mode === 'os' && (
              <div className="bg-brand-50 border border-brand-100 rounded-xl px-3 py-2 text-xs text-brand-800">
                Switch to OEM mode to see what happens when you add a single new dimension.
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Dimensions</p>
            <div className="space-y-2">
              {COL_LABELS.map((label, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: PALETTE[i][0] }}
                  />
                  <span className="text-xs text-gray-600">{label}</span>
                  {i === 2 && mode === 'oem' && (
                    <span className="text-xs text-orange-600 font-semibold ml-auto">new ↑</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Teaching callout */}
      <div className="mt-10 bg-gray-900 text-white rounded-2xl p-8 text-center">
        <p className="text-lg font-semibold mb-2">
          The field doesn&rsquo;t add — it multiplies.
        </p>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">
          Adding OEM partners didn&rsquo;t create one new relationship. It created one for
          engineering, one for product, one for sales, one for marketing, and one for executives —
          each with their own cadence, language, and expectations.
          Managing that field is the job. Letting it manage you is the risk.
        </p>
      </div>
    </section>
  );
}
