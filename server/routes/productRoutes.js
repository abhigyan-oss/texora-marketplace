const express = require("express");

const {
  getProducts,
  getProductById,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================

// GET all products
router.get("/", getProducts);

// GET logged-in supplier's products
// IMPORTANT: Must come before "/:id"
router.get(
  "/my-products",
  authMiddleware,
  roleMiddleware("supplier"),
  getMyProducts
);

// ==========================================
// SUPPLIER PROTECTED ROUTES
// ==========================================

// CREATE product
router.post(
  "/",
  authMiddleware,
  roleMiddleware("supplier"),
  createProduct
);

// UPDATE product
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("supplier"),
  updateProduct
);

// DELETE product
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("supplier"),
  deleteProduct
);

// UPDATE product stock
router.patch(
  "/:id/stock",
  authMiddleware,
  roleMiddleware("supplier"),
  updateProductStock
);

// ==========================================
// PUBLIC SINGLE PRODUCT ROUTE
// IMPORTANT: Keep this LAST
// ==========================================

router.get("/:id", getProductById);

module.exports = router;