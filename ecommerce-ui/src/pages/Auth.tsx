import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import toast from "react-hot-toast";

type Mode = "login" | "register";

export default function Auth() {
  const location = useLocation();
  const initialMode: Mode =
    location.pathname === "/register" ? "register" : "login";
  const [mode, setMode] = useState<Mode>(initialMode);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === "login") {
        const res = await api.post("/auth/login", { email, password });
        login(email, res.data.token);
        toast.success("✅ Logged in!");
        navigate("/products");
      } else {
        if (password !== confirm) {
          toast.error("⚠️ Passwords do not match");
          return;
        }
        await api.post("/auth/register", { email, password });
        toast.success("✅ Registered successfully!");
        setMode("login");
      }
    } catch {
      toast.error("❌ Operation failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <div className="flex mb-6">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 py-2 rounded-l-lg font-semibold ${
            mode === "login"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`flex-1 py-2 rounded-r-lg font-semibold ${
            mode === "register"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold text-center mb-4">
          {mode === "login" ? "Login" : "Register"}
        </h2>
        <table className="w-full">
          <tbody>
            <tr>
              <td className="py-2 pr-4 w-40 font-medium">Email</td>
              <td className="py-2">
                <input
                  type="email"
                  className="w-full border rounded px-3 py-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td className="py-2 pr-4 font-medium">Password</td>
              <td className="py-2">
                <input
                  type="password"
                  className="w-full border rounded px-3 py-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </td>
            </tr>
            {mode === "register" && (
              <tr>
                <td className="py-2 pr-4 font-medium">Confirm Password</td>
                <td className="py-2">
                  <input
                    type="password"
                    className="w-full border rounded px-3 py-2"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                  />
                </td>
              </tr>
            )}
            <tr>
              <td></td>
              <td className="pt-4">
                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                  {mode === "login" ? "Login" : "Register"}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}
