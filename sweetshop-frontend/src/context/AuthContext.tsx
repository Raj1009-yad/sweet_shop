// src/context/AuthContext.tsx
import { createContext, useEffect, useState} from "react";
import type {ReactNode} from "react";
import * as authApi from "../api/auth";
import toast from "react-hot-toast";

/** Types */
type User = {
  id?: string;
  email?: string;
  role?: string;
  name?: string;
} | null;

interface AuthContextValue {
  user: User;
  token: string | null;
  login: (email: string, password: string, admin?: boolean) => Promise<void>;
  register: (data: { name?: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  setUserFromToken: () => User | null;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** decode JWT payload safely (no verification) */
function decodeToken(token: string | null) {
  if (!token) return null;
  try {
    const raw = token.split(".")[1];
    const base64 = raw.replace(/-/g, "+").replace(/_/g, "/");
    const jsonStr = atob(base64);
    const payload = JSON.parse(jsonStr);
    return payload;
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem("token");
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState<User>(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) return JSON.parse(stored);
      const t = localStorage.getItem("token");
      const payload = decodeToken(t);
      if (payload) {
        const u: User = {
          id: payload.id ?? payload._id ?? undefined,
          email: payload.email ?? undefined,
          role: payload.role ?? undefined,
          name: payload.name ?? undefined,
        };
        try {
          localStorage.setItem("user", JSON.stringify(u));
        } catch {}
        return u;
      }
    } catch {
      // ignore
    }
    return null;
  });

  // ensure localStorage sync when token changes
  useEffect(() => {
    if (!token) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    } else {
      localStorage.setItem("token", token);
    }
  }, [token]);

  // on mount: if token exists but user missing, derive and persist it
  useEffect(() => {
    try {
      const t = localStorage.getItem("token");
      const stored = localStorage.getItem("user");
      if (t && !stored) {
        const payload = decodeToken(t);
        if (payload) {
          const u: User = {
            id: payload.id ?? payload._id ?? undefined,
            email: payload.email ?? undefined,
            role: payload.role ?? undefined,
            name: payload.name ?? undefined,
          };
          localStorage.setItem("user", JSON.stringify(u));
          setUser(u);
          setToken(t);
          console.debug("AuthProvider: derived user from token on mount", u);
        }
      }
    } catch (err) {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setUserAndToken = (t: string | null, u: any | null) => {
    if (t) {
      try {
        localStorage.setItem("token", t);
      } catch {}
      setToken(t);
    } else {
      try {
        localStorage.removeItem("token");
      } catch {}
      setToken(null);
    }

    if (u) {
      const normalized = {
        id: u.id ?? u._id ?? undefined,
        email: u.email ?? undefined,
        role: u.role ?? undefined,
        name: u.name ?? undefined,
      };
      try {
        localStorage.setItem("user", JSON.stringify(normalized));
      } catch {}
      setUser(normalized);
    } else {
      try {
        localStorage.removeItem("user");
      } catch {}
      setUser(null);
    }
  };

  const login = async (email: string, password: string, admin = false) => {
    try {
      const res = await authApi.login({ email, password, admin });
      const t = res.data?.token;
      const u = res.data?.user ?? decodeToken(t);
      if (!t) throw new Error("No token returned from server");
      const normalizedUser = u
        ? {
            id: u.id ?? u._id ?? undefined,
            email: u.email ?? undefined,
            role: u.role ?? undefined,
            name: u.name ?? undefined,
          }
        : null;
      setUserAndToken(t, normalizedUser);
      toast.success("Logged in");
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || "Login failed";
      toast.error(message);
      throw err;
    }
  };

  const register = async (data: { name?: string; email: string; password: string }) => {
    try {
      const res = await authApi.register(data);
      const t = res.data?.token;
      const u = res.data?.user ?? decodeToken(t);
      const normalizedUser = u
        ? {
            id: u.id ?? u._id ?? undefined,
            email: u.email ?? undefined,
            role: u.role ?? undefined,
            name: u.name ?? undefined,
          }
        : null;
      if (t) {
        setUserAndToken(t, normalizedUser);
        toast.success("Registered & logged in");
      } else {
        toast.success("Registered. Please log in.");
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || "Register failed";
      toast.error(message);
      throw err;
    }
  };

  const logout = () => {
    setUserAndToken(null, null);
    toast("Logged out");
  };

  const setUserFromToken = () => {
    const t = localStorage.getItem("token");
    const payload = decodeToken(t);
    if (!payload) return null;
    const u: User = {
      id: payload.id ?? payload._id ?? undefined,
      email: payload.email ?? undefined,
      role: payload.role ?? undefined,
      name: payload.name ?? undefined,
    };
    try {
      localStorage.setItem("user", JSON.stringify(u));
    } catch {}
    setUser(u);
    setToken(t);
    return u;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, setUserFromToken }}>
      {children}
    </AuthContext.Provider>
  );
};
