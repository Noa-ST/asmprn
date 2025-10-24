import { useEffect, useMemo, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { formatVND } from "../utils/format";
import { ShoppingBag, Package, BadgeCheck, Truck, Clock3, XCircle, Eye, RotateCcw } from "lucide-react";

type OrderItem = {
  id?: number;
  product?: { id?: number; name?: string; price?: number; image?: string };
  quantity?: number;
  price?: number;
};

type Order = {
  id: number;
  status?: string;
  orderDate?: string;
  createdAt?: string; // fallback
  totalAmount?: number;
  products?: OrderItem[]; // backend uses Products
  items?: OrderItem[]; // fallback if frontend expects items
};

function statusBadge(status?: string) {
  const s = (status || "pending").toLowerCase();
  const map: Record<string, { label: string; color: string; icon: JSX.Element }> = {
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: <Clock3 className="w-4 h-4" /> },
    processing: { label: "Processing", color: "bg-blue-100 text-blue-800", icon: <Package className="w-4 h-4" /> },
    shipped: { label: "Shipped", color: "bg-purple-100 text-purple-800", icon: <Truck className="w-4 h-4" /> },
    completed: { label: "Completed", color: "bg-green-100 text-green-800", icon: <BadgeCheck className="w-4 h-4" /> },
    canceled: { label: "Canceled", color: "bg-red-100 text-red-700", icon: <XCircle className="w-4 h-4" /> },
  };
  const m = map[s] ?? map.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${m.color}`}>
      {m.icon}
      {m.label}
    </span>
  );
}

function shortOrderId(id: number) {
  return `#ORD-${String(id).padStart(4, "0")}`;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("🔒 Please login to view orders");
      navigate("/login");
      return;
    }
    api
      .get("/orders")
      .then((res) => setOrders(res.data))
      .catch(() => toast.error("❌ Failed to load orders"));
  }, [token]);

  const hasNoOrders = useMemo(() => !orders || orders.length === 0, [orders]);

  if (hasNoOrders) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500 space-y-4">
          <ShoppingBag className="w-16 h-16 text-gray-400" />
          <p className="text-lg font-medium">You haven’t placed any orders yet.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 text-white px-4 py-2.5 shadow hover:bg-blue-700"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Order History</h2>
        <p className="text-sm text-gray-500 mt-1">Track your recent purchases and statuses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.map((o) => {
          const list = (o.products ?? o.items ?? []) as OrderItem[];
          const orderDate = o.orderDate || o.createdAt;
          const when = orderDate ? new Date(orderDate).toLocaleString() : "";
          const total = o.totalAmount ?? list.reduce((s, it) => s + (it.quantity ?? 0) * (it.price ?? it.product?.price ?? 0), 0);
          return (
            <div
              key={o.id}
              className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition hover:-translate-y-0.5"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-gray-500">Order</div>
                  <div className="text-lg font-semibold text-gray-900">{shortOrderId(o.id)}</div>
                </div>
                <div className="flex items-center gap-3">
                  {statusBadge(o.status)}
                </div>
              </div>
              <div className="mt-1 text-xs text-gray-500">{when}</div>

              {/* Items */}
              <div className="mt-4 divide-y rounded-lg border bg-gray-50">
                {list.map((it, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3">
                    {it.product?.image ? (
                      <img src={it.product.image} alt={it.product.name} className="w-12 h-12 rounded object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded bg-white border" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-sm font-medium text-gray-900">{it.product?.name}</div>
                      <div className="text-xs text-gray-500">x{it.quantity}</div>
                    </div>
                    <div className="text-sm font-medium">{formatVND(it.price ?? it.product?.price ?? 0)}</div>
                  </div>
                ))}
              </div>

              {/* Footer summary & actions */}
              <div className="mt-4 flex items-end justify-between">
                <div className="text-sm text-gray-600">
                  <div>Total items: {list.reduce((s, it) => s + (it.quantity ?? 0), 0)}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Total amount</div>
                  <div className="text-lg font-bold text-blue-600">{formatVND(total)}</div>
                  <div className="mt-3 flex items-center gap-2">
                    <button className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">
                      <Eye className="w-4 h-4" /> View Details
                    </button>
                    <button className="inline-flex items-center gap-1 rounded-md bg-blue-600 text-white px-3 py-1.5 text-sm hover:bg-blue-700">
                      <RotateCcw className="w-4 h-4" /> Reorder
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
