import cotton1 from "../assets/fabrics/cotton-1.jpg";
import cotton2 from "../assets/fabrics/cotton-2.jpg";
import cotton3 from "../assets/fabrics/cotton-3.jpg";

import denim1 from "../assets/fabrics/denim-1.jpg";
import denim2 from "../assets/fabrics/denim-2.jpg";

import linen1 from "../assets/fabrics/linen-1.jpg";
import linen2 from "../assets/fabrics/linen-2.jpg";
import linen3 from "../assets/fabrics/linen-3.jpg";

export const getProductImage = (
  name?: string,
  category?: string
): string => {
  const productName = (name || "").toLowerCase().trim();
  const productCategory = (category || "").toLowerCase().trim();

  // ==========================================
  // PRODUCT-SPECIFIC IMAGES
  // ==========================================

  // Cotton
  if (productName.includes("organic cotton")) {
    return cotton1;
  }

  if (productName.includes("cotton twill")) {
    return cotton2;
  }

  // Linen
  if (productName.includes("premium linen")) {
    return linen1;
  }

  // Denim
  if (productName.includes("classic denim")) {
    return denim1;
  }

  // Rayon
  if (productName.includes("premium rayon")) {
    return linen2;
  }

  // Velvet
  if (productName.includes("luxury velvet")) {
    return denim2;
  }

  // Satin
  if (productName.includes("premium satin")) {
    return linen3;
  }

  // ==========================================
  // CATEGORY FALLBACKS
  // ==========================================

  if (productCategory === "cotton") {
    return cotton3;
  }

  if (productCategory === "linen") {
    return linen2;
  }

  if (productCategory === "denim") {
    return denim1;
  }

  if (productCategory === "rayon") {
    return cotton3;
  }

  if (productCategory === "velvet") {
    return denim2;
  }

  if (productCategory === "satin") {
    return linen3;
  }

  if (productCategory === "silk") {
    return linen2;
  }

  if (productCategory === "wool") {
    return cotton2;
  }

  // ==========================================
  // FINAL FALLBACK
  // ==========================================

  return cotton1;
};