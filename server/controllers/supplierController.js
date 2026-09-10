const Supplier = require("../models/Supplier");

// CREATE SUPPLIER PROFILE
const createSupplier = async (req, res) => {
  try {
    const {
      user,
      businessName,
      businessType,
      email,
      phone,
      address,
      operatingHours,
      categories,
      fabrics,
      moq,
    } = req.body;

    if (
      !user ||
      !businessName ||
      !businessType ||
      !email ||
      !phone ||
      !address ||
      !operatingHours ||
      !moq
    ) {
      return res.status(400).json({
        message: "Please provide all required supplier details",
      });
    }

    const existingSupplier = await Supplier.findOne({
      user,
    });

    if (existingSupplier) {
      return res.status(400).json({
        message: "Supplier profile already exists",
      });
    }

    const supplier = await Supplier.create({
      user,
      businessName,
      businessType,
      email,
      phone,
      address,
      operatingHours,
      categories,
      fabrics,
      moq,
    });

    res.status(201).json({
      message: "Supplier profile created successfully",
      supplier,
    });
  } catch (error) {
    console.error("Create supplier error:", error);

    res.status(500).json({
      message: "Failed to create supplier profile",
      error: error.message,
    });
  }
};


// GET ALL SUPPLIERS
const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: suppliers.length,
      suppliers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch suppliers",
      error: error.message,
    });
  }
};


// GET SINGLE SUPPLIER
const getSupplierByUser = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({
      user: req.params.userId,
    }).populate("user", "name email role");

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier profile not found",
      });
    }

    res.status(200).json({
      supplier,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch supplier profile",
      error: error.message,
    });
  }
};


module.exports = {
  createSupplier,
  getSuppliers,
  getSupplierByUser,
};