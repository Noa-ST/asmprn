import { useEffect, useMemo, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "../context/I18nContext";
import ProductCard from "../components/ProductCard";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

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

  const i18nLabels = useMemo(
    () => ({
      addToCart: t("addToCart"),
      edit: t("edit"),
      delete: t("delete"),
      noImage: t("noImage"),
      soldOut: t("soldOut") || "Sold out",
    }),
    [t]
  );

  return (
    <div className="px-6 py-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              📦 Product Management
            </h2>
            <p className="text-sm text-gray-500 mt-1">{t("productList")}</p>
          </div>
          {isAuthenticated && (
            <Link
              to="/create"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 shadow hover:from-blue-700 hover:to-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4" /> {t("addProduct")}
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              description={p.description}
              price={p.price}
              image={p.image}
              inStock={true}
              canManage={isAuthenticated}
              onAddToCart={addToCart}
              onDelete={handleDelete}
              labels={i18nLabels}
            />
          ))}
        </div>

        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 rounded-md border text-sm disabled:opacity-50 hover:bg-gray-50"
          >
            {t("previous")}
          </button>
          <span className="px-3 py-1.5 rounded-md border bg-white text-sm text-gray-700">
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 rounded-md border text-sm disabled:opacity-50 hover:bg-gray-50"
          >
            {t("next")}
          </button>
        </div>
      </div>

      {isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 sm:hidden"
        >
          <Link
            to="/create"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 shadow-lg"
          >
            <Plus className="h-5 w-5" /> {t("addProduct")}
          </Link>
        </motion.div>
      )}
    </div>
  );
}
