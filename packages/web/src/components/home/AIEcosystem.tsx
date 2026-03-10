// Static data — no API calls, lazy-hydrates on scroll (client:visible)

interface Tool {
  name: string;
  emoji: string;
  org: string;
}

interface Category {
  title: string;
  emoji: string;
  color: {
    header: string;
    chip: string;
    border: string;
  };
  tools: Tool[];
}

const CATEGORIES: Category[] = [
  {
    title: 'Foundation Models',
    emoji: '🧠',
    color: {
      header: 'bg-purple-600 text-white',
      chip: 'bg-purple-50 border-purple-200 text-purple-800',
      border: 'border-purple-200',
    },
    tools: [
      { name: 'ChatGPT', emoji: '🟢', org: 'OpenAI' },
      { name: 'Claude', emoji: '🟣', org: 'Anthropic' },
      { name: 'Gemini', emoji: '🔵', org: 'Google' },
      { name: 'Grok', emoji: '⚡', org: 'xAI' },
      { name: 'Llama', emoji: '🦙', org: 'Meta' },
    ],
  },
  {
    title: 'Code Assistants',
    emoji: '💻',
    color: {
      header: 'bg-blue-600 text-white',
      chip: 'bg-blue-50 border-blue-200 text-blue-800',
      border: 'border-blue-200',
    },
    tools: [
      { name: 'Copilot', emoji: '🐙', org: 'GitHub' },
      { name: 'Cursor', emoji: '🖱️', org: 'Cursor AI' },
      { name: 'Continue', emoji: '▶️', org: 'Continue.dev' },
      { name: 'Cody', emoji: '🦊', org: 'Sourcegraph' },
      { name: 'Codex', emoji: '📝', org: 'OpenAI' },
    ],
  },
  {
    title: 'Orchestration & Agents',
    emoji: '🤝',
    color: {
      header: 'bg-amber-600 text-white',
      chip: 'bg-amber-50 border-amber-200 text-amber-800',
      border: 'border-amber-200',
    },
    tools: [
      { name: 'LangChain', emoji: '⛓️', org: 'LangChain' },
      { name: 'CrewAI', emoji: '👥', org: 'CrewAI' },
      { name: 'AutoGPT', emoji: '🤖', org: 'Significant Gravitas' },
      { name: 'n8n', emoji: '🔌', org: 'n8n' },
      { name: 'Zapier AI', emoji: '⚡', org: 'Zapier' },
    ],
  },
  {
    title: 'Image & Creative',
    emoji: '🎨',
    color: {
      header: 'bg-rose-600 text-white',
      chip: 'bg-rose-50 border-rose-200 text-rose-800',
      border: 'border-rose-200',
    },
    tools: [
      { name: 'Midjourney', emoji: '🌌', org: 'Midjourney' },
      { name: 'DALL-E 3', emoji: '🖼️', org: 'OpenAI' },
      { name: 'Sora', emoji: '🎬', org: 'OpenAI' },
      { name: 'Stable Diffusion', emoji: '🎭', org: 'Stability AI' },
      { name: 'Runway', emoji: '✈️', org: 'Runway' },
    ],
  },
];

export default function AIEcosystem() {
  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {CATEGORIES.map((cat) => (
        <div
          key={cat.title}
          className={`border rounded-2xl overflow-hidden ${cat.color.border}`}
        >
          <div className={`px-5 py-4 flex items-center gap-2 ${cat.color.header}`}>
            <span className="text-xl">{cat.emoji}</span>
            <h3 className="font-semibold">{cat.title}</h3>
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {cat.tools.map((tool) => (
              <div
                key={tool.name}
                className={`border rounded-lg px-3 py-2 ${cat.color.chip}`}
              >
                <div className="text-sm font-medium leading-tight">
                  {tool.emoji} {tool.name}
                </div>
                <div className="text-xs opacity-60 mt-0.5">{tool.org}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
