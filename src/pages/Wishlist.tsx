import React from "react";
import { useTranslation } from "react-i18next";
import { useWishlist } from "../store/StoreContext";
import ProductCard from "../components/ProductCard";
import { Heart, Sparkles, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Wishlist: React.FC = () => {
  const { t } = useTranslation();
  const { items } = useWishlist();

  return (
    <div className="container mx-auto px-4 py-12 relative min-h-[80vh]">
      {/* Header Frame */}
      <div className="bg-surface/50 backdrop-blur-md border border-border rounded-4xl p-8 md:p-10 mb-12 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none transform group-hover:scale-110 duration-700">
           <Heart size={200} />
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest mb-4">
            <Sparkles size={12} /> {t('saved')}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-text tracking-tight mb-2">
            {t("wishlist")}
          </h1>
          <p className="text-subtext flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            {items.length} {t("items")}
          </p>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-surface rounded-[2.5rem] border border-border border-dashed max-w-2xl mx-auto">
          <Heart size={80} className="mx-auto text-subtext/20 mb-8" />
          <h2 className="text-3xl font-black text-text mb-4">
            {t("wishlist_empty")}
          </h2>
          <p className="text-subtext text-lg mb-10 max-w-md mx-auto">{t("wishlist_desc")}</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 bg-primary text-black font-black text-lg py-5 px-10 rounded-2xl hover:bg-white transition-all shadow-xl shadow-primary/20 transform active:scale-95"
          >
            <ShoppingBag size={24} /> {t("shop_now")}
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
