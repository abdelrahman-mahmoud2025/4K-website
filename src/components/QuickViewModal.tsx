import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Check, ArrowRight } from "lucide-react";
import { useCart, useStore } from "../store/StoreContext";
import LazyImage from "./LazyImage";

const QuickViewModal: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const { quickViewProduct: product, closeQuickView } = useStore();
  const lang = i18n.language as "ar" | "en";
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product) return;
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={closeQuickView}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-surface rounded-3xl w-full max-w-5xl overflow-hidden border border-border shadow-2xl relative grid grid-cols-1 md:grid-cols-2 max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeQuickView}
              className="absolute top-4 right-4 z-20 p-2 bg-black/40 text-white rounded-full hover:bg-red-500 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Modal Image Section */}
            <div className="bg-white p-10 flex items-center justify-center relative border-r border-border">
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-black text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {t(`categories.${product.category}`)}
                </span>
              </div>
              <LazyImage
                src={product.image}
                alt={product.name[lang]}
                className="max-w-full max-h-100 object-contain drop-shadow-2xl"
              />
            </div>

            {/* Modal Details Section */}
            <div className="p-8 md:p-10 flex flex-col overflow-y-auto bg-surface relative text-text">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-primary font-bold uppercase text-sm tracking-widest">
                    {product.brand}
                  </span>
                  <span className="text-subtext">•</span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${product.inStock ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
                  >
                    {product.inStock ? t("in_stock") : t("out_of_stock")}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-text leading-tight mb-4">
                  {product.name[lang]}
                </h2>

                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-4xl font-bold text-primary">
                    {product.price}{" "}
                    <span className="text-lg text-subtext">
                      {t("currency")}
                    </span>
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-subtext line-through">
                      {product.originalPrice}
                    </span>
                  )}
                </div>

                <p className="text-subtext leading-relaxed text-lg mb-8 border-l-2 border-primary pl-4">
                  {product.description[lang]}
                </p>

                <div className="space-y-3 mb-8">
                  {product.features.slice(0, 3).map((feature, i) => {
                    // Handle both string and LocalizedString feature types
                    const featureText =
                      typeof feature === "string" ? feature : feature[lang];
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 text-subtext"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                        <span>{featureText}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-auto grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="py-4 bg-primary text-black font-bold text-lg rounded-xl hover:bg-white transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  {isAdding ? <Check /> : <ShoppingCart />}
                  {isAdding ? t("added") : t("add_to_cart")}
                </motion.button>
                <Link
                  to={`/product/${product.id}`}
                  onClick={closeQuickView}
                  className="py-4 border border-border text-text font-bold text-lg rounded-xl hover:bg-background transition-colors flex items-center justify-center gap-2"
                >
                  {t("view_details")} <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
