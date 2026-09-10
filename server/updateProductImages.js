const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Product = require("./models/Product");

dotenv.config();

const imageUpdates = {
  "Premium silk":
    "https://images.unsplash.com/photo-1631737859822-d954fbb08f5f?auto=format&fit=crop&w=1200&q=80",

  "Premium Cotton Fabric":
    "https://images.unsplash.com/photo-1742113041820-ba5b9da08f9a?auto=format&fit=crop&w=1200&q=80",

  "Organic Cotton Fabric":
    "https://images.unsplash.com/photo-1742113041820-ba5b9da08f9a?auto=format&fit=crop&w=1200&q=80",

  "Premium Linen Fabric":
    "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1200&q=80",

  "Classic Denim Fabric":
    "https://images.unsplash.com/photo-1673173045056-0cc3ce669220?auto=format&fit=crop&w=1200&q=80",

  "Premium Rayon Fabric":
    "https://images.unsplash.com/photo-1631737859822-d954fbb08f5f?auto=format&fit=crop&w=1200&q=80",

  "Luxury Velvet Fabric":
    "https://images.unsplash.com/photo-1631737859822-d954fbb08f5f?auto=format&fit=crop&w=1200&q=80",

  "Cotton Twill Fabric":
    "https://images.unsplash.com/photo-1742113041820-ba5b9da08f9a?auto=format&fit=crop&w=1200&q=80",

  "Premium Satin Fabric":
    "https://images.unsplash.com/photo-1631737859822-d954fbb08f5f?auto=format&fit=crop&w=1200&q=80",
};

const updateImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");

    let updated = 0;

    for (const [productName, imageUrl] of Object.entries(imageUpdates)) {
      const result = await Product.updateMany(
        { name: productName },
        {
          $set: {
            images: [imageUrl],
          },
        }
      );

      if (result.matchedCount > 0) {
        console.log(
          `✅ Updated image: ${productName} (${result.modifiedCount} product(s))`
        );

        updated += result.modifiedCount;
      } else {
        console.log(`⚠️ Product not found: ${productName}`);
      }
    }

    console.log("\n==============================");
    console.log("🎉 Image update completed");
    console.log("==============================");
    console.log(`✅ Products updated: ${updated}`);
    console.log("==============================\n");

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("❌ Image update error:", error);

    await mongoose.connection.close();

    process.exit(1);
  }
};

updateImages();