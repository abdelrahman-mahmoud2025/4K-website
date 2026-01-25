import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useData } from "../store/DataContext";
import { useTheme } from "../store/ThemeContext";
import ProductCard from "../components/ProductCard";
import { Timer, Clock, Flame, Sparkles } from "lucide-react";

const Countdown: React.FC<{ targetDate: string }> = ({ targetDate }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          expired: false,
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.expired) {
    return (
      <div className="text-red-500 text-sm font-bold flex items-center gap-2">
        <Clock size={14} />
        {t("expired")}
      </div>
    );
  }

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div
        className={`text-lg font-black tabular-nums px-2 py-1 rounded-lg min-w-10 text-center ${
          isDark
            ? "bg-secondary/20 text-secondary"
            : "bg-secondary/15 text-secondary"
        }`}
      >
        {String(value).padStart(2, "0")}
      </div>
      <span
        className={`text-[10px] uppercase tracking-wide mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
      >
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex items-center gap-2">
      <TimeBlock value={timeLeft.days} label={t("days_short")} />
      <span className="text-secondary font-bold text-lg mb-4">:</span>
      <TimeBlock value={timeLeft.hours} label={t("hours_short")} />
      <span className="text-secondary font-bold text-lg mb-4">:</span>
      <TimeBlock value={timeLeft.minutes} label={t("minutes_short")} />
      <span className="text-secondary font-bold text-lg mb-4">:</span>
      <TimeBlock value={timeLeft.seconds} label={t("seconds_short")} />
    </div>
  );
};

const Offers: React.FC = () => {
  const { t } = useTranslation();
  const { products, loading } = useData();
  const { isDark } = useTheme();
  const offerProducts = products.filter((p) => p.isOffer);

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
              {offerProducts.length} {t("products_available") || "products available"}
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
                className="flex flex-col"
              >
                {/* Product Card */}
                <ProductCard product={product} />

                {/* Countdown Timer - Seamlessly attached below card */}
                <div
                  className={`-mt-3 relative z-10 mx-2 rounded-b-2xl p-4 flex flex-col items-center ${
                    isDark
                      ? "bg-surface border-x border-b border-border"
                      : "bg-white border-x border-b border-gray-200 shadow-sm"
                  }`}
                >
                  {product.offerEndsAt ? (
                    <>
                      <div
                        className={`text-[10px] uppercase tracking-widest mb-2 flex items-center gap-1.5 ${
                          isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        <Clock size={10} />
                        {t("ends_in") || "Ends in"}
                      </div>
                      <Countdown targetDate={product.offerEndsAt} />
                    </>
                  ) : (
                    <div className="flex items-center gap-2 py-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      <span
                        className={`text-sm font-medium ${isDark ? "text-green-400" : "text-green-600"}`}
                      >
                        {t("ongoing_offer") || "Ongoing Offer"}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Offers;
