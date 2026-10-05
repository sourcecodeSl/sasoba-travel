import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, tokenStore } from './api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [state, setState] = useState('loading'); // loading | setup | signedOut | signedIn
  const [expired, setExpired] = useState(false);

  const refresh = useCallback(async () => {
    try {
      if (tokenStore.get()) {
        const { admin: me } = await api('auth/me');
        setAdmin(me);
        setState('signedIn');
        return;
      }
    } catch {
      tokenStore.clear();
    }
    try {
      const { needsSetup } = await api('auth/status');
      setState(needsSetup ? 'setup' : 'signedOut');
    } catch {
      setState('signedOut');
    }
  }, []);

  useEffect(() => {
    refresh();
    return tokenStore.onExpired(() => {
      setAdmin(null);
      setExpired(true);
      setState('signedOut');
    });
  }, [refresh]);

  const signIn = useCallback(async (email, password, remember) => {
    const res = await api('auth/login', { method: 'POST', body: { email, password, remember } });
    tokenStore.set(res.token, remember);
    setAdmin(res.admin);
    setExpired(false);
    setState('signedIn');
  }, []);

  const setup = useCallback(async (name, email, password) => {
    const res = await api('auth/setup', { method: 'POST', body: { name, email, password } });
    tokenStore.set(res.token, false);
    setAdmin(res.admin);
    setState('signedIn');
  }, []);

  const signOut = useCallback(async () => {
    try {
      await api('auth/logout', { method: 'POST' });
    } catch {
      /* already signed out on the server */
    }
    tokenStore.clear();
    setAdmin(null);
    setState('signedOut');
  }, []);

  const value = useMemo(() => ({ admin, setAdmin, state, expired, signIn, setup, signOut }), [admin, state, expired, signIn, setup, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
