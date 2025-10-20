import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function CreateProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  // Upload ảnh lên Cloudinary
  const handleUpload = async () => {
    if (!file) return "";
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
      let imageUrl = "";
      if (file) {
        imageUrl = await handleUpload();
      }
      await api.post("/Products", {
        name,
        description,
        price,
        image: imageUrl,
      });
      toast.success("✅ Product created!");
      navigate("/");
    } catch {
      toast.error("❌ Failed to create product!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-blue-500"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-blue-500"
        />
        <input
          type="number"
          placeholder="Price (VND)"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-blue-500"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Save
        </button>
      </form>
    </div>
  );
}
