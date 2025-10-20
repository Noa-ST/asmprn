import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import { formatVND } from "../utils/format";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    api.get(`/Products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <p className="p-6 text-gray-500">Loading...</p>;

  return (
    <div className="flex justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full overflow-hidden">
        {/* Image */}
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-80 object-contain bg-gray-100"
          />
        )}

        {/* Info */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {product.name}
          </h2>
          <p className="text-gray-600 mb-3">{product.description}</p>
          <p className="text-blue-600 font-bold text-xl mb-6">
            {formatVND(product.price)}
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <Link
              to={`/edit/${product.id}`}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
            >
              ✏ Edit
            </Link>
            <Link
              to="/"
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
            >
              ⬅ Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
