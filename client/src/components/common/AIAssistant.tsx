import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Bot,
  Loader2,
  MapPin,
  MessageCircle,
  Mic,
  MicOff,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProductImage } from "../../utils/productImages";

interface Product {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  material?: string;
  color?: string;
  price: number;
  minimumOrder?: number;
  stock?: number;
  images?: string[];
  supplier?: {
    businessName?: string;
    location?: string;
  };
}

interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
  products?: Product[];
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;

  start: () => void;
  stop: () => void;

  onresult:
    | ((event: SpeechRecognitionEvent) => void)
    | null;

  onend: (() => void) | null;

  onerror:
    | ((event: SpeechRecognitionErrorEvent) => void)
    | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const PRODUCTS_API_URL =
  "http://localhost:5000/api/products";

const AI_API_URL =
  "http://localhost:5000/api/ai/chat";

const initialMessage: Message = {
  id: 1,
  role: "ai",
  text: "Hi! I'm Texora AI 👋 Tell me what fabric you're looking for, your budget, quantity, or use case.",
};

const suggestionItems = [
  "Find breathable cotton under ₹300",
  "Compare linen and cotton",
  "Best fabric for summer shirts",
];

export default function AIAssistant() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    initialMessage,
  ]);

  const [products, setProducts] = useState<Product[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef =
    useRef<SpeechRecognitionInstance | null>(null);

  const handleSendRef =
    useRef<(text?: string) => void>(() => {});

  /*
   * -------------------------------------------------------
   * OPEN AI FROM HERO BUTTON
   * -------------------------------------------------------
   */

  useEffect(() => {
    const handleOpenAI = () => {
      setIsOpen(true);
    };

    window.addEventListener(
      "open-texora-ai",
      handleOpenAI
    );

    return () => {
      window.removeEventListener(
        "open-texora-ai",
        handleOpenAI
      );
    };
  }, []);

  /*
   * -------------------------------------------------------
   * FETCH PRODUCTS
   * -------------------------------------------------------
   */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          PRODUCTS_API_URL
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch products"
          );
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else if (
          Array.isArray(data.products)
        ) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error(
          "Failed to fetch products:",
          error
        );

        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  /*
   * -------------------------------------------------------
   * LOCAL PRODUCT SEARCH
   * -------------------------------------------------------
   */

  const generateAIResponse = (
    query: string
  ): {
    text: string;
    products: Product[];
  } => {
    const q = query.toLowerCase().trim();

    if (!q) {
      return {
        text: "Tell me what you're looking for and I'll help you find the right fabric.",
        products: [],
      };
    }

    let filteredProducts = [...products];

    /*
     * PRICE FILTER
     */

    const priceMatch = q.match(
      /(?:under|below|less than|upto|up to|maximum|max|within)\s*[₹rs.]?\s*(\d+)/
    );

    if (priceMatch) {
      const maxPrice = Number(
        priceMatch[1]
      );

      filteredProducts =
        filteredProducts.filter(
          (product) =>
            product.price <= maxPrice
        );
    }

    /*
     * MATERIAL FILTER
     */

    const materials = [
      "cotton",
      "linen",
      "denim",
      "rayon",
      "velvet",
      "satin",
      "polyester",
      "silk",
      "wool",
    ];

    const matchedMaterial =
      materials.find((material) =>
        q.includes(material)
      );

    if (matchedMaterial) {
      filteredProducts =
        filteredProducts.filter(
          (product) => {
            const material =
              product.material?.toLowerCase() ||
              "";

            const name =
              product.name?.toLowerCase() ||
              "";

            const category =
              product.category?.toLowerCase() ||
              "";

            return (
              material.includes(
                matchedMaterial
              ) ||
              name.includes(
                matchedMaterial
              ) ||
              category.includes(
                matchedMaterial
              )
            );
          }
        );
    }

    /*
     * USE CASE FILTERS
     */

    if (
      q.includes("shirt") ||
      q.includes("shirts") ||
      q.includes("apparel")
    ) {
      filteredProducts =
        filteredProducts.filter(
          (product) => {
            const text = `
              ${product.name}
              ${product.description}
              ${product.category}
              ${product.material}
            `.toLowerCase();

            return (
              text.includes("apparel") ||
              text.includes("shirt") ||
              text.includes("cotton") ||
              text.includes("linen")
            );
          }
        );
    }

    if (
      q.includes("summer") ||
      q.includes("breathable") ||
      q.includes("hot weather")
    ) {
      const summerProducts =
        filteredProducts.filter(
          (product) => {
            const text = `
              ${product.name}
              ${product.description}
              ${product.category}
              ${product.material}
            `.toLowerCase();

            return (
              text.includes("cotton") ||
              text.includes("linen") ||
              text.includes("rayon") ||
              text.includes("breathable") ||
              text.includes("summer")
            );
          }
        );

      if (summerProducts.length > 0) {
        filteredProducts =
          summerProducts;
      }
    }

    /*
     * CATEGORY FILTERS
     */

    if (
      q.includes("home textile") ||
      q.includes("home textiles")
    ) {
      filteredProducts =
        filteredProducts.filter(
          (product) =>
            product.category
              ?.toLowerCase()
              .includes("home")
        );
    }

    if (
      q.includes("technical textile") ||
      q.includes("technical textiles")
    ) {
      filteredProducts =
        filteredProducts.filter(
          (product) =>
            product.category
              ?.toLowerCase()
              .includes("technical")
        );
    }

    if (
      q.includes("bulk") ||
      q.includes("wholesale")
    ) {
      filteredProducts =
        filteredProducts.filter(
          (product) => {
            const text = `
              ${product.name}
              ${product.description}
              ${product.category}
            `.toLowerCase();

            return (
              text.includes("bulk") ||
              text.includes("wholesale")
            );
          }
        );
    }

    /*
     * COMPARE
     */

    if (
      q.includes("compare") &&
      q.includes("linen") &&
      q.includes("cotton")
    ) {
      const comparisonProducts =
        products.filter(
          (product) => {
            const text = `
              ${product.name}
              ${product.material}
              ${product.description}
            `.toLowerCase();

            return (
              text.includes("linen") ||
              text.includes("cotton")
            );
          }
        );

      return {
        text:
          "For summer clothing, cotton is usually the safer choice for breathability, comfort and easy maintenance. Linen is even more breathable and has a premium natural feel, but it wrinkles more easily. If you're prioritising everyday shirts, I'd lean toward cotton; for premium summer collections, linen is a strong option.",

        products:
          comparisonProducts.slice(0, 4),
      };
    }

    /*
     * SUMMER SHIRTS
     */

    if (
      q.includes("best fabric") &&
      q.includes("summer") &&
      q.includes("shirt")
    ) {
      const summerProducts =
        products.filter(
          (product) => {
            const text = `
              ${product.name}
              ${product.material}
              ${product.description}
            `.toLowerCase();

            return (
              text.includes("cotton") ||
              text.includes("linen") ||
              text.includes("rayon")
            );
          }
        );

      return {
        text:
          "For summer shirts, I'd recommend breathable cotton or linen. Cotton is versatile, comfortable and easy to source, while linen offers excellent airflow and a premium summer feel.",

        products:
          summerProducts.slice(0, 4),
      };
    }

    /*
     * GENERAL PRODUCT SEARCH
     */

    if (
      q.includes("find") ||
      q.includes("show") ||
      q.includes("looking for") ||
      q.includes("need") ||
      q.includes("recommend") ||
      q.includes("best")
    ) {
      const keywords = q
        .split(/\s+/)
        .filter(
          (word) => word.length > 3
        )
        .filter(
          (word) =>
            ![
              "find",
              "show",
              "looking",
              "need",
              "recommend",
              "best",
              "fabric",
              "under",
              "below",
              "with",
              "for",
              "the",
              "from",
            ].includes(word)
        );

      if (keywords.length > 0) {
        const keywordProducts =
          filteredProducts.filter(
            (product) => {
              const text = `
                ${product.name}
                ${product.description}
                ${product.category}
                ${product.material}
              `.toLowerCase();

              return keywords.some(
                (keyword) =>
                  text.includes(keyword)
              );
            }
          );

        if (
          keywordProducts.length > 0
        ) {
          filteredProducts =
            keywordProducts;
        }
      }
    }

    /*
     * NO RESULTS
     */

    if (
      filteredProducts.length === 0
    ) {
      return {
        text:
          "I couldn't find an exact match in the current Texora catalog. Try changing the material, budget, or category and I'll search again.",

        products: [],
      };
    }

    /*
     * RESPONSE
     */

    let responseText =
      "I found some options that match your requirements.";

    if (matchedMaterial) {
      responseText =
        `I found ${matchedMaterial} options that match your requirements.`;
    }

    if (priceMatch) {
      responseText +=
        ` I kept the results within ₹${priceMatch[1]} where possible.`;
    }

    return {
      text: responseText,
      products:
        filteredProducts.slice(0, 4),
    };
  };

  /*
   * -------------------------------------------------------
   * SEND MESSAGE
   * -------------------------------------------------------
   */

  const handleSend = async (
    customText?: string
  ) => {
    const query = (
      customText ?? input
    ).trim();

    if (!query || aiLoading) {
      return;
    }

    setInput("");

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: query,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setAiLoading(true);

    try {
      /*
       * CALL HUGGING FACE THROUGH BACKEND
       */

      const response = await fetch(
        AI_API_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            message: query,
          }),
        }
      );

      const data =
        await response.json();

      /*
       * LOCAL PRODUCT MATCHING
       */

      const localResult =
        generateAIResponse(query);

      if (
        response.ok &&
        data.success
      ) {
        const aiMessage: Message = {
          id: Date.now() + 1,
          role: "ai",

          text:
            data.reply ||
            localResult.text,

          products:
            localResult.products,
        };

        setMessages((previous) => [
          ...previous,
          aiMessage,
        ]);
      } else {
        /*
         * FALLBACK
         */

        const fallbackMessage:
          Message = {
          id: Date.now() + 1,
          role: "ai",

          text:
            localResult.text +
            "\n\nAI service is temporarily unavailable, so I'm using Texora's product search instead.",

          products:
            localResult.products,
        };

        setMessages((previous) => [
          ...previous,
          fallbackMessage,
        ]);
      }
    } catch (error) {
      console.error(
        "AI request failed:",
        error
      );

      /*
       * FALLBACK TO LOCAL SEARCH
       */

      const localResult =
        generateAIResponse(query);

      const fallbackMessage:
        Message = {
        id: Date.now() + 1,
        role: "ai",

        text:
          localResult.text +
          "\n\nI couldn't connect to the AI service right now, but I can still search the Texora catalog.",

        products:
          localResult.products,
      };

      setMessages((previous) => [
        ...previous,
        fallbackMessage,
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  /*
   * -------------------------------------------------------
   * KEEP REF UPDATED
   * -------------------------------------------------------
   */

  useEffect(() => {
    handleSendRef.current = (
      text?: string
    ) => {
      void handleSend(text);
    };
  });

  /*
   * -------------------------------------------------------
   * VOICE INPUT
   * -------------------------------------------------------
   */

  const startVoiceRecognition = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice input is not supported in this browser. Please use Google Chrome."
      );

      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (
      event: SpeechRecognitionEvent
    ) => {
      let transcript = "";

      for (
        let i = 0;
        i < event.results.length;
        i++
      ) {
        transcript +=
          event.results[i][0]
            .transcript;
      }

      setInput(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);

      setInput((currentInput) => {
        const finalText =
          currentInput.trim();

        if (finalText) {
          setTimeout(() => {
            handleSendRef.current(
              finalText
            );
          }, 100);
        }

        return "";
      });
    };

    recognition.onerror = (
      event: SpeechRecognitionErrorEvent
    ) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      setIsListening(false);
    };

    recognitionRef.current =
      recognition;

    try {
      recognition.start();
      setIsListening(true);
    } catch (error) {
      console.error(
        "Could not start speech recognition:",
        error
      );

      setIsListening(false);
    }
  };

  /*
   * -------------------------------------------------------
   * PRODUCT NAVIGATION
   * -------------------------------------------------------
   */

  const handleViewProduct = (
    productId: string
  ) => {
    setIsOpen(false);

    navigate(
      `/products/${productId}`
    );
  };

  /*
   * -------------------------------------------------------
   * SUGGESTION CLICK
   * -------------------------------------------------------
   */

  const handleSuggestionClick = (
    suggestion: string
  ) => {
    void handleSend(suggestion);
  };

  /*
   * -------------------------------------------------------
   * UI
   * -------------------------------------------------------
   */

  return (
    <>
      {/* Floating AI Button */}

      <motion.button
        type="button"
        onClick={() =>
          setIsOpen(true)
        }
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-2xl transition hover:scale-105"
        whileHover={{
          scale: 1.06,
        }}
        whileTap={{
          scale: 0.95,
        }}
        aria-label="Open Texora AI"
        data-cursor="interactive"
      >
        <Sparkles size={23} />

        {!isOpen && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />

            <span className="relative inline-flex h-4 w-4 rounded-full bg-green-500" />
          </span>
        )}
      </motion.button>

      {/* AI Panel */}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 30,
              scale: 0.96,
            }}
            transition={{
              duration: 0.2,
            }}
            className="fixed bottom-6 right-6 z-[60] flex h-[min(700px,calc(100vh-48px))] w-[min(430px,calc(100vw-32px))] flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl"
          >
            {/* Header */}

            <div className="flex items-center justify-between border-b border-black/10 bg-black px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <Bot size={20} />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Texora AI
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-white/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                    AI textile sourcing assistant
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsOpen(false)
                }
                className="rounded-full p-2 transition hover:bg-white/10"
                aria-label="Close AI assistant"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}

            <div className="flex-1 space-y-4 overflow-y-auto bg-neutral-50 p-4">
              {messages.map(
                (message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role ===
                      "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`${
                        message.role ===
                        "user"
                          ? "items-end"
                          : "items-start"
                      } flex max-w-[90%] flex-col`}
                    >
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                          message.role ===
                          "user"
                            ? "rounded-br-md bg-black text-white"
                            : "rounded-bl-md border border-black/5 bg-white text-neutral-800 shadow-sm"
                        }`}
                      >
                        {message.text}
                      </div>

                      {/* Product Cards */}

                      {message.products &&
                        message.products
                          .length >
                          0 && (
                          <div className="mt-3 w-full space-y-3">
                            {message.products.map(
                              (
                                product
                              ) => {
                                const image =
                                  getProductImage(
                                    product.name,
                                    product.category
                                  );

                                return (
                                  <div
                                    key={
                                      product._id
                                    }
                                    className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm"
                                  >
                                    <div className="flex gap-3 p-3">
                                      <img
                                        src={
                                          image
                                        }
                                        alt={
                                          product.name
                                        }
                                        className="h-20 w-20 shrink-0 rounded-xl object-cover"
                                      />

                                      <div className="min-w-0 flex-1">
                                        <h4 className="truncate text-sm font-semibold text-neutral-900">
                                          {
                                            product.name
                                          }
                                        </h4>

                                        <div className="mt-1 flex items-center gap-1 text-xs text-neutral-500">
                                          <MapPin
                                            size={
                                              12
                                            }
                                          />

                                          <span className="truncate">
                                            {
                                              product
                                                .supplier
                                                ?.location ||
                                              "India"
                                            }
                                          </span>
                                        </div>

                                        {product.material && (
                                          <p className="mt-1 text-xs text-neutral-500">
                                            {
                                              product.material
                                            }
                                          </p>
                                        )}

                                        <div className="mt-2 flex items-center justify-between gap-2">
                                          <span className="font-semibold text-neutral-900">
                                            ₹
                                            {
                                              product.price
                                            }
                                          </span>

                                          {product.minimumOrder && (
                                            <span className="text-[11px] text-neutral-500">
                                              MOQ{" "}
                                              {
                                                product.minimumOrder
                                              }
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleViewProduct(
                                          product._id
                                        )
                                      }
                                      className="flex w-full items-center justify-center gap-2 border-t border-black/10 px-3 py-2.5 text-xs font-semibold text-black transition hover:bg-neutral-50"
                                      data-cursor="interactive"
                                    >
                                      View Product

                                      <ArrowRight
                                        size={
                                          14
                                        }
                                      />
                                    </button>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                )
              )}

              {/* AI Loading */}

              {aiLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-black/5 bg-white px-4 py-3 text-sm text-neutral-500 shadow-sm">
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />

                    <span>
                      Texora AI is thinking...
                    </span>
                  </div>
                </div>
              )}

              {/* Suggestions */}

              {messages.length ===
                1 &&
                !aiLoading && (
                  <div className="pt-2">
                    <p className="mb-2 px-1 text-xs font-medium text-neutral-500">
                      Try asking
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {suggestionItems.map(
                        (
                          suggestion
                        ) => (
                          <button
                            type="button"
                            key={
                              suggestion
                            }
                            onClick={() =>
                              handleSuggestionClick(
                                suggestion
                              )
                            }
                            className="rounded-full border border-black/10 bg-white px-3 py-2 text-xs text-neutral-700 transition hover:border-black hover:bg-black hover:text-white"
                            data-cursor="interactive"
                          >
                            {
                              suggestion
                            }
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>

            {/* Input */}

            <div className="border-t border-black/10 bg-white p-3">
              <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-neutral-50 p-2">
                <input
                  type="text"
                  value={input}
                  onChange={(event) =>
                    setInput(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key ===
                        "Enter" &&
                      !event.shiftKey
                    ) {
                      event.preventDefault();

                      void handleSend();
                    }
                  }}
                  placeholder="Ask about fabrics..."
                  disabled={aiLoading}
                  className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-neutral-400 disabled:opacity-50"
                />

                {/* Voice */}

                <button
                  type="button"
                  onClick={
                    startVoiceRecognition
                  }
                  disabled={aiLoading}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                    isListening
                      ? "bg-red-500 text-white"
                      : "text-neutral-600 hover:bg-neutral-200"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                  aria-label={
                    isListening
                      ? "Stop voice input"
                      : "Start voice input"
                  }
                  data-cursor="interactive"
                >
                  {isListening ? (
                    <MicOff
                      size={18}
                    />
                  ) : (
                    <Mic size={18} />
                  )}
                </button>

                {/* Send */}

                <button
                  type="button"
                  onClick={() =>
                    void handleSend()
                  }
                  disabled={
                    !input.trim() ||
                    aiLoading
                  }
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send message"
                  data-cursor="interactive"
                >
                  {aiLoading ? (
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>

              <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-neutral-400">
                <MessageCircle
                  size={11}
                />

                <span>
                  Powered by Texora AI
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}