import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ShoppingCart,
  Check,
  Star,
  ArrowLeftRight,
  Heart,
  Share2,
  ShieldCheck,
  Truck,
  ChevronLeft,
  ChevronRight,
  Home,
  Package,
  FileText,
  Settings,
  CheckCircle,
  X,
  ZoomIn,
} from "lucide-react";
import { useData } from "../store/DataContext";
import { useCart, useCompare, useWishlist } from "../store/StoreContext";
import { useSEO } from "../hooks/useSEO";
import LazyImage from "../components/LazyImage";
import ProductCard from "../components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { ProductVariant } from "../types";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const { products } = useData();
  const { addToCompare, isInCompare, removeFromCompare } = useCompare();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const lang = i18n.language as "ar" | "en";

  const product = products.find((p) => p.id === id);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">(
    "desc",
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );

  // Auto-slideshow and zoom states
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // SEO for Product Page
  useSEO(
    product
      ? {
          title: product.name[lang],
          description: product.description[lang].substring(0, 160),
          image: product.image,
          type: "product",
          product: {
            name: product.name[lang],
            price: product.price,
            currency: "EGP",
            brand: product.brand,
            availability: product.inStock ? "InStock" : "OutOfStock",
            image: product.image,
            description: product.description[lang],
            sku: product.id,
          },
        }
      : {},
  );

  // Recently Viewed Logic
  useEffect(() => {
    if (product) {
      const stored = localStorage.getItem("recentlyViewed");
      let recentIds: string[] = stored ? JSON.parse(stored) : [];

      recentIds = recentIds.filter((pid) => pid !== product.id);
      recentIds.unshift(product.id);
      recentIds = recentIds.slice(0, 4);

      localStorage.setItem("recentlyViewed", JSON.stringify(recentIds));

      const recentDetails = recentIds
        .filter((pid) => pid !== product.id)
        .map((pid) => products.find((p) => p.id === pid))
        .filter(Boolean);

      setRecentProducts(recentDetails);
    }
    window.scrollTo(0, 0);
  }, [id, products]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-text bg-background">
        <Package size={64} className="text-subtext mb-4" />
        <h2 className="text-2xl font-bold mb-4">{t("product_not_found")}</h2>
        <Link to="/shop" className="text-primary hover:underline font-bold">
          {t("return_to_shop")}
        </Link>
      </div>
    );
  }

  // Get images dynamically - use images array if available, otherwise fallback to single image
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  const inCompare = isInCompare(product.id);
  const inWishlist = isInWishlist(product.id);

  // Auto-slideshow effect - advances every 5 seconds, pauses on hover
  useEffect(() => {
    if (images.length <= 1 || isHovering) {
      // Clear interval if only one image or hovering
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 10000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [images.length, isHovering]);

  // Reset image index and set default variant when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
    // Set default variant to first available variant
    if (product?.variants && product.variants.length > 0) {
      const firstInStock =
        product.variants.find((v) => v.inStock !== false) ||
        product.variants[0];
      setSelectedVariant(firstInStock);
    } else {
      setSelectedVariant(null);
    }
  }, [id, product?.variants]);

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  const handleCompareToggle = () => {
    if (inCompare) removeFromCompare(product.id);
    else addToCompare(product);
  };

  return (
    <div className="container mx-auto px-4 py-12 relative min-h-screen">
      {/* Breadcrumbs Frame */}
      <div className="bg-surface/50 backdrop-blur-md border border-border rounded-2xl px-6 py-3 mb-8 shadow-sm inline-flex items-center gap-2 text-sm text-subtext">
        <Link
          to="/"
          className="hover:text-primary transition-colors flex items-center gap-1.5 font-bold"
        >
          <Home size={14} />
          {t("home")}
        </Link>
        <ChevronRight size={14} className="opacity-30" />
        <Link
          to="/shop"
          className="hover:text-primary transition-colors font-bold"
        >
          {t("shop")}
        </Link>
        <ChevronRight size={14} className="opacity-30" />
        <span className="text-text truncate font-black max-w-30">
          {product.name[lang]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
        {/* Left Column: Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Slider */}
          <div
            className="relative bg-surface/60 backdrop-blur-sm rounded-[2.5rem] overflow-hidden h-100 md:h-140 border border-border flex items-center justify-center group shadow-2xl transition-all duration-500 hover:border-primary/20"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/5 z-0" />

            {/* Main Image with AnimatePresence for smooth transitions */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 w-full h-full flex items-center justify-center p-12"
              >
                <img
                  src={images[currentImageIndex]}
                  alt={product.name[lang]}
                  className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105"
                />
              </motion.div>
            </AnimatePresence>

            {/* Slider Controls */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute z-20 left-4 top-1/2 -translate-y-1/2 bg-surface/80 text-text p-2 rounded-full hover:bg-primary hover:text-black transition-all opacity-0 group-hover:opacity-100 shadow-lg border border-border"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute z-20 right-4 top-1/2 -translate-y-1/2 bg-surface/80 text-text p-2 rounded-full hover:bg-primary hover:text-black transition-all opacity-0 group-hover:opacity-100 shadow-lg border border-border"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(idx);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentImageIndex === idx
                          ? "bg-primary w-6"
                          : "bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2 z-20">
              {product.isOffer && (
                <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md uppercase tracking-wider">
                  {t("hot_deal")}
                </span>
              )}
              {product.originalPrice && (
                <span className="bg-secondary text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md uppercase tracking-wider">
                  {t("sale")}
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`aspect-square bg-surface rounded-xl p-2 border-2 transition-all overflow-hidden ${currentImageIndex === idx ? "border-primary ring-2 ring-primary/20 scale-95" : "border-border opacity-70 hover:opacity-100 hover:border-text/30"}`}
              >
                <LazyImage
                  src={img}
                  alt=""
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Info & Actions (5 cols) */}
        <div className="lg:col-span-5 flex flex-col h-full">
          <div className="bg-surface/80 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-border shadow-2xl sticky top-24 grow flex flex-col">
            <div className="grow space-y-8">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-primary font-black uppercase tracking-[0.2em] text-[10px] bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full">
                    {product.brand}
                  </span>
                  <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-full border border-border">
                    <Star
                      size={16}
                      className="text-yellow-400 fill-yellow-400"
                    />
                    <span className="text-text font-black text-sm">
                      {product.rating}
                    </span>
                    <span className="text-subtext text-[10px] font-bold uppercase tracking-wider">
                      (120 {t("reviews")})
                    </span>
                  </div>
                </div>

                <h1 className="text-3xl md:text-5xl font-black text-text mb-6 leading-[1.1] tracking-tight">
                  {product.name[lang]}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs font-black uppercase tracking-widest">
                  <div
                    className={`px-4 py-2 rounded-xl border flex items-center gap-2 shadow-sm ${product.inStock ? "border-green-500/30 text-green-500 bg-green-500/5" : "border-red-500/30 text-red-500 bg-red-500/5"}`}
                  >
                    {product.inStock ? (
                      <CheckCircle size={14} />
                    ) : (
                      <X size={14} />
                    )}
                    {product.inStock ? t("in_stock") : t("out_of_stock")}
                  </div>
                  <span className="text-subtext bg-background/50 px-4 py-2 rounded-xl border border-border">
                    {t("sku")}: {product.id.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="py-6 border-b border-border/50">
                  <span className="text-subtext text-xs font-black uppercase tracking-[0.2em] mb-4 block">
                    {t("select_option") || "اختر الخيار"}
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((variant) => {
                      const isSelected = selectedVariant?.id === variant.id;
                      const isAvailable = variant.inStock !== false;
                      return (
                        <button
                          key={variant.id}
                          onClick={() =>
                            isAvailable && setSelectedVariant(variant)
                          }
                          disabled={!isAvailable}
                          className={`px-5 py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                            isSelected
                              ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                              : isAvailable
                                ? "border-border bg-background text-text hover:border-primary/50"
                                : "border-border/50 bg-background/50 text-subtext/50 cursor-not-allowed line-through"
                          }`}
                        >
                          {variant.name[lang]}
                          <span className="block text-xs mt-1 font-black">
                            {variant.price} {t("currency")}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="py-8 border-y border-border/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/2 opacity-5 pointer-events-none"></div>
                <div className="flex items-end gap-4 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-subtext text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                      {t("price")}
                    </span>
                    <span className="text-5xl font-black text-primary tracking-tighter">
                      {selectedVariant ? selectedVariant.price : product.price}
                    </span>
                  </div>
                  <span className="text-xl text-subtext font-black uppercase mb-1">
                    {t("currency")}
                  </span>

                  {(selectedVariant?.originalPrice ||
                    product.originalPrice) && (
                    <div className="flex flex-col mb-1 ml-auto">
                      <span className="text-subtext line-through decoration-red-500/50 decoration-2 text-lg font-bold opacity-50">
                        {selectedVariant?.originalPrice ||
                          product.originalPrice}
                      </span>
                      <span className="text-xs text-red-500 font-black bg-red-500/10 px-2 py-1 rounded-lg uppercase tracking-wider">
                        -
                        {Math.round(
                          (((selectedVariant?.originalPrice ||
                            product.originalPrice ||
                            0) -
                            (selectedVariant?.price || product.price)) /
                            (selectedVariant?.originalPrice ||
                              product.originalPrice ||
                              1)) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() =>
                    addToCart(product, selectedVariant || undefined)
                  }
                  disabled={
                    product.variants
                      ? selectedVariant?.inStock === false
                      : !product.inStock
                  }
                  className={`w-full font-black text-lg py-5 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 shadow-2xl active:scale-95 cursor-pointer ${
                    (
                      product.variants
                        ? selectedVariant?.inStock !== false
                        : product.inStock
                    )
                      ? "bg-primary text-black hover:bg-white shadow-primary/20"
                      : "bg-background text-subtext border border-border cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart size={24} />{" "}
                  {(
                    product.variants
                      ? selectedVariant?.inStock !== false
                      : product.inStock
                  )
                    ? t("add_to_cart")
                    : t("unavailable")}
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleCompareToggle}
                    className={`py-4 px-2 md:px-4 lg:px-6 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all flex items-center justify-center gap-2 active:scale-95 ${inCompare ? "bg-primary/10 border-primary text-primary" : "bg-background border-border text-subtext hover:border-primary/50 hover:text-text cursor-pointer"}`}
                  >
                    <ArrowLeftRight size={18} />{" "}
                    {inCompare ? t("added") : t("compare")}
                  </button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`py-4 px-2 md:px-4 lg:px-6 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all flex items-center justify-center gap-2 active:scale-95 ${inWishlist ? "bg-red-500/10 border-red-500 text-red-500 shadow-lg shadow-red-500/10" : "bg-background border-border text-subtext hover:border-red-500/50 hover:text-text cursor-pointer"}`}
                  >
                    <Heart
                      size={18}
                      fill={inWishlist ? "currentColor" : "none"}
                    />{" "}
                    {inWishlist ? t("saved") : t("add_to_wishlist")}
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-4 text-subtext text-xs font-bold uppercase tracking-wider bg-background/50 p-4 rounded-2xl border border-border hover:border-primary/20 transition-colors group">
                  <div className="bg-secondary/10 p-3 rounded-xl text-secondary group-hover:scale-110 transition-transform">
                    <Truck size={20} />
                  </div>
                  <span>{t("free_shipping_offer")}</span>
                </div>
                <div className="flex items-center gap-4 text-subtext text-xs font-bold uppercase tracking-wider bg-background/50 p-4 rounded-2xl border border-border hover:border-primary/20 transition-colors group">
                  <div className="bg-green-500/10 p-3 rounded-xl text-green-500 group-hover:scale-110 transition-transform">
                    <ShieldCheck size={20} />
                  </div>
                  <span>{t("official_warranty_badge")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Tabs Section */}
      <div className="bg-surface/40 backdrop-blur-md rounded-2xl md:rounded-[2.5rem] border border-border overflow-hidden mb-12 md:mb-20 shadow-xl group">
        <div className="flex border-b border-border overflow-x-auto bg-background/20 p-1.5 md:p-2 gap-1.5 md:gap-2">
          <button
            className={`flex-1 min-w-28 md:min-w-37.5 px-4 md:px-8 py-3 md:py-5 font-black text-[10px] md:text-xs uppercase tracking-wider md:tracking-[0.2em] transition-all rounded-xl md:rounded-2xl flex items-center justify-center gap-2 md:gap-3 active:scale-95 ${activeTab === "desc" ? "text-black bg-primary shadow-lg shadow-primary/20" : "text-subtext hover:text-text hover:bg-surface/50"}`}
            onClick={() => setActiveTab("desc")}
          >
            <FileText size={14} className="md:w-4.5 md:h-4.5" />{" "}
            {t("description")}
          </button>
          <button
            className={`flex-1 min-w-28 md:min-w-37.5 px-4 md:px-8 py-3 md:py-5 font-black text-[10px] md:text-xs uppercase tracking-wider md:tracking-[0.2em] transition-all rounded-xl md:rounded-2xl flex items-center justify-center gap-2 md:gap-3 active:scale-95 ${activeTab === "specs" ? "text-black bg-primary shadow-lg shadow-primary/20" : "text-subtext hover:text-text hover:bg-surface/50"}`}
            onClick={() => setActiveTab("specs")}
          >
            <Settings size={14} className="md:w-4.5 md:h-4.5" /> {t("features")}{" "}
            & {t("specs")}
          </button>
        </div>

        <div className="p-5 md:p-10 lg:p-16 min-h-50 md:min-h-75 relative">
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-primary/2 via-transparent to-transparent pointer-events-none"></div>

          <AnimatePresence mode="wait">
            {activeTab === "desc" && (
              <motion.div
                key="desc"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative z-10"
              >
                <p className="text-text leading-relaxed md:leading-loose text-sm md:text-base lg:text-lg whitespace-pre-line max-w-4xl opacity-90">
                  {product.description[lang]}
                </p>
              </motion.div>
            )}

            {activeTab === "specs" && (
              <motion.div
                key="specs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12"
              >
                <div>
                  <h3 className="text-lg md:text-xl lg:text-2xl font-black text-text mb-4 md:mb-6 lg:mb-8 tracking-tight flex items-center gap-2 md:gap-3">
                    <div className="w-1 md:w-1.5 h-6 md:h-8 bg-primary rounded-full"></div>
                    {t("key_features")}
                  </h3>
                  {/* Features Grid - 2 columns on mobile, single list on larger screens */}
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 md:gap-3">
                    {product.features.map((f, i) => {
                      // Handle both LocalizedString and plain string features
                      const featureText = typeof f === "string" ? f : f[lang];
                      return (
                        <li
                          key={i}
                          className="flex items-start gap-2 md:gap-3 text-subtext group/item bg-background/30 p-2 md:p-3 rounded-xl border border-border/30"
                        >
                          <span className="mt-0.5 bg-primary/10 text-primary rounded-md p-0.5 md:p-1 group-hover/item:bg-primary group-hover/item:text-black transition-all shadow-sm shrink-0">
                            <Check
                              size={10}
                              className="md:w-3.5 md:h-3.5"
                              strokeWidth={3}
                            />
                          </span>
                          <span className="group-hover/item:text-text transition-colors font-medium text-xs md:text-sm lg:text-base leading-snug">
                            {featureText}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg md:text-xl lg:text-2xl font-black text-text mb-4 md:mb-6 lg:mb-8 tracking-tight flex items-center gap-2 md:gap-3 mt-6 lg:mt-0">
                    <div className="w-1 md:w-1.5 h-6 md:h-8 bg-primary rounded-full"></div>
                    {t("technical_specs")}
                  </h3>
                  <div className="bg-background/50 rounded-2xl md:rounded-3xl lg:rounded-4xl border border-border overflow-hidden shadow-inner">
                    <div className="flex justify-between p-3 md:p-4 lg:p-6 border-b border-border/50 hover:bg-primary/5 transition-colors group/row">
                      <span className="text-subtext font-bold uppercase tracking-widest text-[8px] md:text-[10px] group-hover/row:text-primary transition-colors">
                        {t("brand")}
                      </span>
                      <span className="text-text font-black text-xs md:text-sm lg:text-base">
                        {product.brand}
                      </span>
                    </div>
                    <div className="flex justify-between p-3 md:p-4 lg:p-6 border-b border-border/50 hover:bg-primary/5 transition-colors group/row">
                      <span className="text-subtext font-bold uppercase tracking-widest text-[8px] md:text-[10px] group-hover/row:text-primary transition-colors">
                        {t("model")}
                      </span>
                      <span className="text-text font-black text-xs md:text-sm lg:text-base truncate max-w-[60%] text-end">
                        {product.name["en"]}
                      </span>
                    </div>
                    <div className="flex justify-between p-3 md:p-4 lg:p-6 border-b border-border/50 hover:bg-primary/5 transition-colors group/row">
                      <span className="text-subtext font-bold uppercase tracking-widest text-[8px] md:text-[10px] group-hover/row:text-primary transition-colors">
                        {t("resolution")}
                      </span>
                      <span className="text-text font-black tracking-tight text-xs md:text-sm lg:text-base">
                        4K Ultra HD
                      </span>
                    </div>
                    <div className="flex justify-between p-3 md:p-4 lg:p-6 hover:bg-primary/5 transition-colors group/row">
                      <span className="text-subtext font-bold uppercase tracking-widest text-[8px] md:text-[10px] group-hover/row:text-primary transition-colors">
                        {t("connectivity")}
                      </span>
                      <span className="text-text font-black tracking-tight text-xs md:text-sm lg:text-base">
                        WiFi / Ethernet / USB
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Recently Viewed */}
      {recentProducts.length > 0 && (
        <div className="border-t border-border pt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-text">
              {t("recently_viewed")}
            </h2>
            <Link to="/shop" className="text-primary font-bold hover:underline">
              {t("view_history")}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
