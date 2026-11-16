
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const API_URL = "http://localhost:3000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  // Sign in an existing user.
  const signin = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to sign in.");
    }

    setUser(data.user);
    setToken(data.token);

    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);

    return data;
  };

  // Register a new user.
  const signup = async (name, email, password) => {
    const response = await fetch(`${API_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to sign up.");
    }

    return data;
  };

  // Sign out the current user.
  const signout = async () => {
    try {
      await fetch(`${API_URL}/auth/signout`, {
        method: "GET",
        credentials: "include",
      });
    } finally {
      setUser(null);
      setToken(null);

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, signin, signup, signout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Access authentication information from other components.
export function useAuth() {
  return useContext(AuthContext);
}
