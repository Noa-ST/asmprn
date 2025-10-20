import { useEffect, useState } from "react";
import api from "../api";
import { formatVND } from "../utils/format";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState<any>(null);
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("🔒 Please login first!");
      navigate("/login");
      return;
    }
    api
      .get("/cart")
      .then((res) => setCart(res.data))
      .catch(() => toast.error("❌ Failed to load cart"));
  }, [token]);

  const removeItem = async (id: number) => {
    await api.delete(`/cart/${id}`);
    setCart({
      ...cart,
      items: cart.items.filter((i: any) => i.id !== id),
    });
    toast.success("🗑 Item removed");
  };

  if (!cart) return <p className="p-6">Loading cart...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🛒 Your Cart</h2>
      {cart.items.map((i: any) => (
        <div key={i.id} className="flex items-center gap-4 py-3 border-b">
          {i.product.image && (
            <img
              src={i.product.image}
              alt={i.product.name}
              className="w-20 h-20 object-cover rounded bg-gray-100"
            />
          )}
          <div className="flex-1">
            <div className="font-medium">{i.product.name}</div>
            <div className="text-sm text-gray-500">
              {i.quantity} × {formatVND(i.product.price)}
            </div>
          </div>
          <button
            onClick={() => removeItem(i.id)}
            className="text-red-500 hover:underline"
          >
            Remove
          </button>
        </div>
      ))}
      <div className="flex items-center justify-between mt-4">
        <div className="font-bold text-lg">Total: {formatVND(cart.total)}</div>
        <button
          onClick={() => navigate("/checkout")}
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
}
