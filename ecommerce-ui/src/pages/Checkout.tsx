import { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";
import { formatVND } from "../utils/format";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [summary, setSummary] = useState<{
    totalItems: number;
    total: number;
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/cart")
      .then((res) => {
        const items = res.data.items || [];
        const total = res.data.total || 0;
        setSummary({ totalItems: items.length, total });
      })
      .catch(() => toast.error("❌ Failed to load cart"));
  }, []);

  const handleCheckout = async () => {
    try {
      await api.post("/orders");
      toast.success("✅ Order placed!");
      navigate("/payment-success");
    } catch {
      toast.error("❌ Checkout failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <p>Total items: {summary?.totalItems ?? 0}</p>
      <p className="mt-2 font-semibold">
        Total: {formatVND(summary?.total ?? 0)}
      </p>
      <button
        onClick={handleCheckout}
        className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Confirm & Pay
      </button>
    </div>
  );
}
