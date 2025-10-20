import { useEffect, useState } from "react";
import api from "../api";
import { formatVND } from "../utils/format";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "../context/I18nContext";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();

  useEffect(() => {
    api
      .get(`/products?page=${page}&pageSize=8`)
      .then((res) => {
        setProducts(res.data.items || res.data);
        if (res.data.totalPages) setTotalPages(res.data.totalPages);
      })
      .catch(() => toast.error("❌ Failed to fetch products"));
  }, [page]);

  const addToCart = async (productId: number) => {
    if (!isAuthenticated) {
      toast.error("⚠️ Please login first!");
      return;
    }
    try {
      await api.post("/cart", { productId, quantity: 1 });
      toast.success("🛒 Added to cart!");
    } catch {
      toast.error("❌ Failed to add to cart!");
    }
  };

  const handleDelete = async (id: number) => {
    if (!isAuthenticated) return toast.error("🔒 Login required");
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
      toast.success("🗑 Deleted successfully");
    } catch {
      toast.error("❌ Failed to delete product");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        📦 {t("productList")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
            onClick={() => navigate(`/products/${p.id}`)}
          >
            {p.image ? (
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-[220px] object-contain bg-gray-50"
              />
            ) : (
              <div className="w-full h-[220px] flex items-center justify-center bg-gray-50 text-gray-400">
                No image
              </div>
            )}
            <div className="p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="text-gray-500 text-sm">{p.description}</p>
                <p className="text-green-600 font-bold mt-2">
                  {formatVND(p.price)}
                </p>
              </div>
              <div
                className="flex flex-col gap-2 mt-4"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => addToCart(p.id)}
                  className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  🛒 {t("addToCart")}
                </button>

                {isAuthenticated && (
                  <div className="flex gap-2">
                    <Link
                      to={`/edit/${p.id}`}
                      className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 text-center"
                    >
                      ✏ {t("edit")}
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
                    >
                      🗑 {t("delete")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className="flex justify-center gap-3 mt-8">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          {t("previous")}
        </button>
        <span className="px-2 py-1">
          {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          {t("next")}
        </button>
      </div>
      {isAuthenticated && (
        <div className="fixed bottom-6 right-6">
          <Link
            to="/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700"
          >
            + Add Product
          </Link>
        </div>
      )}
    </div>
  );
}
