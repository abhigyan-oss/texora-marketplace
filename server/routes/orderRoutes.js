const express = require("express");

const {
  createOrder,
  getBuyerOrders,
  getMySupplierOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// ======================================================
// BUYER ROUTES
// ======================================================

// Create a new order
router.post(
  "/",
  authMiddleware,
  roleMiddleware("buyer"),
  createOrder
);

// Get logged-in buyer's orders
router.get(
  "/buyer/:buyerId",
  authMiddleware,
  roleMiddleware("buyer"),
  getBuyerOrders
);

// ======================================================
// SUPPLIER ROUTES
// ======================================================

// Get orders containing this supplier's products
router.get(
  "/supplier/my-orders",
  authMiddleware,
  roleMiddleware("supplier"),
  getMySupplierOrders
);

// Update order status
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("supplier"),
  updateOrderStatus
);

module.exports = router;