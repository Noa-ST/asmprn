import { Link } from "react-router-dom";
import { ShoppingCart, Edit, Trash } from "lucide-react";
import { formatVND } from "../utils/format";
import { motion } from "framer-motion";

export interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  inStock?: boolean; // default true; if false show Sold out overlay
  canManage?: boolean; // show edit/delete
  onAddToCart?: (id: number) => void;
  onDelete?: (id: number) => void;
  labels?: {
    addToCart: string;
    edit: string;
    delete: string;
    noImage: string;
    soldOut: string;
  };
}

export default function ProductCard(props: ProductCardProps) {
  const {
    id,
    name,
    description,
    price,
    image,
    inStock = true,
    canManage = false,
    onAddToCart,
    onDelete,
    labels = {
      addToCart: "Add to Cart",
      edit: "Edit",
      delete: "Delete",
      noImage: "No image",
      soldOut: "Sold out",
    },
  } = props;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="group relative bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 hover:shadow-lg transition overflow-hidden"
    >
      <Link to={`/products/${id}`} className="block">
        <div className="relative aspect-[4/3] bg-gray-50">
          {image ? (
            <img
              src={image}
              alt={name}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-400">
              {labels.noImage}
            </div>
          )}
          {!inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="px-3 py-1 rounded-full text-white text-sm font-semibold bg-gradient-to-r from-gray-500 to-gray-700">
                {labels.soldOut}
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 space-y-2">
        <div>
          <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-lg font-extrabold text-green-600">{formatVND(price)}</div>
        </div>

        <div className="mt-3" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onAddToCart && onAddToCart(id)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <ShoppingCart className="h-4 w-4" /> {labels.addToCart}
          </button>

          {canManage && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link
                to={`/edit/${id}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-yellow-500 text-white py-2 text-sm font-medium hover:bg-yellow-600"
              >
                <Edit className="h-4 w-4" /> {labels.edit}
              </Link>
              <button
                onClick={() => onDelete && onDelete(id)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-500 text-white py-2 text-sm font-medium hover:bg-red-600"
              >
                <Trash className="h-4 w-4" /> {labels.delete}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
