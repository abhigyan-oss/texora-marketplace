const express = require("express");

const {
  createSupplier,
  getSuppliers,
  getSupplierByUser,
} = require("../controllers/supplierController");

const router = express.Router();

router.post("/", createSupplier);

router.get("/", getSuppliers);

router.get("/user/:userId", getSupplierByUser);

module.exports = router;