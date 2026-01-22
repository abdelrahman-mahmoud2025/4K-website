import React from "react";
import { useTranslation } from "react-i18next";
import { useWishlist } from "../store/StoreContext";
import ProductCard from "../components/ProductCard";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Wishlist: React.FC = () => {
  const { t } = useTranslation();
  const { items } = useWishlist();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-bold text-text border-r-4 border-red-500 pr-4">
          {t("wishlist")}
        </h1>
        <div className="bg-red-500/10 text-red-500 p-2 rounded-full">
          <Heart fill="currentColor" size={24} />
        </div>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface rounded-xl border border-border">
          <Heart size={64} className="mx-auto text-subtext mb-6" />
          <h2 className="text-2xl font-bold text-text mb-4">
            {t("wishlist_empty")}
          </h2>
          <p className="text-subtext mb-8">{t("wishlist_desc")}</p>
          <Link
            to="/shop"
            className="inline-block bg-primary text-black font-bold py-3 px-8 rounded-lg hover:bg-white transition-colors"
          >
            {t("shop_now")}
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
