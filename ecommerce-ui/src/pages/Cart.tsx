import { useEffect, useMemo, useState } from "react";
import api from "../api";
import { formatVND } from "../utils/format";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ShoppingCart, Trash2, Minus, Plus } from "lucide-react";

type CartProduct = {
  id: number;
  name: string;
  price: number;
  image?: string;
};

type CartItem = {
  id: number;
  product: CartProduct;
  quantity: number;
};

type CartData = {
  items: CartItem[];
  total: number;
};

function normalizeCart(data: any): CartData {
  const rawItems = data?.items ?? data?.Items ?? [];
  const items: CartItem[] = (rawItems as any[]).map((ci) => {
    const p = ci.product ?? ci.Product ?? {};
    return {
      id: ci.id ?? ci.Id,
      product: {
        id: p.id ?? p.Id,
        name: p.name ?? p.Name,
        price: p.price ?? p.Price ?? 0,
        image: p.image ?? p.Image,
      },
      quantity: ci.quantity ?? ci.Quantity ?? 1,
    } as CartItem;
  });
  const total =
    data?.total ?? data?.Total ?? items.reduce((sum, it) => sum + it.quantity * (it.product.price ?? 0), 0);
  return { items, total };
}

export default function Cart() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
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
      .then((res) => setCart(normalizeCart(res.data)))
      .catch(() => toast.error("❌ Failed to load cart"));
  }, [token]);

  const totalItems = useMemo(() => cart?.items.reduce((sum, it) => sum + it.quantity, 0) ?? 0, [cart]);
  const subtotal = useMemo(
    () => cart?.items.reduce((sum, it) => sum + it.quantity * (it.product.price ?? 0), 0) ?? 0,
    [cart]
  );

  const removeItem = async (id: number) => {
    try {
      setUpdatingId(id);
      await api.delete(`/cart/${id}`);
      setCart((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.filter((i) => i.id !== id),
              total: prev.items.filter((i) => i.id !== id).reduce((s, it) => s + it.quantity * it.product.price, 0),
            }
          : prev
      );
      toast.success("🗑 Item removed");
    } catch {
      toast.error("❌ Failed to remove item");
    } finally {
      setUpdatingId(null);
    }
  };

  const updateQuantity = async (id: number, quantity: number) => {
    if (quantity <= 0) return removeItem(id);
    try {
      setUpdatingId(id);
      await api.put(`/cart/${id}`, { quantity });
      setCart((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((it) => (it.id === id ? { ...it, quantity } : it)),
              total: prev.items
                .map((it) => (it.id === id ? { ...it, quantity } : it))
                .reduce((s, t) => s + t.quantity * t.product.price, 0),
            }
          : prev
      );
    } catch {
      toast.error("❌ Failed to update quantity");
    } finally {
      setUpdatingId(null);
    }
  };

  if (!cart)
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="h-48 rounded-2xl border bg-white/60 shadow-sm flex items-center justify-center text-gray-500">
          Loading cart...
        </div>
      </div>
    );

  if (cart.items.length === 0)
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500 space-y-4">
          <ShoppingCart className="w-16 h-16 text-gray-400" />
          <p className="text-lg font-medium">Your cart is empty</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 text-white px-4 py-2.5 shadow hover:bg-blue-700"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );

  return (
    <div className="px-6 py-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-6">🛒 Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-3">
            <div className="hidden md:grid grid-cols-12 px-4 py-3 text-xs uppercase tracking-wide text-gray-500">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-right">Unit price</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Subtotal</div>
            </div>

            {cart.items.map((i) => (
              <div
                key={i.id}
                className="grid grid-cols-12 items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition hover:-translate-y-0.5"
              >
                {/* Product */}
                <div className="col-span-12 md:col-span-6 flex items-center gap-4">
                  {i.product.image ? (
                    <img
                      src={i.product.image}
                      alt={i.product.name}
                      className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg bg-gray-50 border"
                    />
                  ) : (
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-gray-50 border" />
                  )}
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 truncate">{i.product.name}</div>
                    <button
                      onClick={() => removeItem(i.id)}
                      className="mt-1 inline-flex items-center gap-1 text-xs text-red-600 hover:underline"
                      disabled={updatingId === i.id}
                    >
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                  </div>
                </div>

                {/* Unit price */}
                <div className="col-span-6 md:col-span-2 text-right md:text-right">
                  <div className="text-sm text-gray-600 md:text-base md:text-gray-900">{formatVND(i.product.price)}</div>
                </div>

                {/* Quantity */}
                <div className="col-span-6 md:col-span-2 flex md:justify-center">
                  <div className="inline-flex items-center rounded-md border bg-white">
                    <button
                      aria-label="Decrease quantity"
                      className="p-2 disabled:opacity-50"
                      onClick={() => updateQuantity(i.id, i.quantity - 1)}
                      disabled={updatingId === i.id || i.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={i.quantity}
                      onChange={(e) => {
                        const q = parseInt(e.target.value || "1", 10);
                        if (Number.isFinite(q) && q >= 1) updateQuantity(i.id, q);
                      }}
                      className="w-12 text-center px-2 py-1 outline-none"
                    />
                    <button
                      aria-label="Increase quantity"
                      className="p-2 disabled:opacity-50"
                      onClick={() => updateQuantity(i.id, i.quantity + 1)}
                      disabled={updatingId === i.id}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="col-span-12 md:col-span-2 text-right font-semibold text-gray-900">
                  {formatVND(i.quantity * i.product.price)}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Cart Summary</h3>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Items</span>
                  <span className="font-medium">{totalItems}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatVND(subtotal)}</span>
                </div>
                <div className="pt-3 mt-3 border-t flex items-center justify-between">
                  <span className="text-gray-700 font-medium">Total</span>
                  <span className="text-lg font-bold text-blue-600">{formatVND(subtotal)}</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 hover:bg-gray-50"
                >
                  Continue Shopping
                </Link>

                <Button onClick={() => navigate("/checkout")} className="w-full">
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
