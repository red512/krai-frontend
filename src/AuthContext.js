import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

const cfg = window.__CONFIG__ || {};
const GOOGLE_CLIENT_ID = cfg.GOOGLE_CLIENT_ID || "";

function decodeJwtPayload(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [gsiReady, setGsiReady] = useState(false);

  const handleCredentialResponse = useCallback((response) => {
    const payload = decodeJwtPayload(response.credential);
    if (payload) {
      setUser({
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        token: response.credential,
      });
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  }, []);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const initGsi = () => {
      if (!window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
      setGsiReady(true);
    };

    if (window.google?.accounts?.id) {
      initGsi();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          initGsi();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [handleCredentialResponse]);

  return (
    <AuthContext.Provider value={{ user, logout, oauthEnabled: !!GOOGLE_CLIENT_ID, gsiReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
