const User = require("../models/User");

// ===============================
// SAVE BUYER PROFILE
// ===============================
const saveBuyerProfile = async (req, res) => {
  try {
    const {
      businessType,
      industry,
      fabricTypes,
      orderQuantity,
      budgetRange,
    } = req.body;

    if (
      !businessType ||
      !industry ||
      !Array.isArray(fabricTypes) ||
      fabricTypes.length === 0 ||
      !orderQuantity ||
      !budgetRange
    ) {
      return res.status(400).json({
        message: "Please complete all buyer onboarding fields.",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    if (user.role !== "buyer") {
      return res.status(403).json({
        message: "Only buyers can save buyer onboarding.",
      });
    }

    user.buyerProfile = {
      businessType: businessType.trim(),
      industry: industry.trim(),
      fabricTypes,
      orderQuantity,
      budgetRange,
    };

    user.onboardingCompleted = true;

    await user.save();

    return res.status(200).json({
      message: "Buyer onboarding completed successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        onboardingCompleted: user.onboardingCompleted,
        buyerProfile: user.buyerProfile,
      },
    });
  } catch (error) {
    console.error("Save buyer profile error:", error);

    return res.status(500).json({
      message: "Failed to save buyer onboarding.",
    });
  }
};

// ===============================
// SAVE SUPPLIER PROFILE
// ===============================
const saveSupplierProfile = async (req, res) => {
  try {
    const {
      businessName,
      businessType,
      contactPerson,
      phone,
      address,
      city,
      state,
      businessHours,
      productCategories,
      fabricTypes,
      minimumOrderQuantity,
      additionalInfo,
    } = req.body;

    /*
     * Required supplier fields
     *
     * NOTE:
     * city and state are intentionally NOT required
     * because the current supplier onboarding form
     * does not collect them as separate required fields.
     */

    if (
      !businessName ||
      !businessType ||
      !contactPerson ||
      !phone ||
      !address ||
      !businessHours ||
      !Array.isArray(productCategories) ||
      productCategories.length === 0 ||
      !Array.isArray(fabricTypes) ||
      fabricTypes.length === 0 ||
      minimumOrderQuantity === undefined ||
      minimumOrderQuantity === null ||
      Number(minimumOrderQuantity) <= 0
    ) {
      return res.status(400).json({
        message: "Please complete all required supplier onboarding fields.",
      });
    }

    // Find logged-in user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Only existing suppliers can use this endpoint
    if (user.role !== "supplier") {
      return res.status(403).json({
        message: "Only suppliers can save supplier onboarding.",
      });
    }

    // Save supplier profile
    user.supplierProfile = {
      businessName: businessName.trim(),
      businessType: businessType.trim(),
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      address: address.trim(),

      // Optional fields
      city: city ? city.trim() : "",
      state: state ? state.trim() : "",

      businessHours: businessHours.trim(),

      productCategories,
      fabricTypes,

      minimumOrderQuantity: Number(minimumOrderQuantity),

      additionalInfo: additionalInfo
        ? additionalInfo.trim()
        : "",
    };

    // Mark onboarding as completed
    user.onboardingCompleted = true;

    // Save to MongoDB
    await user.save();

    return res.status(200).json({
      message: "Supplier onboarding completed successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        onboardingCompleted: user.onboardingCompleted,
        supplierProfile: user.supplierProfile,
      },
    });
  } catch (error) {
    console.error("Save supplier profile error:", error);

    return res.status(500).json({
      message: "Failed to save supplier onboarding.",
    });
  }
};

// ===============================
// CONVERT BUYER TO SUPPLIER
// ===============================
const becomeSupplier = async (req, res) => {
  try {
    const {
      businessName,
      businessType,
      contactPerson,
      phone,
      address,
      city,
      state,
      businessHours,
      productCategories,
      fabricTypes,
      minimumOrderQuantity,
      additionalInfo,
    } = req.body;

    // Validate required supplier onboarding fields
    if (
      !businessName ||
      !businessType ||
      !contactPerson ||
      !phone ||
      !address ||
      !businessHours ||
      !Array.isArray(productCategories) ||
      productCategories.length === 0 ||
      !Array.isArray(fabricTypes) ||
      fabricTypes.length === 0 ||
      minimumOrderQuantity === undefined ||
      minimumOrderQuantity === null ||
      Number(minimumOrderQuantity) <= 0
    ) {
      return res.status(400).json({
        message: "Please complete all required supplier onboarding fields.",
      });
    }

    // Find logged-in user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Only buyers can become suppliers
    if (user.role !== "buyer") {
      return res.status(403).json({
        message: "Only buyers can become suppliers.",
      });
    }

    // Save supplier profile
    user.supplierProfile = {
      businessName: businessName.trim(),
      businessType: businessType.trim(),
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      address: address.trim(),

      // Optional fields
      city: city ? city.trim() : "",
      state: state ? state.trim() : "",

      businessHours: businessHours.trim(),

      productCategories,
      fabricTypes,

      minimumOrderQuantity: Number(minimumOrderQuantity),

      additionalInfo: additionalInfo
        ? additionalInfo.trim()
        : "",
    };

    // Change buyer role to supplier
    user.role = "supplier";

    // Mark onboarding as completed
    user.onboardingCompleted = true;

    // Save changes
    await user.save();

    return res.status(200).json({
      message: "Supplier onboarding completed successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        onboardingCompleted: user.onboardingCompleted,
        supplierProfile: user.supplierProfile,
      },
    });
  } catch (error) {
    console.error("Become supplier error:", error);

    return res.status(500).json({
      message: "Failed to complete supplier onboarding.",
    });
  }
};

// ===============================
// GET MY PROFILE
// ===============================
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      message: "Failed to fetch profile.",
    });
  }
};

// ===============================
// EXPORT CONTROLLERS
// ===============================
module.exports = {
  saveBuyerProfile,
  saveSupplierProfile,
  becomeSupplier,
  getMyProfile,
};