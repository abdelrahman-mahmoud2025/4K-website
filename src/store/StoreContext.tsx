import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import toast from "react-hot-toast";
import { CartItem, Product } from "../types";

// ==================== Types ====================

interface CartState {
  items: CartItem[];
  total: number;
}

interface WishlistState {
  items: Product[];
}

interface CompareState {
  items: Product[];
}

interface StoreContextType {
  // Cart
  cart: CartState;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Wishlist
  wishlist: WishlistState;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;

  // Compare
  compare: CompareState;
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;

  // Quick View
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
}

// ==================== Context ====================

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// ==================== Provider ====================

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Wishlist State
  const [wishlistItems, setWishlistItems] = useState<Product[]>(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // Compare State
  const [compareItems, setCompareItems] = useState<Product[]>(() => {
    const saved = localStorage.getItem("compareList");
    return saved ? JSON.parse(saved) : [];
  });

  // Quick View State
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // ==================== Persist to localStorage ====================

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  useEffect(() => {
    localStorage.setItem("compareList", JSON.stringify(compareItems));
  }, [compareItems]);

  // ==================== Cart Actions ====================

  const addToCart = useCallback((product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const updateCartQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity < 1) return;
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, quantity } : item,
        ),
      );
    },
    [],
  );

  const clearCart = useCallback(() => setCartItems([]), []);

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  );

  // ==================== Wishlist Actions ====================

  const addToWishlist = useCallback((product: Product) => {
    setWishlistItems((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlistItems.some((item) => item.id === productId);
    },
    [wishlistItems],
  );

  const toggleWishlist = useCallback(
    (product: Product) => {
      if (wishlistItems.some((item) => item.id === product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    },
    [wishlistItems, addToWishlist, removeFromWishlist],
  );

  // ==================== Compare Actions ====================

  const addToCompare = useCallback(
    (product: Product) => {
      if (compareItems.length >= 4) {
        toast.error("يمكنك مقارنة 4 منتجات كحد أقصى.");
        return;
      }
      if (!compareItems.find((p) => p.id === product.id)) {
        setCompareItems((prev) => [...prev, product]);
      }
    },
    [compareItems],
  );

  const removeFromCompare = useCallback((productId: string) => {
    setCompareItems((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const isInCompare = useCallback(
    (productId: string) => {
      return compareItems.some((p) => p.id === productId);
    },
    [compareItems],
  );

  const clearCompare = useCallback(() => setCompareItems([]), []);

  // ==================== Quick View Actions ====================

  const openQuickView = useCallback((product: Product) => {
    setQuickViewProduct(product);
  }, []);

  const closeQuickView = useCallback(() => {
    setQuickViewProduct(null);
  }, []);

  // ==================== Context Value ====================

  const value = useMemo<StoreContextType>(
    () => ({
      // Cart
      cart: { items: cartItems, total: cartTotal },
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,

      // Wishlist
      wishlist: { items: wishlistItems },
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,

      // Compare
      compare: { items: compareItems },
      addToCompare,
      removeFromCompare,
      isInCompare,
      clearCompare,

      // Quick View
      quickViewProduct,
      openQuickView,
      closeQuickView,
    }),
    [
      cartItems,
      cartTotal,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
      compareItems,
      addToCompare,
      removeFromCompare,
      isInCompare,
      clearCompare,
      quickViewProduct,
      openQuickView,
      closeQuickView,
    ],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

// ==================== Hooks ====================

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within a StoreProvider");
  return context;
};

// Backward compatibility hooks
export const useCart = () => {
  const { cart, addToCart, removeFromCart, updateCartQuantity, clearCart } =
    useStore();
  return {
    items: cart.items,
    total: cart.total,
    addToCart,
    removeFromCart,
    updateQuantity: updateCartQuantity,
    clearCart,
  };
};

export const useWishlist = () => {
  const {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
  } = useStore();
  return {
    items: wishlist.items,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
  };
};

export const useCompare = () => {
  const {
    compare,
    addToCompare,
    removeFromCompare,
    isInCompare,
    clearCompare,
  } = useStore();
  return {
    compareList: compare.items,
    addToCompare,
    removeFromCompare,
    isInCompare,
    clearCompare,
  };
};
