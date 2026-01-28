import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useData } from "../store/DataContext";
import { useTheme } from "../store/ThemeContext";
import { useSEO } from "../hooks/useSEO";
import ProductCard from "../components/ProductCard";
import { Timer, Flame, Sparkles } from "lucide-react";

const Offers: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { products, loading } = useData();
  const { isDark } = useTheme();
  const offerProducts = products.filter((p) => p.isOffer);

  // SEO Meta Tags
  useSEO({
    title:
      i18n.language === "ar"
        ? "العروض والخصومات - أفضل عروض الرسيفرات والسيرفرات"
        : "Offers & Deals - Best Receiver & Server Discounts",
    description:
      i18n.language === "ar"
        ? "اكتشف أفضل العروض والخصومات على رسيفرات الستالايت وسيرفرات IPTV. عروض محدودة الوقت بأسعار لا تقبل المنافسة."
        : "Discover the best offers and discounts on satellite receivers and IPTV servers. Limited time deals at unbeatable prices.",
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-subtext">{t("loading_offers")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Header Frame */}
      <div className="container mx-auto px-4 pt-12">
        <div className="bg-surface/50 backdrop-blur-md border border-border rounded-[2.5rem] p-10 md:p-16 mb-12 shadow-2xl relative overflow-hidden group">
          {/* Decorative Background Icon */}
          <div className="absolute -top-10 -right-10 p-10 opacity-5 group-hover:opacity-10 transition-all duration-700 pointer-events-none transform group-hover:rotate-12 group-hover:scale-110">
            <Flame size={320} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="inline-flex items-center justify-center p-5 bg-secondary/10 rounded-2xl mb-8 text-secondary shadow-inner"
            >
              <Flame size={48} />
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-black mb-6 text-text tracking-tight">
              {t("offers")}
            </h1>

            {/* Subtitle Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-secondary/10 border border-secondary/20 shadow-sm"
            >
              <Timer size={20} className="text-secondary animate-pulse" />
              <span className="text-secondary font-black uppercase tracking-widest text-sm">
                {t("limited_time_deals")}
              </span>
              <Sparkles size={18} className="text-primary" />
            </motion.div>

            <p className="mt-8 text-subtext text-lg font-medium flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
              {offerProducts.length}{" "}
              {t("products_available") || "products available"}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4">
        {offerProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className={`text-6xl mb-4`}>🏷️</div>
            <h3
              className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {t("no_offers") || "No offers available"}
            </h3>
            <p className={isDark ? "text-gray-400" : "text-gray-500"}>
              {t("check_back_later") || "Check back later for amazing deals!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {offerProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                {/* Product Card with integrated offer details */}
                <ProductCard product={product} showOfferDetails={true} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Offers;
