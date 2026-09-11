const { InferenceClient } = require("@huggingface/inference");
const Product = require("../models/Product");

const client = new InferenceClient(process.env.HF_TOKEN);

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Fetch the latest products from MongoDB
    const products = await Product.find({}).lean();

    // Create a compact product catalog for the AI
    const catalog = products.map((product) => ({
      id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      material: product.material,
      color: product.color,
      price: product.price,
      minimumOrder: product.minimumOrder,
      stock: product.stock,
      supplier: product.supplier,
    }));

    const systemPrompt = `
You are Texora AI, a helpful AI assistant for a B2B textile marketplace.

Your job is to help buyers find, compare, and understand textile fabrics.

IMPORTANT RESPONSE RULES:
- Give ONLY the final answer.
- Never show your reasoning.
- Never say "let me think", "I need to analyze", "thinking", or similar phrases.
- Keep responses concise and practical.
- Prefer 2-5 short sentences.
- Use the product catalog when recommending products.
- Never invent products or product information.
- Never invent prices, materials, colors, suppliers, stock, or specifications.
- Only mention information that exists in the product catalog.
- If the user asks for recommendations, recommend relevant products from the catalog.
- If multiple products are suitable, mention the best 2-3 options.
- If the user asks for stock or availability, mention the stock.
- Otherwise, do not unnecessarily mention stock.
- If the user asks for price, mention the price.
- All product prices are in Indian Rupees (₹).
- NEVER use $, USD, dollars, EUR, euros, or any other currency symbol/name.
- If the user asks about summer clothing, prioritize lightweight and breathable fabrics.
- If the user asks about shirts, recommend fabrics suitable for shirts.
- If the user asks for a comparison, clearly explain the main difference between the products.
- If no suitable product exists, clearly tell the user that no matching product was found.

PRODUCT CATALOG:
${JSON.stringify(catalog, null, 2)}
`;

    const response = await client.chatCompletion({
      model: "Qwen/Qwen3-4B-Instruct-2507",

      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message.trim(),
        },
      ],

      provider: "auto",

      max_tokens: 250,
      temperature: 0.7,
      top_p: 0.8,
    });

    let reply =
      response?.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response right now.";

    // Remove accidental thinking blocks if the provider/model returns them.
    reply = reply
      .replace(/<think>[\s\S]*?<\/think>/gi, "")
      .replace(/<thinking>[\s\S]*?<\/thinking>/gi, "")
      .replace(/^thinking:\s*/i, "")
      .replace(/^analysis:\s*/i, "")
      .trim();

    return res.json({
      success: true,
      reply,
      products,
    });
  } catch (error) {
    console.error("AI ERROR:", error);

    if (error?.message) {
      console.error("AI ERROR MESSAGE:", error.message);
    }

    return res.status(500).json({
      success: false,
      message: "AI service temporarily unavailable",
    });
  }
};

module.exports = {
  chatWithAI,
};