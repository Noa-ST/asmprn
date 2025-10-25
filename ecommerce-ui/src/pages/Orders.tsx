// ecommerce-ui/src/pages/Orders.tsx
import React, { useEffect, useState, JSX } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { formatVND } from "../utils/format";
// Import các icon để hiển thị trạng thái
import { Clock3, Package, Truck, Check, X, MinusCircle } from "lucide-react";

interface OrderItemProduct {
  id: number;
  name: string;
  image?: string;
  price: number;
}

interface OrderItem {
  id: number;
  quantity: number;
  price: number; // Giá tại thời điểm đặt hàng
  product: OrderItemProduct;
}

interface Order {
  id: number;
  totalAmount: number;
  status: string;
  orderDate: string; // Tên thuộc tính này cần khớp với Backend (Order.cs đã sửa)
  products: OrderItem[]; // Tên thuộc tính này cần khớp với Backend
}

// Hàm hiển thị trạng thái đơn hàng trực quan
function statusBadge(status?: string) {
  const s = (status || "pending").toLowerCase();

  // SỬA: Type cho icon sử dụng JSX.Element (đã được import ở trên)
  const map: Record<
    string,
    { label: string; color: string; icon: JSX.Element }
  > = {
    pending: {
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
      icon: <Clock3 className="w-4 h-4" />,
    },
    processing: {
      label: "Processing",
      color: "bg-blue-100 text-blue-800",
      icon: <Package className="w-4 h-4" />,
    },
    shipped: {
      label: "Shipped",
      color: "bg-purple-100 text-purple-800",
      icon: <Truck className="w-4 h-4" />,
    },
    delivered: {
      label: "Delivered",
      color: "bg-green-100 text-green-800",
      icon: <Check className="w-4 h-4" />,
    },
    cancelled: {
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
      icon: <X className="w-4 h-4" />,
    },
    failed: {
      label: "Failed",
      color: "bg-red-100 text-red-800",
      icon: <MinusCircle className="w-4 h-4" />,
    },
  };

  const badge = map[s] || map.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-medium ${badge.color}`}
    >
      {badge.icon}
      {badge.label}
    </span>
  );
}

export default function Orders() {
  // SỬA: Sử dụng interface Order
  const [orders, setOrders] = useState<Order[]>([]);
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("🔒 Please login to view orders");
      navigate("/login");
      return;
    }
    // Lỗi CORS (từ hình ảnh trước) có thể đã được khắc phục nếu bạn thêm origin mới
    api
      .get("/orders")
      // SỬA: Đảm bảo res.data là mảng Order[]
      .then((res) => setOrders(res.data))
      .catch(() => toast.error("❌ Failed to load orders"));
  }, [token, isAuthenticated, navigate]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📜 Order History</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((o) => (
          <div
            key={o.id}
            className="border p-4 rounded mb-4 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between border-b pb-2 mb-2">
              <div className="font-semibold text-gray-900">Order #{o.id}</div>
              <div className="text-sm text-gray-500">
                {/* SỬA: Hiển thị OrderDate thay vì createdAt */}
                {o.orderDate && new Date(o.orderDate).toLocaleString()}
              </div>
            </div>

            {/* BỔ SUNG: Hiển thị trạng thái bằng badge */}
            <div className="flex items-center justify-between text-sm mt-1">
              {statusBadge(o.status)}
              <div className="text-right font-bold text-lg text-blue-600">
                {formatVND(o.totalAmount || 0)}
              </div>
            </div>

            <div className="mt-3">
              {/* SỬA: Sử dụng o.products thay vì o.items */}
              {(o.products || []).map((it) => (
                <div
                  key={it.id}
                  className="flex items-center gap-3 py-2 border-t mt-2"
                >
                  {it.product?.image && (
                    <img
                      src={it.product.image}
                      alt={it.product.name}
                      className="w-14 h-14 object-cover rounded bg-gray-50"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {it.product?.name}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {it.quantity} x {formatVND(it.price || 0)}
                    </div>
                  </div>
                  <div className="font-medium text-right text-gray-700">
                    {formatVND(it.quantity * it.price || 0)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
