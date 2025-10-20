// src/components/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { lang, switchLang, t } = useI18n();
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-600 p-4 flex justify-between items-center shadow-md">
      <h1
        onClick={() => navigate("/")}
        className="text-white text-xl font-bold cursor-pointer"
      >
        🛍 My Shop
      </h1>

      <div className="space-x-4">
        {!isAuthenticated ? (
          <></>
        ) : (
          <>
            <Link to="/products" className="text-white hover:underline">
              {t("products")}
            </Link>
            <Link to="/cart" className="text-white hover:underline">
              {t("cart")}
            </Link>
            <select
              value={lang}
              onChange={(e) => switchLang(e.target.value as any)}
              className="bg-transparent text-white border rounded px-1"
            >
              <option value="vi">VI</option>
              <option value="en">EN</option>
            </select>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              {t("logout")}
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
