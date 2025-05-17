import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";
import RealtimeBalanceListener from "../api/realTimeBalanceListener";

const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // if (user) {

    //   console.log("User id founded: ", user);
    // } else {
    //   console.log("User ID not found");
    // }

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
      <RealtimeBalanceListener />;
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
