const mongoose = require("mongoose");
const Product = require("../models/Product");

// ================= GET ALL PRODUCTS =================

const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("supplier", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};


// ================= GET SINGLE PRODUCT =================

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id)
      .populate("supplier", "name email");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);

    res.status(500).json({
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};


// ================= GET LOGGED-IN SUPPLIER PRODUCTS =================

const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({
      supplier: req.user.id,
    })
      .populate("supplier", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get supplier products error:", error);

    res.status(500).json({
      message: "Failed to fetch supplier products",
      error: error.message,
    });
  }
};


// ================= CREATE PRODUCT =================

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      material,
      color,
      price,
      minimumOrder,
      stock,
      images,
    } = req.body;

    if (
      !name ||
      !description ||
      !category ||
      !material ||
      !color ||
      price === undefined ||
      price === null
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const product = await Product.create({
      name,
      description,
      category,
      material,
      color,
      price,
      minimumOrder: minimumOrder || 1,
      stock: stock || 0,
      images: images || [],
      supplier: req.user.id,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};


// ================= UPDATE PRODUCT =================

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const {
      name,
      description,
      category,
      material,
      color,
      price,
      minimumOrder,
      stock,
      images,
    } = req.body;

    // Only allow supplier to update their own product
    const product = await Product.findOneAndUpdate(
      {
        _id: id,
        supplier: req.user.id,
      },
      {
        name,
        description,
        category,
        material,
        color,
        price,
        minimumOrder,
        stock,
        images,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("supplier", "name email");

    if (!product) {
      return res.status(404).json({
        message: "Product not found or unauthorized",
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};


// ================= DELETE PRODUCT =================

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    // Only allow supplier to delete their own product
    const product = await Product.findOneAndDelete({
      _id: id,
      supplier: req.user.id,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found or unauthorized",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};


// ================= UPDATE PRODUCT STOCK =================

const updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    if (stock === undefined || stock === null) {
      return res.status(400).json({
        message: "Stock value is required",
      });
    }

    if (Number(stock) < 0) {
      return res.status(400).json({
        message: "Stock cannot be negative",
      });
    }

    // Only allow supplier to update their own product
    const product = await Product.findOneAndUpdate(
      {
        _id: id,
        supplier: req.user.id,
      },
      {
        stock: Number(stock),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found or unauthorized",
      });
    }

    res.status(200).json({
      message: "Product stock updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update stock error:", error);

    res.status(500).json({
      message: "Failed to update stock",
      error: error.message,
    });
  }
};


// ================= EXPORT CONTROLLERS =================

module.exports = {
  getProducts,
  getProductById,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
};