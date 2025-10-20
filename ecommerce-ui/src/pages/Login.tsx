import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      login(email, res.data.token);
      toast.success("✅ Logged in!");
      navigate("/products");
    } catch (err: any) {
      toast.error("❌ Invalid credentials");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md"
    >
      <h2 className="text-xl font-bold text-center mb-4">Login</h2>
      <table className="w-full">
        <tbody>
          <tr>
            <td className="py-2 pr-4 w-32 font-medium">Email</td>
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
          <tr>
            <td></td>
            <td className="pt-4">
              <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Login
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
}
