const mongoose = require("mongoose");

// ================= ORDER ITEM SCHEMA =================
const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

// ================= ORDER SCHEMA =================
const orderSchema = new mongoose.Schema(
  {
    // Buyer who placed the order
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Ordered products
    items: {
      type: [orderItemSchema],
      required: true,
    },

    // Shipping details
    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },

      company: {
        type: String,
        default: "",
      },

      phone: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
      },

      address: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      pincode: {
        type: String,
        required: true,
      },
    },

    // Total order amount
    total: {
      type: Number,
      required: true,
    },

    // Order status
    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Preparing",
        "Ready for Dispatch",
        "Completed",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);