import { useEffect, useMemo, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";
import { formatVND } from "../utils/format";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ChevronRight, MapPin, Phone, Mail, User, ShoppingCart, CheckCircle2 } from "lucide-react";

type CartProduct = { id: number; name: string; price: number; image?: string };
type CartItem = { id: number; product: CartProduct; quantity: number };

function normalizeCartItems(data: any): CartItem[] {
  const rawItems = data?.items ?? data?.Items ?? [];
  return (rawItems as any[]).map((ci) => {
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
}

export default function Checkout() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/cart")
      .then((res) => setItems(normalizeCartItems(res.data)))
      .catch(() => toast.error("❌ Failed to load cart"));
  }, []);

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.quantity * (it.product.price ?? 0), 0),
    [items]
  );
  const shippingFee = subtotal > 0 ? 15000 : 0;
  const total = subtotal + shippingFee;

  const handleCheckout = async () => {
    if (!form.name || !form.address || !form.phone || !form.email) {
      toast.error("⚠️ Please fill all shipping fields");
      return;
    }
    try {
      await api.post("/orders");
      toast.success("✅ Order placed!");
      navigate("/payment-success");
    } catch {
      toast.error("❌ Checkout failed");
    }
  };

  return (
    <div className="px-6 py-6">
      <div className="max-w-5xl mx-auto">
        {/* Progress */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/cart" className="hover:text-gray-900 inline-flex items-center gap-1">
            <ShoppingCart className="w-4 h-4" /> Cart
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium inline-flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-blue-600" /> Checkout
          </span>
          <ChevronRight className="w-4 h-4" />
          <span>Complete</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Shipping */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Shipping Information</h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Full name</label>
                  <div className="mt-1 relative">
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Nguyen Van A"
                      className="w-full rounded-lg border px-3 py-2 pl-9 focus:ring-2 focus:ring-blue-200"
                    />
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Phone</label>
                  <div className="mt-1 relative">
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="0901 234 567"
                      className="w-full rounded-lg border px-3 py-2 pl-9 focus:ring-2 focus:ring-blue-200"
                    />
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm text-gray-600">Email</label>
                  <div className="mt-1 relative">
                    <input
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full rounded-lg border px-3 py-2 pl-9 focus:ring-2 focus:ring-blue-200"
                    />
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm text-gray-600">Address</label>
                  <div className="mt-1 relative">
                    <input
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="123, Ward, District, City"
                      className="w-full rounded-lg border px-3 py-2 pl-9 focus:ring-2 focus:ring-blue-200"
                    />
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Order Summary</h3>
              <div className="mt-4 space-y-3">
                <div className="divide-y rounded-lg border bg-gray-50">
                  {items.map((it) => (
                    <div key={it.id} className="flex items-center gap-3 p-3">
                      {it.product.image ? (
                        <img src={it.product.image} alt={it.product.name} className="w-12 h-12 rounded object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded bg-white border" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="truncate text-sm font-medium text-gray-900">{it.product.name}</div>
                        <div className="text-xs text-gray-500">x{it.quantity}</div>
                      </div>
                      <div className="text-sm font-medium">{formatVND(it.product.price)}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatVND(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Shipping fee</span>
                  <span className="font-medium">{formatVND(shippingFee)}</span>
                </div>
                <div className="pt-3 mt-2 border-t flex items-center justify-between">
                  <span className="text-gray-700 font-medium">Total</span>
                  <span className="text-lg font-bold text-blue-600">{formatVND(total)}</span>
                </div>
              </div>

              <Button onClick={handleCheckout} className="w-full mt-6">
                Confirm & Pay
              </Button>
            </div>
          </div>
        </div>

        {/* Sticky on mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t bg-white/90 backdrop-blur p-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500">Total</div>
              <div className="text-lg font-bold text-blue-600">{formatVND(total)}</div>
            </div>
            <Button onClick={handleCheckout} className="min-w-[180px]">Confirm & Pay</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
