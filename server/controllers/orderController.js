const Order = require("../models/Order");
const Product = require("../models/Product");

// ======================================================
// CREATE ORDER
// ======================================================

const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    // Buyer comes from JWT
    const buyer = req.user.id;

    // --------------------------------------------------
    // Validate order items
    // --------------------------------------------------

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one product",
      });
    }

    // --------------------------------------------------
    // Validate shipping address
    // --------------------------------------------------

    const requiredFields = [
      "fullName",
      "phone",
      "email",
      "address",
      "city",
      "state",
      "pincode",
    ];

    for (const field of requiredFields) {
      if (
        !shippingAddress?.[field] ||
        !String(shippingAddress[field]).trim()
      ) {
        return res.status(400).json({
          message: `${field} is required`,
        });
      }
    }

    // --------------------------------------------------
    // Validate email
    // --------------------------------------------------

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(shippingAddress.email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    // --------------------------------------------------
    // Validate Indian phone number
    // --------------------------------------------------

    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(shippingAddress.phone)) {
      return res.status(400).json({
        message: "Please enter a valid 10-digit phone number",
      });
    }

    // --------------------------------------------------
    // Validate pincode
    // --------------------------------------------------

    const pincodeRegex = /^\d{6}$/;

    if (!pincodeRegex.test(shippingAddress.pincode)) {
      return res.status(400).json({
        message: "Please enter a valid 6-digit pincode",
      });
    }

    // --------------------------------------------------
    // Validate products
    // Calculate total on SERVER
    // --------------------------------------------------

    const validatedItems = [];
    let calculatedTotal = 0;

    for (const item of items) {
      if (!item.product || !item.quantity) {
        return res.status(400).json({
          message: "Invalid order item",
        });
      }

      // Get actual product from database
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.product}`,
        });
      }

      const quantity = Number(item.quantity);

      // Quantity validation
      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({
          message: `Invalid quantity for ${product.name}`,
        });
      }

      // Minimum order quantity
      if (
        product.minimumOrder &&
        quantity < product.minimumOrder
      ) {
        return res.status(400).json({
          message: `${product.name} requires a minimum order of ${product.minimumOrder}`,
        });
      }

      // Stock validation
      if (quantity > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} units of ${product.name} are available`,
        });
      }

      // Calculate item total using DATABASE price
      const itemTotal = product.price * quantity;

      calculatedTotal += itemTotal;

      // Store only trusted product information
      validatedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image:
          product.images && product.images.length > 0
            ? product.images[0]
            : "",
      });
    }

    // --------------------------------------------------
    // Create order
    // --------------------------------------------------

    const order = await Order.create({
      buyer,
      items: validatedItems,
      shippingAddress,
      total: calculatedTotal,
      status: "Pending",
    });

    // --------------------------------------------------
    // Reduce product stock
    // --------------------------------------------------

    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock: -item.quantity,
          },
        }
      );
    }

    // --------------------------------------------------
    // Populate order response
    // --------------------------------------------------

    const populatedOrder = await Order.findById(order._id)
      .populate("buyer", "name email role")
      .populate(
        "items.product",
        "name images supplier"
      );

    return res.status(201).json({
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// ======================================================
// GET BUYER ORDERS
// ======================================================

const getBuyerOrders = async (req, res) => {
  try {
    // Make sure buyer can only access their own orders
    if (
      String(req.user.id) !==
      String(req.params.buyerId)
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to view these orders",
      });
    }

    const orders = await Order.find({
      buyer: req.user.id,
    })
      .populate("buyer", "name email role")
      .populate(
        "items.product",
        "name images supplier"
      )
      .sort({
        createdAt: -1,
      });

    return res.json({
      orders,
    });
  } catch (error) {
    console.error("Get buyer orders error:", error);

    return res.status(500).json({
      message: "Failed to fetch buyer orders",
    });
  }
};

// ======================================================
// GET SUPPLIER ORDERS
// ======================================================

const getMySupplierOrders = async (req, res) => {
  try {
    // Supplier comes from JWT
    const supplierId = req.user.id;

    // Get orders and populate product supplier
    const orders = await Order.find()
      .populate("buyer", "name email role")
      .populate(
        "items.product",
        "name images supplier"
      )
      .sort({
        createdAt: -1,
      });

    const supplierOrders = [];

    // Filter only products belonging to this supplier
    for (const order of orders) {
      const supplierItems = order.items.filter(
        (item) =>
          item.product &&
          String(item.product.supplier) ===
            String(supplierId)
      );

      if (supplierItems.length > 0) {
        supplierOrders.push({
          ...order.toObject(),

          // Only expose this supplier's items
          items: supplierItems,

          // Calculate supplier-specific total
          total: supplierItems.reduce(
            (sum, item) =>
              sum +
              item.price * item.quantity,
            0
          ),
        });
      }
    }

    return res.json({
      orders: supplierOrders,
    });
  } catch (error) {
    console.error(
      "Get supplier orders error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch supplier orders",
    });
  }
};

// ======================================================
// UPDATE ORDER STATUS
// ======================================================

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Allowed supplier workflow
    const allowedStatuses = [
      "Pending",
      "Accepted",
      "Preparing",
      "Ready for Dispatch",
      "Completed",
    ];

    // Validate status
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    // Find order
    const order = await Order.findById(
      req.params.id
    ).populate(
      "items.product",
      "supplier"
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // --------------------------------------------------
    // Security:
    // Supplier can update only orders containing
    // their own products
    // --------------------------------------------------

    const ownsProduct = order.items.some(
      (item) =>
        item.product &&
        String(item.product.supplier) ===
          String(req.user.id)
    );

    if (!ownsProduct) {
      return res.status(403).json({
        message:
          "You are not authorized to update this order",
      });
    }

    // Update status
    order.status = status;

    await order.save();

    // Get updated populated order
    const updatedOrder =
      await Order.findById(order._id)
        .populate(
          "buyer",
          "name email role"
        )
        .populate(
          "items.product",
          "name images supplier"
        );

    return res.json({
      message:
        "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(
      "Update order status error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update order status",
    });
  }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  createOrder,
  getBuyerOrders,
  getMySupplierOrders,
  updateOrderStatus,
};