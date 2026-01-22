import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Star,
  Eye,
  Heart,
  Check,
  BarChart2,
  Sparkles,
  Zap,
} from "lucide-react";
import { Product } from "../types";
import {
  useCart,
  useWishlist,
  useCompare,
  useStore,
} from "../store/StoreContext";
import { useTheme } from "../store/ThemeContext";
import LazyImage from "./LazyImage";

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();
  const { openQuickView } = useStore();
  const { isDark } = useTheme();
  const lang = i18n.language as "ar" | "en";

  const [isAdding, setIsAdding] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 1500);
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  // Calculate discount percentage
  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  // Action button variants for staggered animation
  const actionButtonVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    }),
  };

  // Theme-aware dynamic styles
  const cardBackground = isDark
    ? "linear-gradient(145deg, rgba(17,17,17,0.95) 0%, rgba(0,0,0,0.98) 100%)"
    : "linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%)";

  const cardShadow = isHovered
    ? isDark
      ? "0 25px 60px -15px rgba(218,165,32,0.25), 0 0 0 1px rgba(218,165,32,0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
      : "0 25px 60px -15px rgba(218,165,32,0.2), 0 0 0 1px rgba(218,165,32,0.3), inset 0 -1px 0 rgba(0,0,0,0.05)"
    : isDark
      ? "0 10px 40px -15px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.03)"
      : "0 4px 20px -5px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04), inset 0 -1px 0 rgba(0,0,0,0.02)";

  const shimmerColor = isDark
    ? "rgba(218,165,32,0.1)"
    : "rgba(218,165,32,0.15)";

  const bottomGradient = isDark
    ? "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)"
    : "linear-gradient(to top, rgba(255,255,255,0.95) 0%, transparent 100%)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -12 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative rounded-3xl overflow-hidden flex flex-col h-full"
      style={{
        background: cardBackground,
        boxShadow: cardShadow,
        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Animated gradient border effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(45deg, transparent 40%, ${shimmerColor} 50%, transparent 60%)`,
          backgroundSize: "200% 200%",
          animation: isHovered ? "shimmer 2s infinite" : "none",
        }}
      />

      {/* Top Action Bar */}
      <div className="absolute top-4 left-4 right-4 z-30 flex justify-between items-start">
        {/* Badges Column */}
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {product.isOffer && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  boxShadow: "0 4px 15px rgba(239,68,68,0.4)",
                }}
              >
                <Zap size={12} className="text-white" />
                <span className="text-white text-[11px] font-bold uppercase tracking-wide">
                  {t("hot_deal")}
                </span>
              </motion.div>
            )}
            {discountPercentage > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, #DAA520 0%, #FF8C00 100%)",
                  boxShadow: "0 4px 15px rgba(218,165,32,0.4)",
                }}
              >
                <Sparkles size={12} className="text-black" />
                <span className="text-black text-[11px] font-bold">
                  -{discountPercentage}%
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Compare & Wishlist Buttons */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${
              inWishlist
                ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                : isDark
                  ? "bg-black/40 text-white/70 hover:bg-black/60 hover:text-white opacity-0 group-hover:opacity-100"
                  : "bg-white/60 text-gray-600 hover:bg-white/80 hover:text-gray-900 opacity-0 group-hover:opacity-100"
            }`}
            style={
              inWishlist
                ? {}
                : {
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                  }
            }
            aria-label={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <Heart size={16} fill={inWishlist ? "currentColor" : "none"} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCompareToggle}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${
              inCompare
                ? "bg-primary text-black shadow-lg shadow-primary/30"
                : isDark
                  ? "bg-black/40 text-white/70 hover:bg-black/60 hover:text-white opacity-0 group-hover:opacity-100"
                  : "bg-white/60 text-gray-600 hover:bg-white/80 hover:text-gray-900 opacity-0 group-hover:opacity-100"
            }`}
            style={
              inCompare
                ? {}
                : {
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                  }
            }
            aria-label={inCompare ? "Remove from Compare" : "Add to Compare"}
          >
            {inCompare ? (
              <Check size={16} strokeWidth={3} />
            ) : (
              <BarChart2 size={16} />
            )}
          </motion.button>
        </div>
      </div>

      {/* Image Container with Gradient Overlay */}
      <div className="relative aspect-square overflow-hidden">
        <Link to={`/product/${product.id}`} className="block w-full h-full p-8">
          <motion.div
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="w-full h-full"
          >
            <LazyImage
              src={product.image}
              alt={product.name[lang]}
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </motion.div>
        </Link>

        {/* Bottom gradient fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: bottomGradient }}
        />

        {/* Quick View Button - Centered */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <motion.button
                variants={actionButtonVariants}
                custom={0}
                initial="hidden"
                animate="visible"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openQuickView(product);
                }}
                className={`flex items-center gap-2 px-5 py-3 rounded-full pointer-events-auto ${
                  isDark ? "text-black" : "text-white"
                }`}
                style={{
                  background: isDark
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(0,0,0,0.9)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye size={18} />
                <span className="font-semibold text-sm">{t("quick_view")}</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col p-5 pt-3">
        {/* Brand & Rating Row */}
        <div className="flex justify-between items-center mb-3">
          <span
            className="text-[11px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-md"
            style={{
              color: isDark ? "rgba(218,165,32,0.9)" : "rgba(180,135,15,1)",
              background: isDark
                ? "rgba(218,165,32,0.1)"
                : "rgba(218,165,32,0.12)",
              border: `1px solid ${isDark ? "rgba(218,165,32,0.2)" : "rgba(218,165,32,0.25)"}`,
            }}
          >
            {product.brand}
          </span>
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{
              background: isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.04)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"}`,
            }}
          >
            <Star size={12} className="text-primary fill-primary" />
            <span
              className={`text-xs font-bold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {product.rating}
            </span>
          </div>
        </div>

        {/* Product Name */}
        <Link to={`/product/${product.id}`} className="block mb-auto">
          <h3
            className={`text-base font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-300 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {product.name[lang]}
          </h3>
        </Link>

        {/* Stock Status */}
        <div className="mt-3 mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`}
              style={{
                boxShadow: product.inStock
                  ? "0 0 8px rgba(34,197,94,0.6)"
                  : "0 0 8px rgba(239,68,68,0.6)",
              }}
            />
            <span
              className={`text-xs font-medium ${product.inStock ? "text-green-500" : "text-red-500"}`}
            >
              {product.inStock
                ? t("in_stock") || "In Stock"
                : t("out_of_stock") || "Out of Stock"}
            </span>
          </div>
        </div>

        {/* Price & Add to Cart */}
        <div
          className="flex items-center justify-between pt-4"
          style={{
            borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
          }}
        >
          <div className="flex flex-col">
            {product.originalPrice && (
              <span
                className={`text-xs line-through mb-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                {product.originalPrice} {t("currency")}
              </span>
            )}
            <div className="flex items-baseline gap-1.5">
              <span
                className="text-2xl font-black"
                style={{
                  background:
                    "linear-gradient(135deg, #DAA520 0%, #FFD700 50%, #DAA520 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {product.price}
              </span>
              <span
                className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                {t("currency")}
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 overflow-hidden ${
              !product.inStock
                ? isDark
                  ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                : isAdding
                  ? "text-white"
                  : "text-black"
            }`}
            style={
              !product.inStock
                ? {}
                : isAdding
                  ? {
                      background:
                        "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                      boxShadow: "0 8px 25px rgba(34,197,94,0.4)",
                    }
                  : {
                      background:
                        "linear-gradient(135deg, #DAA520 0%, #FFD700 100%)",
                      boxShadow: "0 8px 25px rgba(218,165,32,0.3)",
                    }
            }
            aria-label={isAdding ? "Added to Cart" : "Add to Cart"}
          >
            <AnimatePresence mode="wait">
              {isAdding ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Check size={22} strokeWidth={3} />
                </motion.div>
              ) : (
                <motion.div
                  key="cart"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <ShoppingCart size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Shimmer animation keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </motion.div>
  );
};

export default ProductCard;
