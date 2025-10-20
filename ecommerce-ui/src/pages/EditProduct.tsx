import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    api.get(`/Products/${id}`).then((res) => {
      const p = res.data;
      setName(p.name);
      setDescription(p.description);
      setPrice(p.price);
      setImage(p.image || "");
    });
  }, [id]);

  const handleUpload = async () => {
    if (!file) return image; // giữ ảnh cũ nếu không upload mới
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "asm1prn232");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dblw5v3br/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const result = await res.json();
    return result.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const imageUrl = await handleUpload();
      await api.put(`/Products/${id}`, {
        id: Number(id),
        name,
        description,
        price,
        image: imageUrl,
      });
      toast.success("✏️ Product updated!");
      navigate("/");
    } catch {
      toast.error("❌ Failed to update product!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
        {/* hiển thị ảnh hiện tại */}
        {image && (
          <img src={image} alt="current" className="h-32 mx-auto rounded" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
        <button
          type="submit"
          className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600"
        >
          Update
        </button>
      </form>
    </div>
  );
}
