import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  images: string[];
  quantity: number;
  unit?: string;
  supplier?: string;
  category?: string;
  minimumOrder?: number;
  stock?: number;
}

interface CartContextType {
  cartItems: CartItem[];

  addToCart: (
    product: Omit<CartItem, "quantity">,
    quantity?: number
  ) => void;

  removeFromCart: (id: string | number) => void;

  updateQuantity: (
    id: string | number,
    quantity: number
  ) => void;

  clearCart: () => void;

  cartTotal: number;

  cartCount: number;
}

const CartContext = createContext<
  CartContextType | undefined
>(undefined);

export const CartProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // Load cart from localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(
    () => {
      try {
        const savedCart =
          localStorage.getItem("texora-cart");

        if (!savedCart) {
          return [];
        }

        const parsedCart = JSON.parse(savedCart);

        // Make sure stored data is actually an array
        if (!Array.isArray(parsedCart)) {
          return [];
        }

        return parsedCart;
      } catch {
        return [];
      }
    }
  );

  // Save cart whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem(
        "texora-cart",
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error(
        "Failed to save cart:",
        error
      );
    }
  }, [cartItems]);

  // --------------------------------------------------
  // ADD PRODUCT TO CART
  // --------------------------------------------------

  const addToCart = (
    product: Omit<CartItem, "quantity">,
    quantity = 1
  ) => {
    setCartItems((previousItems) => {
      const existingItem = previousItems.find(
        (item) =>
          String(item.id) === String(product.id)
      );

      const stock =
        product.stock ?? Infinity;

      const minimumOrder =
        product.minimumOrder ?? 1;

      /*
       * B2B rule:
       * Every product must respect its MOQ.
       *
       * Example:
       * MOQ = 50
       * User adds quantity = 1
       * Actual quantity becomes 50.
       */
      const safeQuantity = Math.max(
        quantity,
        minimumOrder
      );

      // --------------------------------------------------
      // PRODUCT ALREADY EXISTS
      // --------------------------------------------------

      if (existingItem) {
        const newQuantity =
          existingItem.quantity +
          safeQuantity;

        const finalQuantity = Math.min(
          newQuantity,
          stock
        );

        return previousItems.map((item) =>
          String(item.id) ===
          String(product.id)
            ? {
                ...item,

                quantity: finalQuantity,

                minimumOrder,

                stock,
              }
            : item
        );
      }

      // --------------------------------------------------
      // NEW PRODUCT
      // --------------------------------------------------

      const finalQuantity = Math.min(
        safeQuantity,
        stock
      );

      return [
        ...previousItems,
        {
          ...product,

          quantity: finalQuantity,
        },
      ];
    });
  };

  // --------------------------------------------------
  // REMOVE PRODUCT
  // --------------------------------------------------

  const removeFromCart = (
    id: string | number
  ) => {
    setCartItems((previousItems) =>
      previousItems.filter(
        (item) =>
          String(item.id) !== String(id)
      )
    );
  };

  // --------------------------------------------------
  // UPDATE QUANTITY
  // --------------------------------------------------

  const updateQuantity = (
    id: string | number,
    quantity: number
  ) => {
    // If quantity becomes zero or negative,
    // remove the item completely.
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems((previousItems) =>
      previousItems.map((item) => {
        if (
          String(item.id) !== String(id)
        ) {
          return item;
        }

        const minimumOrder =
          item.minimumOrder ?? 1;

        const stock =
          item.stock ?? Infinity;

        /*
         * Never allow quantity below MOQ.
         */
        const quantityWithMOQ =
          Math.max(
            quantity,
            minimumOrder
          );

        /*
         * Never allow quantity above stock.
         */
        const safeQuantity =
          Math.min(
            quantityWithMOQ,
            stock
          );

        return {
          ...item,

          quantity: safeQuantity,
        };
      })
    );
  };

  // --------------------------------------------------
  // CLEAR CART
  // --------------------------------------------------

  const clearCart = () => {
    setCartItems([]);

    localStorage.removeItem(
      "texora-cart"
    );
  };

  // --------------------------------------------------
  // CART TOTAL
  // --------------------------------------------------

  const cartTotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price) *
        Number(item.quantity),
    0
  );

  // --------------------------------------------------
  // CART COUNT
  // --------------------------------------------------

  const cartCount = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.quantity),
    0
  );

  // --------------------------------------------------
  // PROVIDER
  // --------------------------------------------------

  return (
    <CartContext.Provider
      value={{
        cartItems,

        addToCart,

        removeFromCart,

        updateQuantity,

        clearCart,

        cartTotal,

        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// --------------------------------------------------
// useCart HOOK
// --------------------------------------------------

export const useCart = () => {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
};