import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import CustomCursor from "./components/common/CustomCursor";
import Navbar from "./components/common/Navbar";
import AIAssistant from "./components/common/AIAssistant";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";

import BuyerOnboarding from "./pages/BuyerOnboarding";
import SupplierOnboarding from "./pages/SupplierOnboarding";

import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";

import BuyerDashboard from "./pages/BuyerDashboard";
import BuyerOrders from "./pages/BuyerOrders";

import SupplierDashboard from "./pages/SupplierDashboard";
import SupplierProfile from "./pages/SupplierProfile";
import SupplierLanding from "./pages/SupplierLanding";
import SupplierOrders from "./pages/SupplierOrders";
import SupplierInventory from "./pages/SupplierInventory";
import AddProduct from "./pages/AddProduct";

import Suppliers from "./pages/Suppliers";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
      <CustomCursor />

      <div className="min-h-screen bg-[#f8fafc]">
        <Navbar />

        <Routes>
          {/* =====================================================
              PUBLIC ROUTES
          ===================================================== */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/marketplace"
            element={<Marketplace />}
          />

          <Route
            path="/products/:id"
            element={<ProductDetails />}
          />

          <Route
            path="/suppliers"
            element={<Suppliers />}
          />

          <Route
            path="/supplier"
            element={<SupplierLanding />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* =====================================================
              BUYER ONBOARDING
          ===================================================== */}

          <Route
            path="/onboarding/buyer"
            element={
              <ProtectedRoute allowedRole="buyer">
                <BuyerOnboarding />
              </ProtectedRoute>
            }
          />

          {/* =====================================================
              SUPPLIER ONBOARDING
          ===================================================== */}

          {/* Main supplier onboarding route */}
          <Route
            path="/onboarding/supplier"
            element={
              <ProtectedRoute allowedRole="supplier">
                <SupplierOnboarding />
              </ProtectedRoute>
            }
          />

          {/* Compatibility alias for older links */}
          <Route
            path="/supplier-onboarding"
            element={
              <ProtectedRoute allowedRole="supplier">
                <SupplierOnboarding />
              </ProtectedRoute>
            }
          />

          {/* =====================================================
              BUYER CART / CHECKOUT
          ===================================================== */}

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/order-confirmation"
            element={<OrderConfirmation />}
          />

          {/* =====================================================
              BUYER DASHBOARD
          ===================================================== */}

          <Route
            path="/buyer/dashboard"
            element={
              <ProtectedRoute allowedRole="buyer">
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Buyer Orders */}
          <Route
            path="/buyer/orders"
            element={
              <ProtectedRoute allowedRole="buyer">
                <BuyerOrders />
              </ProtectedRoute>
            }
          />

          {/* =====================================================
              SUPPLIER DASHBOARD
          ===================================================== */}

          <Route
            path="/supplier/dashboard"
            element={
              <ProtectedRoute allowedRole="supplier">
                <SupplierDashboard />
              </ProtectedRoute>
            }
          />

          {/* =====================================================
              SUPPLIER PROFILE
          ===================================================== */}

          <Route
            path="/supplier/profile"
            element={
              <ProtectedRoute allowedRole="supplier">
                <SupplierProfile />
              </ProtectedRoute>
            }
          />

          {/* =====================================================
              SUPPLIER PRODUCTS
          ===================================================== */}

          <Route
            path="/supplier/products/new"
            element={
              <ProtectedRoute allowedRole="supplier">
                <AddProduct />
              </ProtectedRoute>
            }
          />

          {/* =====================================================
              SUPPLIER INVENTORY
          ===================================================== */}

          <Route
            path="/supplier/inventory"
            element={
              <ProtectedRoute allowedRole="supplier">
                <SupplierInventory />
              </ProtectedRoute>
            }
          />

          {/* =====================================================
              SUPPLIER ORDERS
          ===================================================== */}

          <Route
            path="/supplier/orders"
            element={
              <ProtectedRoute allowedRole="supplier">
                <SupplierOrders />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      {/* AI Assistant */}
      <AIAssistant />
    </BrowserRouter>
  );
}

export default App;