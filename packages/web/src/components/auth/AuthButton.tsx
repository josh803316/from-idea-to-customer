/**
 * AuthButton — React island displayed in the nav.
 *
 * Shows "Sign in" when logged out, user name + "Sign out" when logged in.
 * Clicking "Sign in" navigates to /sign-in.
 */

import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth';

export default function AuthButton() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authClient.getSession().then((result) => {
      if (result.data?.user) {
        setUser({ name: result.data.user.name ?? result.data.user.email, email: result.data.user.email });
      }
      setLoading(false);
    });
  }, []);

  async function handleSignOut() {
    await authClient.signOut();
    window.location.reload();
  }

  if (loading) {
    return <div className="h-8 w-20 bg-gray-100 rounded animate-pulse" />;
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 hidden sm:block">{user.name}</span>
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <a
      href="/sign-in"
      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
    >
      Sign in
    </a>
  );
}
