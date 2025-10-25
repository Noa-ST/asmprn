import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { formatVND } from "../utils/format";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
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

  return (
    <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">📜 Order History</h2>     {" "}
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((o) => (
          <div key={o.id} className="border p-4 rounded mb-4 bg-white">
                       {" "}
            <div className="flex items-center justify-between">
                            <div className="font-semibold">Order #{o.id}</div> 
                         {" "}
              <div className="text-sm text-gray-500">
                               {" "}
                {o.createdAt && new Date(o.createdAt).toLocaleString()}         
                   {" "}
              </div>
                         {" "}
            </div>
                       {" "}
            <div className="text-sm mt-1">Status: {o.status || "Pending"}</div> 
                     {" "}
            <div className="mt-3">
                           {" "}
              {(o.items || []).map((it: any) => (
                <div
                  key={it.id}
                  className="flex items-center gap-3 py-2 border-b"
                >
                                   {" "}
                  {it.product?.image && (
                    <img
                      src={it.product.image}
                      alt={it.product.name}
                      className="w-14 h-14 object-cover rounded"
                    />
                  )}
                                   {" "}
                  <div className="flex-1">
                                       {" "}
                    <div className="font-medium">{it.product?.name}</div>       
                               {" "}
                    <div className="text-gray-500 text-sm">x{it.quantity}</div> 
                                   {" "}
                  </div>
                                   {" "}
                  <div className="font-medium">
                                        {formatVND(it.product?.price || 0)}     
                               {" "}
                  </div>
                                 {" "}
                </div>
              ))}
                         {" "}
            </div>
                       {" "}
            <div className="text-right font-bold mt-3">
                            Total: {formatVND(o.totalAmount || 0)}           {" "}
            </div>
                     {" "}
          </div>
        ))
      )}
         {" "}
    </div>
  );
}
