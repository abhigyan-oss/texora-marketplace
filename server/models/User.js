const mongoose = require("mongoose");

const buyerProfileSchema = new mongoose.Schema(
  {
    businessType: { type: String, default: "" },
    industry: { type: String, default: "" },
    fabricTypes: { type: [String], default: [] },
    orderQuantity: { type: String, default: "" },
    budgetRange: { type: String, default: "" },
  },
  { _id: false }
);

const supplierProfileSchema = new mongoose.Schema(
  {
    businessName: { type: String, default: "" },
    businessType: { type: String, default: "" },
    contactPerson: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    businessHours: { type: String, default: "" },
    productCategories: { type: [String], default: [] },
    fabricTypes: { type: [String], default: [] },
    minimumOrderQuantity: { type: Number, default: 1 },
    additionalInfo: { type: String, default: "" },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["buyer", "supplier"],
      required: true,
    },

    onboardingCompleted: {
      type: Boolean,
      default: false,
    },

    buyerProfile: {
      type: buyerProfileSchema,
      default: undefined,
    },

    supplierProfile: {
      type: supplierProfileSchema,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);