import { useState } from 'react';

interface Props {
  source?: string;
}

type FormState = 'idle' | 'loading' | 'success' | 'error' | 'duplicate';

export default function WaitlistForm({ source = 'homepage' }: Props) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const apiUrl = import.meta.env.PUBLIC_API_URL ?? 'http://localhost:3000';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || state === 'loading') return;

    setState('loading');
    setErrorMessage('');

    try {
      const res = await fetch(`${apiUrl}/email/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });

      if (res.status === 201) {
        setState('success');
      } else if (res.status === 409) {
        setState('duplicate');
      } else {
        const body = await res.json().catch(() => ({}));
        setErrorMessage((body as any).error ?? 'Something went wrong. Please try again.');
        setState('error');
      }
    } catch {
      setErrorMessage('Could not reach the server. Please try again later.');
      setState('error');
    }
  }

  if (state === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="text-2xl mb-2" aria-hidden="true">&#10003;</div>
        <p className="font-semibold text-green-800">You're on the list!</p>
        <p className="text-green-700 text-sm mt-1">
          We'll email you when new courses launch.
        </p>
      </div>
    );
  }

  if (state === 'duplicate') {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
        <p className="font-semibold text-blue-800">You're already on the list</p>
        <p className="text-blue-700 text-sm mt-1">
          We already have your email. We'll be in touch!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
        aria-label="Email address"
      />
      <button
        type="submit"
        disabled={state === 'loading'}
        className="bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {state === 'loading' ? 'Joining…' : 'Join waitlist'}
      </button>
      {state === 'error' && (
        <p role="alert" className="text-red-600 text-sm mt-1 col-span-full">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
