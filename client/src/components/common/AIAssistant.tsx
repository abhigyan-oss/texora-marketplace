import { useEffect, useMemo, useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  X,
  MessageCircle,
  MapPin,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";

type Product = {
  _id: string;
  name: string;
  description: string;
  category: string;
  material: string;
  color: string;
  price: number;
  minimumOrder: number;
  stock: number;
  images: string[];
  supplier?: {
    name?: string;
    city?: string;
    state?: string;
  };
};

type ChatMessage = {
  id: number;
  sender: "user" | "ai";
  text: string;
  products?: Product[];
};

const API_URL = "http://localhost:5000/api/products";

const suggestions = [
  "Find breathable cotton under ₹300",
  "Compare linen and cotton",
  "Best fabric for summer shirts",
  "Find denim",
];

function AIAssistant() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "ai",
      text: "Hi! 👋 I'm Texora AI. I can help you find fabrics, compare materials, check prices, and recommend products.",
    },
  ]);

  /*
   * ============================================================
   * OPEN AI FROM HOMEPAGE
   * ============================================================
   */

  useEffect(() => {
    const openAssistant = () => {
      setIsOpen(true);
    };

    window.addEventListener(
      "open-texora-ai",
      openAssistant
    );

    return () => {
      window.removeEventListener(
        "open-texora-ai",
        openAssistant
      );
    };
  }, []);

  /*
   * ============================================================
   * FETCH PRODUCTS
   * ============================================================
   */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setProducts(data.products || []);
      } catch (error) {
        console.error(
          "AI product fetch error:",
          error
        );
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  /*
   * ============================================================
   * HELPERS
   * ============================================================
   */

  const normalizeText = (text: string) => {
    return text.toLowerCase().trim();
  };

  const getImage = (product: Product) => {
    if (
      product.images &&
      product.images.length > 0
    ) {
      return product.images[0];
    }

    return "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800";
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  /*
   * ============================================================
   * PRICE PARSER
   * ============================================================
   */

  const extractMaxPrice = (
    query: string
  ): number | null => {
    const patterns = [
      /under\s*₹?\s*(\d+)/i,
      /below\s*₹?\s*(\d+)/i,
      /less\s+than\s*₹?\s*(\d+)/i,
      /upto\s*₹?\s*(\d+)/i,
      /up\s+to\s*₹?\s*(\d+)/i,
      /within\s*₹?\s*(\d+)/i,
      /₹\s*(\d+)/i,
    ];

    for (const pattern of patterns) {
      const match = query.match(pattern);

      if (match) {
        return Number(match[1]);
      }
    }

    return null;
  };

  /*
   * ============================================================
   * MOQ PARSER
   * ============================================================
   */

  const extractMaxMOQ = (
    query: string
  ): number | null => {
    const patterns = [
      /moq\s*(?:under|below|less\s+than|upto|up\s+to)?\s*(\d+)/i,
      /minimum\s+order\s*(?:under|below|less\s+than|upto|up\s+to)?\s*(\d+)/i,
    ];

    for (const pattern of patterns) {
      const match = query.match(pattern);

      if (match) {
        return Number(match[1]);
      }
    }

    return null;
  };

  /*
   * ============================================================
   * MATERIAL DETECTION
   * ============================================================
   */

  const materials = [
    "cotton",
    "linen",
    "denim",
    "rayon",
    "velvet",
    "satin",
    "silk",
    "polyester",
    "wool",
    "twill",
  ];

  const detectMaterials = (
    query: string
  ) => {
    return materials.filter((material) =>
      query.includes(material)
    );
  };

  /*
   * ============================================================
   * COMPARE PRODUCTS
   * ============================================================
   */

  const getComparisonProducts = (
    query: string
  ) => {
    const detectedMaterials =
      detectMaterials(query);

    if (detectedMaterials.length < 2) {
      return [];
    }

    return detectedMaterials
      .map((material) => {
        return products.find(
          (product) =>
            product.material
              .toLowerCase()
              .includes(material) ||
            product.name
              .toLowerCase()
              .includes(material) ||
            product.category
              .toLowerCase()
              .includes(material)
        );
      })
      .filter(Boolean) as Product[];
  };

  /*
   * ============================================================
   * PRODUCT SEARCH
   * ============================================================
   */

  const searchProducts = (
    query: string
  ) => {
    const normalizedQuery =
      normalizeText(query);

    const maxPrice =
      extractMaxPrice(normalizedQuery);

    const maxMOQ =
      extractMaxMOQ(normalizedQuery);

    const detectedMaterials =
      detectMaterials(normalizedQuery);

    let results = [...products];

    /*
     * Material filtering
     */

    if (detectedMaterials.length > 0) {
      results = results.filter(
        (product) => {
          const productText = `
            ${product.name}
            ${product.description}
            ${product.category}
            ${product.material}
          `.toLowerCase();

          return detectedMaterials.some(
            (material) =>
              productText.includes(material)
          );
        }
      );
    }

    /*
     * Price filtering
     */

    if (maxPrice !== null) {
      results = results.filter(
        (product) =>
          product.price <= maxPrice
      );
    }

    /*
     * MOQ filtering
     */

    if (maxMOQ !== null) {
      results = results.filter(
        (product) =>
          product.minimumOrder <= maxMOQ
      );
    }

    /*
     * Generic text search
     */

    const ignoredWords = [
      "find",
      "show",
      "me",
      "products",
      "product",
      "fabric",
      "fabrics",
      "under",
      "below",
      "less",
      "than",
      "upto",
      "up",
      "to",
      "best",
      "for",
      "the",
      "with",
      "price",
      "moq",
      "minimum",
      "order",
      "₹",
    ];

    const searchWords =
      normalizedQuery
        .replace(/[₹,]/g, " ")
        .split(/\s+/)
        .filter(
          (word) =>
            word.length > 2 &&
            !ignoredWords.includes(word) &&
            !/^\d+$/.test(word)
        );

    if (
      searchWords.length > 0 &&
      detectedMaterials.length === 0
    ) {
      const textResults =
        results.filter(
          (product) => {
            const productText = `
              ${product.name}
              ${product.description}
              ${product.category}
              ${product.material}
              ${product.color}
            `.toLowerCase();

            return searchWords.some(
              (word) =>
                productText.includes(word)
            );
          }
        );

      if (textResults.length > 0) {
        results = textResults;
      }
    }

    return results.slice(0, 5);
  };

  /*
   * ============================================================
   * AI RESPONSE
   * ============================================================
   */

  const generateResponse = (
    query: string
  ) => {
    const normalizedQuery =
      normalizeText(query);

    /*
     * Compare
     */

    if (
      normalizedQuery.includes("compare") ||
      normalizedQuery.includes("difference") ||
      normalizedQuery.includes("vs")
    ) {
      const comparisonProducts =
        getComparisonProducts(
          normalizedQuery
        );

      if (
        comparisonProducts.length >= 2
      ) {
        const names =
          comparisonProducts
            .map(
              (product) =>
                product.name
            )
            .join(" and ");

        return {
          text: `Here is a comparison of ${names}. I found these products from our marketplace.`,
          products:
            comparisonProducts,
        };
      }

      return {
        text: "Sure! Tell me the two fabrics you'd like to compare, for example: Compare linen and cotton.",
        products: [],
      };
    }

    /*
     * Summer / hot weather
     */

    if (
      normalizedQuery.includes(
        "summer"
      ) ||
      normalizedQuery.includes(
        "hot weather"
      ) ||
      normalizedQuery.includes("hot") ||
      normalizedQuery.includes(
        "breathable"
      )
    ) {
      const summerMaterials = [
        "cotton",
        "linen",
        "rayon",
      ];

      const summerProducts =
        products.filter(
          (product) => {
            const text = `
              ${product.name}
              ${product.description}
              ${product.material}
              ${product.category}
            `.toLowerCase();

            return summerMaterials.some(
              (material) =>
                text.includes(material)
            );
          }
        );

      if (
        summerProducts.length > 0
      ) {
        return {
          text: "For summer clothing, I'd recommend breathable and lightweight fabrics such as cotton, linen, and rayon.",
          products:
            summerProducts.slice(0, 5),
        };
      }

      return {
        text: "For summer clothing, cotton and linen are generally great choices because they are breathable and lightweight.",
        products: [],
      };
    }

    /*
     * General product search
     */

    const searchResults =
      searchProducts(
        normalizedQuery
      );

    if (searchResults.length > 0) {
      return {
        text: `I found ${searchResults.length} product${
          searchResults.length > 1
            ? "s"
            : ""
        } that match your request.`,
        products: searchResults,
      };
    }

    /*
     * No results
     */

    if (loadingProducts) {
      return {
        text: "I'm still loading the marketplace products. Please try again in a moment.",
        products: [],
      };
    }

    return {
      text: "I couldn't find an exact match. Try something like “Find cotton under ₹300”, “Show linen”, or “Find denim”.",
      products: [],
    };
  };

  /*
   * ============================================================
   * SEND MESSAGE
   * ============================================================
   */

  const handleSend = (
    customText?: string
  ) => {
    const messageText =
      customText ?? input;

    if (!messageText.trim()) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text: messageText,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setInput("");

    setTimeout(() => {
      const response =
        generateResponse(
          messageText
        );

      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: response.text,
        products:
          response.products,
      };

      setMessages((previous) => [
        ...previous,
        aiMessage,
      ]);
    }, 400);
  };

  /*
   * ============================================================
   * ENTER KEY
   * ============================================================
   */

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  /*
   * ============================================================
   * PRODUCT CARD
   * ============================================================
   */

  const ProductCard = ({
    product,
  }: {
    product: Product;
  }) => {
    return (
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="flex gap-3 p-3">

          <img
            src={getImage(product)}
            alt={product.name}
            className="h-20 w-20 flex-shrink-0 rounded-xl object-cover"
          />

          <div className="min-w-0 flex-1">

            <h4 className="truncate text-sm font-semibold text-slate-900">
              {product.name}
            </h4>

            <p className="mt-1 text-xs text-slate-500">
              {product.material} •{" "}
              {product.color}
            </p>

            <div className="mt-2 flex items-center gap-2">

              <span className="text-sm font-bold text-slate-900">
                {formatPrice(
                  product.price
                )}
              </span>

              <span className="text-xs text-slate-500">
                MOQ{" "}
                {product.minimumOrder}
              </span>

            </div>
          </div>
        </div>

        {product.supplier && (
          <div className="flex items-center gap-1 border-t border-slate-100 px-3 py-2 text-xs text-slate-500">

            <MapPin size={12} />

            <span>
              {product.supplier.city ||
                "India"}

              {product.supplier.state
                ? `, ${product.supplier.state}`
                : ""}
            </span>

          </div>
        )}

        <div className="border-t border-slate-100 p-3">

          <button
            type="button"
            onClick={() =>
              navigate(
                `/products/${product._id}`
              )
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            View Product

            <ArrowRight size={15} />
          </button>

        </div>
      </motion.div>
    );
  };

  /*
   * ============================================================
   * MESSAGE COUNT
   * ============================================================
   */

  const messageCount = useMemo(
    () => messages.length,
    [messages]
  );

  /*
   * ============================================================
   * UI
   * ============================================================
   */

  return (
    <>
      {/* Floating Button */}

      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
            }}
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
            onClick={() =>
              setIsOpen(true)
            }
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl"
            aria-label="Open AI Assistant"
          >
            <MessageCircle
              size={24}
            />

            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">
              AI
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Assistant Panel */}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 30,
              scale: 0.95,
            }}
            transition={{
              duration: 0.2,
            }}
            className="fixed bottom-5 right-5 z-50 flex h-[650px] w-[390px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
          >

            {/* Header */}

            <div className="flex items-center justify-between bg-slate-900 px-5 py-4 text-white">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Bot size={21} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold">
                    Texora AI
                  </h3>

                  <div className="flex items-center gap-1 text-xs text-slate-300">
                    <Sparkles size={11} />
                    Textile Assistant
                  </div>
                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setIsOpen(false)
                }
                className="rounded-lg p-2 transition hover:bg-white/10"
                aria-label="Close AI Assistant"
              >
                <X size={19} />
              </button>

            </div>

            {/* Messages */}

            <div className="flex-1 overflow-y-auto bg-slate-50 p-4">

              {messages.map(
                (message) => (
                  <div
                    key={message.id}
                    className={`mb-4 flex ${
                      message.sender ===
                      "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div
                      className={`max-w-[88%] ${
                        message.sender ===
                        "user"
                          ? "rounded-2xl rounded-br-md bg-slate-900 text-white"
                          : "rounded-2xl rounded-bl-md border border-slate-200 bg-white text-slate-800"
                      } px-4 py-3`}
                    >

                      <p className="text-sm leading-6">
                        {message.text}
                      </p>

                      {message.products &&
                        message.products.length >
                          0 && (
                          <div>
                            {message.products.map(
                              (
                                product
                              ) => (
                                <ProductCard
                                  key={
                                    product._id
                                  }
                                  product={
                                    product
                                  }
                                />
                              )
                            )}
                          </div>
                        )}

                    </div>
                  </div>
                )
              )}

              {loadingProducts && (
                <div className="flex items-center gap-2 text-xs text-slate-500">

                  <Loader2
                    size={14}
                    className="animate-spin"
                  />

                  Loading marketplace
                  products...

                </div>
              )}

            </div>

            {/* Suggestions */}

            {messageCount <= 2 && (
              <div className="border-t border-slate-100 bg-white px-4 py-3">

                <p className="mb-2 text-xs font-medium text-slate-500">
                  Try asking:
                </p>

                <div className="flex gap-2 overflow-x-auto pb-1">

                  {suggestions.map(
                    (suggestion) => (
                      <button
                        key={
                          suggestion
                        }
                        type="button"
                        onClick={() =>
                          handleSend(
                            suggestion
                          )
                        }
                        className="whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                      >
                        {suggestion}
                      </button>
                    )
                  )}

                </div>
              </div>
            )}

            {/* Input */}

            <div className="border-t border-slate-200 bg-white p-3">

              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">

                <input
                  type="text"
                  value={input}
                  onChange={(event) =>
                    setInput(
                      event.target.value
                    )
                  }
                  onKeyDown={
                    handleKeyDown
                  }
                  placeholder="Ask about fabrics..."
                  className="min-w-0 flex-1 bg-transparent px-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />

                <button
                  type="button"
                  onClick={() =>
                    handleSend()
                  }
                  disabled={!input.trim()}
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send message"
                >
                  <Send size={17} />
                </button>

              </div>

              <p className="mt-2 text-center text-[10px] text-slate-400">
                AI recommendations are based on Texora marketplace products.
              </p>

            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AIAssistant;