import { createContext, useContext, useMemo, useState } from "react";

type Language = "vi" | "en";

type Dictionary = Record<string, { vi: string; en: string }>;

const DICT: Dictionary = {
  products: { vi: "Sản phẩm", en: "Products" },
  cart: { vi: "Giỏ hàng", en: "Cart" },
  logout: { vi: "Đăng xuất", en: "Logout" },
  addProduct: { vi: "Thêm sản phẩm", en: "Add Product" },
  productList: { vi: "Danh sách sản phẩm", en: "Product List" },
  addToCart: { vi: "Thêm vào giỏ", en: "Add to Cart" },
  edit: { vi: "Sửa", en: "Edit" },
  delete: { vi: "Xóa", en: "Delete" },
  noImage: { vi: "Không có ảnh", en: "No image" },
  previous: { vi: "Trước", en: "Previous" },
  next: { vi: "Sau", en: "Next" },
};

const I18nContext = createContext<any>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(
    (localStorage.getItem("lang") as Language) || "vi"
  );

  const t = useMemo(
    () =>
      (key: keyof typeof DICT): string => {
        const item = DICT[key];
        if (!item) return key;
        return item[lang];
      },
    [lang]
  );

  const switchLang = (l: Language) => {
    setLang(l);
    localStorage.setItem("lang", l);
  };

  return (
    <I18nContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
