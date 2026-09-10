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

  // =========================
  // COTTON
  // =========================

  if (productName.includes("organic cotton")) {
    return cotton1;
  }

  if (productName.includes("twill")) {
    return cotton2;
  }

  if (productCategory === "cotton") {
    return cotton3;
  }

  // =========================
  // DENIM
  // =========================

  if (productCategory === "denim") {
    return denim1;
  }

  // =========================
  // LINEN
  // =========================

  if (productCategory === "linen") {
    return linen1;
  }

  // =========================
  // OTHER FABRICS
  // =========================

  if (productCategory === "silk") {
    return linen2;
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

  if (productCategory === "wool") {
    return cotton2;
  }

  // Default
  return cotton1;
};
