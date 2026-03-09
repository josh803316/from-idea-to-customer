import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED = [
  'What is the Checkerboard model and how do I apply it?',
  'What will I actually learn in this curriculum?',
  'How does this site use feature flags and A/B testing?',
  'What is the difference between OS mode and OEM mode?',
  'How should I think about picking a tech stack?',
  'What does "thinking like a PM" actually mean for an engineer?',
  'Why does page speed matter for this site specifically?',
  'How does the site make money and what would improve revenue?',
];

export default function SiteAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  async function send(text: string) {
    const userMessage = text.trim();
    if (!userMessage || loading) return;

    setInput('');
    setError('');
    const next: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: next.slice(0, -1),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
      }

      const data = (await res.json()) as { reply: string };
      setMessages([...next, { role: 'assistant', content: data.reply }]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setError(msg);
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  const hasMessages = messages.length > 0;

  return (
    <section className="pb-16">
      {/* Heading */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-sm font-medium px-4 py-2 rounded-full mb-5">
          <span aria-hidden="true">🤖</span>
          <span>AI Assistant — ask anything about this site or curriculum</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          What do you want to know?
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto text-lg">
          Ask about the curriculum, the tech stack, how this site works, or
          any trade-off it makes. It knows everything.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Suggested questions — shown until first message sent */}
        {!hasMessages && (
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {SUGGESTED.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                disabled={loading}
                className="text-sm bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-full hover:border-brand-400 hover:text-brand-700 transition-colors disabled:opacity-50 text-left"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Chat window — only visible once conversation starts */}
        {hasMessages && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden mb-4">
            <div
              className="p-6 max-h-[480px] overflow-y-auto space-y-4"
              aria-live="polite"
              aria-label="Conversation"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0 mt-1 text-sm font-medium">
                      AI
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-brand-600 text-white rounded-tr-sm'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
                    }`}
                  >
                    {m.content}
                  </div>
                  {m.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center flex-shrink-0 mt-1 text-sm">
                      You
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0 text-sm font-medium">
                    AI
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3">
                    <span className="inline-flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>
        )}

        {/* Input */}
        <div className={`bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm ${hasMessages ? '' : 'shadow-md'}`}>
          <div className="flex gap-3 p-4">
            <textarea
              ref={inputRef}
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about the curriculum, the stack, A/B testing, feature flags, SEO…"
              disabled={loading}
              className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50"
            />
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              className="bg-brand-600 text-white px-5 py-3 rounded-xl font-medium text-sm hover:bg-brand-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 self-end"
            >
              {loading ? '…' : 'Send'}
            </button>
          </div>
          <div className="px-4 pb-3 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              <kbd className="bg-gray-100 px-1 rounded">Enter</kbd> to send &nbsp;·&nbsp;{' '}
              <kbd className="bg-gray-100 px-1 rounded">Shift+Enter</kbd> for new line
            </p>
            {hasMessages && (
              <button
                onClick={() => { setMessages([]); setError(''); }}
                className="text-xs text-gray-400 hover:text-gray-600 underline"
              >
                Clear conversation
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
