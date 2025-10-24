import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

import api from "../api";
import { useAuth } from "../context/AuthContext";

// A modern, polished Auth page with animated tabs and inputs
// Built with React + TypeScript + TailwindCSS + Framer Motion
// Drop-in ready for routes like "/auth", "/login", or "/register"

type Mode = "login" | "register";

export default function AuthPage() {
  const location = useLocation();
  const initialMode: Mode = location.pathname.includes("register") ? "register" : "login";

  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const isLogin = mode === "login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (!isLogin && password !== confirm) {
      toast.error("⚠️ Passwords do not match");
      return;
    }

    try {
      setIsSubmitting(true);
      if (isLogin) {
        const res = await api.post("/auth/login", { email, password });
        login(email, res.data.token);
        toast.success("✅ Logged in!");
        navigate("/products");
      } else {
        await api.post("/auth/register", { email, password });
        toast.success("✅ Registered successfully!");
        setMode("login");
      }
    } catch (err) {
      toast.error("❌ Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-6 select-none">
          <div className="inline-flex items-center gap-2 text-2xl font-bold text-blue-700">
            <span role="img" aria-label="bag">🛍️</span>
            <span>MyShop</span>
          </div>
          <p className="mt-1 text-sm text-gray-500">Welcome back! Please {isLogin ? "sign in" : "create your account"}.</p>
        </div>

        {/* Card */}
        <div className="relative bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-white/70 p-6 sm:p-8">
          {/* Tabs */}
          <div className="relative flex bg-gray-100 rounded-full p-1 mb-6 overflow-hidden">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`relative z-10 flex-1 py-2 text-sm font-medium transition-colors ${
                isLogin ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {isLogin && (
                <motion.span
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-full bg-white shadow"
                />
              )}
              <span className="relative">Login</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`relative z-10 flex-1 py-2 text-sm font-medium transition-colors ${
                !isLogin ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {!isLogin && (
                <motion.span
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-full bg-white shadow"
                />
              )}
              <span className="relative">Register</span>
            </button>
          </div>

          {/* Forms with slide animation */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.form
              key={mode}
              onSubmit={handleSubmit}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="space-y-4"
            >
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white/80 pl-10 pr-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white/80 pl-10 pr-10 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
                    placeholder={isLogin ? "Your password" : "Create a strong password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password - only for register */}
              {mode === "register" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      autoComplete="new-password"
                      required
                      className="w-full rounded-xl border border-gray-200 bg-white/80 pl-10 pr-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
                      placeholder="Re-enter your password"
                    />
                  </div>
                </div>
              )}

              {/* Submit */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white font-medium py-2.5 shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (isLogin ? "Signing in..." : "Creating account...") : isLogin ? "Login" : "Register"}
              </motion.button>

              {/* Helper text */}
              <div className="text-center text-sm text-gray-600">
                {isLogin ? (
                  <span>
                    Don’t have an account?{" "}
                    <button
                      type="button"
                      className="font-semibold text-blue-600 hover:text-blue-700"
                      onClick={() => setMode("register")}
                    >
                      Register here
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="font-semibold text-blue-600 hover:text-blue-700"
                      onClick={() => setMode("login")}
                    >
                      Login here
                    </button>
                  </span>
                )}
              </div>
            </motion.form>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
