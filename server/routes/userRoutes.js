const express = require("express");

const {
  saveBuyerProfile,
  saveSupplierProfile,
  becomeSupplier,
  getMyProfile,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// ===============================
// GET CURRENT USER PROFILE
// ===============================
router.get(
  "/me",
  authMiddleware,
  getMyProfile
);

// ===============================
// BUYER ONBOARDING
// ===============================
router.put(
  "/buyer-profile",
  authMiddleware,
  roleMiddleware("buyer"),
  saveBuyerProfile
);

// ===============================
// EXISTING SUPPLIER PROFILE
// ===============================
router.put(
  "/supplier-profile",
  authMiddleware,
  roleMiddleware("supplier"),
  saveSupplierProfile
);

// ===============================
// BUYER -> SUPPLIER CONVERSION
// ===============================
router.put(
  "/become-supplier",
  authMiddleware,
  becomeSupplier
);

module.exports = router;