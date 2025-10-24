import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { formatVND } from "../utils/format";
import { Button } from "../components/ui/button";
import { Edit as EditIcon, Trash2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  images?: string[]; // optional gallery support
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    api.get(`/Products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  const gallery = useMemo(() => {
    if (!product) return [] as string[];
    if (Array.isArray(product.images) && product.images.length > 0) return product.images;
    return product.image ? [product.image] : [];
  }, [product]);

  const handleBack = () => {
    navigate("/products");
  };

  const handleEdit = () => {
    if (!product) return;
    navigate(`/edit/${product.id}`);
  };

  const handleDelete = async () => {
    if (!id) return;
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;
    try {
      await api.delete(`/Products/${id}`);
      toast.success("🗑️ Product deleted");
      navigate("/products");
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  if (!product) {
    return <p className="p-6 text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-xl shadow-md p-6"
      >
        {/* Left: Image and optional gallery */}
        <div>
          <div className="w-full h-96 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {gallery[0] ? (
              <img
                src={gallery[0]}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="text-gray-400">No image</div>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-3">
              {gallery.slice(1, 6).map((img, idx) => (
                <div
                  key={idx}
                  className="h-20 rounded-md bg-gray-50 border border-gray-100 overflow-hidden"
                >
                  <img src={img} alt="preview" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info and actions */}
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="mt-3 text-gray-600 leading-relaxed">{product.description}</p>
            <p className="mt-6 text-2xl font-semibold text-blue-600">
              {formatVND(product.price)}
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleEdit}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900"
            >
              <EditIcon size={18} /> Edit
            </Button>
            <Button
              onClick={handleBack}
              variant="secondary"
              className="bg-gray-200 hover:bg-gray-300 text-gray-900"
            >
              <ArrowLeft size={18} /> Back
            </Button>
            <Button onClick={handleDelete} variant="destructive">
              <Trash2 size={18} /> Delete
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
