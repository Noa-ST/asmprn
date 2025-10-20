import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return toast.error("⚠️ Passwords do not match");
    try {
      await api.post("/auth/register", { email, password });
      toast.success("✅ Registered successfully!");
      navigate("/login");
    } catch {
      toast.error("❌ Failed to register!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md"
    >
      <h2 className="text-xl font-bold text-center mb-4">Register</h2>
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
          <tr>
            <td></td>
            <td className="pt-4">
              <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Register
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
}
