import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED = [
  'What would most improve our SEO score right now?',
  'Why does page speed matter for ad revenue?',
  'What analytics tools should we add to track engagement?',
  'How do I read the engagement metrics to know if content is working?',
  "What's the difference between bounce rate and exit rate?",
  'What UX changes would improve module completion rates?',
  'How does responsive design affect our CPM rates?',
  'How should we think about adding more structured data?',
];

export default function SiteAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
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
          history: next.slice(0, -1), // send prior turns, not the one we just added
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
      }

      const data = await res.json() as { reply: string };
      setMessages([...next, { role: 'assistant', content: data.reply }]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setError(msg);
      // roll back the user message so they can retry
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

  const isEmpty = messages.length === 0;

  return (
    <section className="py-20 border-t border-gray-100">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
          <span aria-hidden="true">&#129302;</span>
          <span>Site Analysis Agent &mdash; powered by Claude</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Ask the agent anything about this site.
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          It knows the stack, the monetisation goal, and the current metrics. Use it to
          pressure-test decisions, explore trade-offs, or understand why a specific number matters.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Chat window */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden mb-4">
          <div
            className="p-6 min-h-[300px] max-h-[500px] overflow-y-auto space-y-4"
            aria-live="polite"
            aria-label="Conversation"
          >
            {isEmpty && (
              <div className="flex flex-col items-center justify-center h-48 text-center text-gray-400">
                <span className="text-5xl mb-4" aria-hidden="true">&#129302;</span>
                <p className="font-medium text-gray-500">Ask me about SEO, performance, engagement, or any trade-off this site makes.</p>
                <p className="text-sm mt-1">Try one of the suggestions below to get started.</p>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0 mt-1 text-sm">
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
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0 text-sm">
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

          {/* Input area */}
          <div className="border-t border-gray-200 bg-white p-4">
            <div className="flex gap-3">
              <textarea
                ref={inputRef}
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about SEO, performance, engagement, or the monetisation model…"
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
            <p className="text-xs text-gray-400 mt-2">
              Press <kbd className="bg-gray-100 px-1 rounded">Enter</kbd> to send &nbsp;·&nbsp; <kbd className="bg-gray-100 px-1 rounded">Shift+Enter</kbd> for new line
            </p>
          </div>
        </div>

        {/* Suggested questions */}
        <div>
          <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">Suggested questions</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                disabled={loading}
                className="text-xs bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:border-brand-400 hover:text-brand-700 transition-colors disabled:opacity-50 text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
