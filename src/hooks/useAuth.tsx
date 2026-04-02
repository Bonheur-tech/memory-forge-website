import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = "super_admin" | "admin" | "judge" | "coordinator" | null;

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]       = useState<User | null>(null);
  const [role, setRole]       = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  // Prevents getSession() and onAuthStateChange(INITIAL_SESSION) from racing each other
  const authHandled = useRef(false);

  const fetchRole = async (uid: string): Promise<UserRole> => {
    const attempt = async (): Promise<UserRole> => {
      // Try the RPC first (SECURITY DEFINER — bypasses RLS for all roles)
      try {
        const { data, error } = await supabase.rpc("get_user_role", { _user_id: uid });
        if (!error && data) return data as UserRole;
      } catch { /* fall through */ }

      // Fallback: direct table query — works because "Users can view own roles" RLS policy
      try {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", uid)
          .maybeSingle();
        return (data?.role as UserRole) ?? null;
      } catch {
        return null;
      }
    };

    const timeout = new Promise<null>(resolve => setTimeout(() => resolve(null), 8000));
    const result = await Promise.race([attempt(), timeout]) as UserRole;

    // If null on first try, wait 2s and retry once — handles cold-start / transient failures
    if (result === null) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const retry = new Promise<null>(resolve => setTimeout(() => resolve(null), 8000));
      return Promise.race([attempt(), retry]) as Promise<UserRole>;
    }

    return result;
  };

  useEffect(() => {
    // onAuthStateChange fires INITIAL_SESSION immediately in Supabase v2.
    // getSession() is kept as a fallback in case INITIAL_SESSION doesn't fire.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Token refresh / metadata update — don't re-fetch role, just update the user object
      if (event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
        setUser(session?.user ?? null);
        return;
      }

      authHandled.current = true;
      setLoading(true);
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        const r = await fetchRole(u.id);
        setRole(r);
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    // Fallback hydration: only runs if onAuthStateChange didn't already handle it
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (authHandled.current) return;
      authHandled.current = true;
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        const r = await fetchRole(u.id);
        setRole(r);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  };

  const isAdmin = role === "admin" || role === "super_admin";

  return (
    <AuthContext.Provider value={{ user, role, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
