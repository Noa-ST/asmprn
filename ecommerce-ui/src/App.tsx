// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductList from "./pages/ProductList";
import Auth from "./pages/Auth";
import CreateProduct from "./pages/CreateProduct";
import Cart from "./pages/Cart";
import EditProduct from "./pages/EditProduct";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import ProductDetail from "./pages/ProductDetail";
import Orders from "./pages/Orders";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { I18nProvider } from "./context/I18nContext";
import { Toaster } from "react-hot-toast";
import { JSX } from "react";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/products" /> : <Auth />}
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/:id"
          element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <I18nProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </I18nProvider>
    </AuthProvider>
  );
}
