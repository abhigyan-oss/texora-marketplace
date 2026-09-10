import cotton1 from "../assets/fabrics/cotton-1.jpg";
import cotton2 from "../assets/fabrics/cotton-2.jpg";
import cotton3 from "../assets/fabrics/cotton-3.jpg";

import linen1 from "../assets/fabrics/linen-1.jpg";
import linen2 from "../assets/fabrics/linen-2.jpg";
import linen3 from "../assets/fabrics/linen-3.jpg";

import denim1 from "../assets/fabrics/denim-1.jpg";
import denim2 from "../assets/fabrics/denim-2.jpg";
import denim3 from "../assets/fabrics/denim-3.jpg";

const fabrics = [
  {
    id: 1,
    name: "Organic Cotton Twill",
    category: "Cotton",
    price: 245,
    unit: "/ meter",

    images: [cotton1, cotton2, cotton3],

    supplier: "Shree Textiles",
    location: "Surat, Gujarat",

    gsm: "180 GSM",
    moq: "50 meters",
    stock: "In Stock",
    availableStock: "1,200 meters",

    description:
      "Premium organic cotton twill fabric with excellent breathability and durability. Perfect for shirts, trousers, jackets and everyday apparel.",

    colors: ["Natural", "White", "Beige", "Olive"],

    specifications: {
      composition: "100% Organic Cotton",
      weave: "Twill",
      width: "58 inches",
      weight: "180 GSM",
    },
  },

  {
    id: 2,
    name: "Premium Linen Blend",
    category: "Linen",
    price: 320,
    unit: "/ meter",

    images: [linen1, linen2, linen3],

    supplier: "Linen House India",
    location: "Panipat, Haryana",

    gsm: "220 GSM",
    moq: "100 meters",
    stock: "In Stock",
    availableStock: "850 meters",

    description:
      "High-quality linen blend offering a lightweight and breathable texture. Ideal for premium summer clothing and fashion collections.",

    colors: ["Cream", "Sand", "Sky Blue", "Grey"],

    specifications: {
      composition: "70% Linen, 30% Cotton",
      weave: "Plain Weave",
      width: "56 inches",
      weight: "220 GSM",
    },
  },

  {
    id: 3,
    name: "Stretch Denim Fabric",
    category: "Denim",
    price: 410,
    unit: "/ meter",

    images: [denim1, denim2, denim3],

    supplier: "Denim Works",
    location: "Ahmedabad, Gujarat",

    gsm: "320 GSM",
    moq: "75 meters",
    stock: "Limited Stock",
    availableStock: "320 meters",

    description:
      "Durable stretch denim fabric designed for jeans, jackets and modern casual wear with excellent flexibility and comfort.",

    colors: ["Indigo", "Dark Blue", "Black"],

    specifications: {
      composition: "98% Cotton, 2% Elastane",
      weave: "Denim Twill",
      width: "60 inches",
      weight: "320 GSM",
    },
  },
];

export default fabrics;