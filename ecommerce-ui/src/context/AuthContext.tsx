import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail"));

  const login = (email: string, jwt: string) => {
    localStorage.setItem("token", jwt);
    localStorage.setItem("userEmail", email);
    setToken(jwt);
    setUserEmail(email);
    toast.success("✅ Logged in!");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setToken(null);
    setUserEmail(null);
    toast.success("👋 Logged out");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ token, userEmail, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
