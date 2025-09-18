import React, { useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type UsuarioRow = {
  user_id: string;
  nome?: string | null;
  email?: string | null;
  empresa_id?: number | null;
  logo_url?: string | null;
};

type UserState = {
  loading: boolean;
  user: { id: string; email?: string | null } | null;
  profile: UsuarioRow | null;
  refresh: () => Promise<void>;
};

const UserContext = React.createContext<UserState | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email?: string | null } | null>(null);
  const [profile, setProfile] = useState<UsuarioRow | null>(null);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.auth.getUser();
      const u = (data as unknown as { user?: Record<string, unknown> })?.user ?? null;
      if (u) {
        setUser({ id: String(u.id), email: (u.email as string) ?? null });
        // try fetch profile row
        try {
          const { data: row, error } = await supabase.from('usuarios').select('user_id, nome, email, empresa_id, logo_url').eq('user_id', u.id).single();
          if (!error && row) {
            setProfile(row as UsuarioRow);
          } else {
            setProfile(null);
          }
        } catch (e) {
          setProfile(null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      // refresh on auth changes
      fetchUser();
    });
    return () => {
      // @ts-expect-error - subscription shape differs across supabase client versions
      sub?.subscription?.unsubscribe?.();
      // older versions return { data } with unsubscribe
      try { sub?.unsubscribe?.(); } catch (e) { /* noop */ }
    };
  }, []);

  const value: UserState = {
    loading,
    user,
    profile,
    refresh: fetchUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useCurrentUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useCurrentUser must be used within UserProvider');
  return ctx;
};

export default UserProvider;
