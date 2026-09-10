const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Product = require("./models/Product");
const User = require("./models/User");

dotenv.config();

const products = [
  {
    name: "Organic Cotton Fabric",
    description:
      "Soft and breathable organic cotton fabric suitable for shirts, dresses and sustainable apparel.",
    category: "Cotton",
    material: "100% Organic Cotton",
    color: "Natural White",
    price: 280,
    minimumOrder: 20,
    stock: 850,
    images: [
      "https://images.unsplash.com/photo-1742113041820-ba5b9da08f9a?auto=format&fit=crop&w=1200&q=80",
    ],
  },

  {
    name: "Premium Linen Fabric",
    description:
      "Lightweight premium linen fabric with a natural texture, ideal for summer clothing and premium fashion.",
    category: "Linen",
    material: "100% Linen",
    color: "Natural Beige",
    price: 450,
    minimumOrder: 10,
    stock: 420,
    images: [
      "https://images.unsplash.com/photo-1742113041820-ba5b9da08f9a?auto=format&fit=crop&w=1200&q=80",
    ],
  },

  {
    name: "Classic Denim Fabric",
    description:
      "Durable blue denim fabric designed for jeans, jackets, workwear and casual apparel.",
    category: "Denim",
    material: "100% Cotton Denim",
    color: "Indigo Blue",
    price: 380,
    minimumOrder: 15,
    stock: 650,
    images: [
      "https://images.unsplash.com/photo-1673173045056-0cc3ce669220?auto=format&fit=crop&w=1200&q=80",
    ],
  },

  {
    name: "Premium Rayon Fabric",
    description:
      "Smooth and lightweight rayon fabric offering excellent drape and comfort for fashion garments.",
    category: "Rayon",
    material: "Viscose Rayon",
    color: "Sky Blue",
    price: 220,
    minimumOrder: 10,
    stock: 900,
    images: [
      "https://images.unsplash.com/photo-1631737859822-d954fbb08f5f?auto=format&fit=crop&w=1200&q=80",
    ],
  },

  {
    name: "Luxury Velvet Fabric",
    description:
      "Soft premium velvet with a rich finish, perfect for luxury clothing, interiors and occasion wear.",
    category: "Velvet",
    material: "Premium Velvet",
    color: "Deep Burgundy",
    price: 520,
    minimumOrder: 5,
    stock: 280,
    images: [
      "https://images.unsplash.com/photo-1631737859822-d954fbb08f5f?auto=format&fit=crop&w=1200&q=80",
    ],
  },

  {
    name: "Cotton Twill Fabric",
    description:
      "Strong and versatile cotton twill fabric suitable for uniforms, trousers, jackets and workwear.",
    category: "Cotton",
    material: "Cotton Twill",
    color: "Olive Green",
    price: 340,
    minimumOrder: 20,
    stock: 550,
    images: [
      "https://images.unsplash.com/photo-1742113041820-ba5b9da08f9a?auto=format&fit=crop&w=1200&q=80",
    ],
  },

  {
    name: "Premium Satin Fabric",
    description:
      "Smooth satin fabric with a soft sheen, ideal for dresses, luxury garments and decorative applications.",
    category: "Satin",
    material: "Polyester Satin",
    color: "Champagne",
    price: 320,
    minimumOrder: 5,
    stock: 360,
    images: [
      "https://images.unsplash.com/photo-1631737859822-d954fbb08f5f?auto=format&fit=crop&w=1200&q=80",
    ],
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");

    const supplier = await User.findOne({ role: "supplier" });

    if (!supplier) {
      console.log("❌ No supplier account found.");
      process.exit(1);
    }

    console.log(`✅ Using supplier: ${supplier.name}`);

    let added = 0;
    let skipped = 0;

    for (const productData of products) {
      const existingProduct = await Product.findOne({
        name: productData.name,
        supplier: supplier._id,
      });

      if (existingProduct) {
        console.log(`⏭️ Skipped: ${productData.name}`);
        skipped++;
        continue;
      }

      await Product.create({
        ...productData,
        supplier: supplier._id,
      });

      console.log(`✅ Added: ${productData.name}`);
      added++;
    }

    console.log("\n==============================");
    console.log("🎉 Product seeding completed");
    console.log("==============================");
    console.log(`✅ Added: ${added}`);
    console.log(`⏭️ Skipped: ${skipped}`);
    console.log("==============================\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedProducts();