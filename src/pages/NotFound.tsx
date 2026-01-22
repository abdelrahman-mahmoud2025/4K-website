import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";

const NotFound: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [signalBars, setSignalBars] = useState([false, false, false, false]);

  // Animate signal bars randomly to show "searching"
  useEffect(() => {
    const interval = setInterval(() => {
      const randomBars = [
        Math.random() > 0.7,
        Math.random() > 0.8,
        Math.random() > 0.9,
        Math.random() > 0.95,
      ];
      setSignalBars(randomBars);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden">
      {/* Background noise effect */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* Satellite Dish SVG */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          {/* Dish Base/Stand */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-20 bg-linear-to-t from-gray-600 to-gray-500 rounded-b-lg" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-gray-600 rounded-full" />

          {/* The Dish */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-48 h-32 bg-linear-to-br from-gray-300 via-gray-200 to-gray-400 rounded-full transform -skewY-12 shadow-2xl border-4 border-gray-400">
            {/* Inner dish gradient */}
            <div className="absolute inset-4 bg-linear-to-br from-gray-100 to-gray-300 rounded-full opacity-50" />
          </div>

          {/* LNB Arm */}
          <div className="absolute top-16 left-1/2 w-1 h-16 bg-gray-500 transform rotate-45 origin-bottom" />

          {/* LNB (receiver head) */}
          <div className="absolute top-4 left-[60%] w-6 h-10 bg-linear-to-b from-gray-400 to-gray-600 rounded-lg shadow-lg">
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-700 rounded-full" />
          </div>

          {/* Signal waves (broken/glitching) */}
          <div className="absolute -top-4 left-[65%]">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`absolute border-2 border-dashed rounded-full transition-opacity duration-300 ${
                  signalBars[i]
                    ? "border-red-500 opacity-50"
                    : "border-gray-400 opacity-20"
                }`}
                style={{
                  width: `${i * 24}px`,
                  height: `${i * 24}px`,
                  top: `-${i * 12}px`,
                  left: `-${i * 12}px`,
                  animation: signalBars[i] ? "pulse 1s infinite" : "none",
                }}
              />
            ))}
          </div>

          {/* "No Signal" indicator */}
          <div className="absolute -top-2 right-4 bg-red-500/90 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-lg">
            {isRTL ? "لا توجد إشارة" : "NO SIGNAL"}
          </div>
        </div>

        {/* 404 Text with glitch effect */}
        <div className="relative mb-4">
          <h1 className="text-8xl font-black text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-primary animate-pulse">
            404
          </h1>
          {/* Glitch layers */}
          <h1
            className="absolute top-0 left-0 w-full text-8xl font-black text-red-500/30 animate-glitch-1"
            aria-hidden="true"
          >
            404
          </h1>
          <h1
            className="absolute top-0 left-0 w-full text-8xl font-black text-blue-500/30 animate-glitch-2"
            aria-hidden="true"
          >
            404
          </h1>
        </div>

        {/* Signal strength indicator */}
        <div className="flex items-center justify-center gap-1 mb-6">
          <span className="text-subtext text-sm mr-2">
            {isRTL ? "قوة الإشارة:" : "Signal:"}
          </span>
          {signalBars.map((active, i) => (
            <div
              key={i}
              className={`w-2 rounded-full transition-all duration-300 ${
                active ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
              }`}
              style={{ height: `${(i + 1) * 6}px` }}
            />
          ))}
          <span className="text-red-500 text-xs font-bold ml-2 animate-pulse">
            {isRTL ? "ضعيفة" : "WEAK"}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-text mb-3">
          {isRTL ? "الصفحة غير موجودة" : "Page Not Found"}
        </h2>

        <p className="text-subtext mb-8 leading-relaxed">
          {isRTL
            ? "عذراً، يبدو أن الإشارة مقطوعة! الصفحة التي تبحث عنها غير موجودة أو تم نقلها."
            : "Sorry, the signal is lost! The page you're looking for doesn't exist or has been moved."}
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-primary text-black font-bold py-3 px-8 rounded-xl hover:bg-white transition-all shadow-lg shadow-primary/20 hover:-translate-y-1"
          >
            <Home size={20} />
            {isRTL ? "الصفحة الرئيسية" : "Go Home"}
          </Link>

          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 bg-surface border border-border text-text font-bold py-3 px-8 rounded-xl hover:border-primary transition-all hover:-translate-y-1"
          >
            <Search size={20} />
            {isRTL ? "تصفح المنتجات" : "Browse Shop"}
          </Link>
        </div>

        {/* Go back link */}
        <button
          onClick={() => window.history.back()}
          className="mt-6 inline-flex items-center gap-2 text-subtext hover:text-primary transition-colors group"
        >
          <ArrowLeft
            size={16}
            className={`group-hover:-translate-x-1 transition-transform ${isRTL ? "rotate-180" : ""}`}
          />
          {isRTL ? "العودة للصفحة السابقة" : "Go back to previous page"}
        </button>
      </div>

      {/* CSS for glitch animation */}
      <style>{`
        @keyframes glitch-1 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(2px, -2px); }
          60% { transform: translate(-1px, 1px); }
          80% { transform: translate(1px, -1px); }
        }
        @keyframes glitch-2 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(2px, -2px); }
          40% { transform: translate(-2px, 2px); }
          60% { transform: translate(1px, -1px); }
          80% { transform: translate(-1px, 1px); }
        }
        .animate-glitch-1 {
          animation: glitch-1 0.3s infinite;
        }
        .animate-glitch-2 {
          animation: glitch-2 0.3s infinite;
          animation-delay: 0.1s;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
