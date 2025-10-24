// src/components/Navbar.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";
import {
  ShoppingCart,
  User,
  LogOut,
  Globe,
  ChevronDown,
} from "lucide-react";
import { useMemo, useState } from "react";

export default function Navbar() {
  const { isAuthenticated, logout, userEmail } = useAuth();
  const { lang, switchLang, t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navItems = useMemo(
    () => [
      { label: t("products"), to: "/products" },
      { label: t("orders"), to: "/orders" },
      // Placeholder routes for now; keep structure for dashboard feel
      { label: t("customers"), to: "#" },
      { label: t("statistics"), to: "#" },
    ],
    [t]
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/products")}
            className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
            aria-label="MyShop Home"
          >
            🛍️ MyShop
          </button>
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1 ml-6">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                const isDisabled = item.to === "#";
                const base =
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors";
                if (isDisabled) {
                  return (
                    <span
                      key={item.label}
                      className="px-3 py-2 rounded-md text-sm text-gray-400 cursor-not-allowed"
                    >
                      {item.label}
                    </span>
                  );
                }
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={
                      base +
                      (isActive
                        ? " text-blue-700 bg-blue-50"
                        : " text-gray-700 hover:text-blue-600 hover:bg-gray-50")
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
              aria-label={t("cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline">{t("cart")}</span>
            </Link>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => switchLang(lang === "vi" ? "en" : "vi")}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                aria-label="Switch language"
              >
                <Globe className="h-5 w-5" />
                <span className="text-xs font-medium">{lang.toUpperCase()}</span>
              </button>
            </div>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen((s) => !s)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-blue-600 transition-colors"
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
              >
                <User className="h-5 w-5" />
                <span className="hidden sm:inline max-w-[160px] truncate">
                  {userEmail || "User"}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              {isUserMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg overflow-hidden"
                >
                  <div className="px-3 py-2 text-xs text-gray-500 border-b">
                    {userEmail}
                  </div>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                      navigate("/");
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-gray-700 hover:bg-gray-50"
                  >
                    <LogOut className="h-4 w-4" /> {t("logout")}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
