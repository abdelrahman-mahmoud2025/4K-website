import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { useData } from "../store/DataContext";
import { useCart, useCompare, useWishlist } from "../store/StoreContext";
import LazyImage from "../components/LazyImage";
import ProductCard from "../components/ProductCard";

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

  const images = product.images || [
    product.image,
    product.image,
    product.image,
  ];
  const inCompare = isInCompare(product.id);
  const inWishlist = isInWishlist(product.id);

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  const handleCompareToggle = () => {
    if (inCompare) removeFromCompare(product.id);
    else addToCompare(product);
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-subtext mb-8 overflow-hidden">
        <Link to="/" className="hover:text-primary flex items-center gap-1">
          <Home size={14} />
          {t("home")}
        </Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-primary">
          {t("shop")}
        </Link>
        <span>/</span>
        <span className="text-text truncate font-medium">
          {product.name[lang]}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
        {/* Left Column: Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Slider */}
          <div className="relative bg-surface rounded-2xl overflow-hidden h-100 md:h-125 border border-border flex items-center justify-center group shadow-sm">
            <div className="absolute inset-0 bg-background/50 z-0" />{" "}
            {/* Subtle pattern overlay backing */}
            <LazyImage
              src={images[currentImageIndex]}
              alt={product.name[lang]}
              className="relative z-10 max-w-full max-h-full object-contain p-8 transition-transform duration-500 hover:scale-105"
            />
            {/* Slider Controls */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute z-20 left-4 top-1/2 -translate-y-1/2 bg-surface/80 text-text p-2 rounded-full hover:bg-primary hover:text-black transition-all opacity-0 group-hover:opacity-100 shadow-lg border border-border"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute z-20 right-4 top-1/2 -translate-y-1/2 bg-surface/80 text-text p-2 rounded-full hover:bg-primary hover:text-black transition-all opacity-0 group-hover:opacity-100 shadow-lg border border-border"
                >
                  <ChevronRight size={24} />
                </button>
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
          <div className="grow space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-primary font-bold uppercase tracking-wider text-sm bg-primary/10 px-2 py-0.5 rounded">
                  {product.brand}
                </span>
                <div className="flex items-center gap-1.5">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-text font-bold">{product.rating}</span>
                  <span className="text-subtext text-sm">
                    (120 {t("reviews")})
                  </span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-text mb-4 leading-tight">
                {product.name[lang]}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                <div
                  className={`px-3 py-1 rounded-full border flex items-center gap-1.5 ${product.inStock ? "border-green-500/50 text-green-500 bg-green-500/10" : "border-red-500/50 text-red-500 bg-red-500/10"}`}
                >
                  {product.inStock ? (
                    <Check size={14} />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                  )}
                  {product.inStock ? t("in_stock") : t("out_of_stock")}
                </div>
                <span className="text-subtext">
                  {t("sku")}: {product.id.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="py-6 border-t border-b border-border">
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-bold text-primary tracking-tight">
                  {product.price}{" "}
                  <span className="text-lg text-subtext font-normal">
                    {t("currency")}
                  </span>
                </span>
                {product.originalPrice && (
                  <div className="flex flex-col">
                    <span className="text-subtext line-through decoration-red-500 decoration-2 text-lg">
                      {product.originalPrice} {t("currency")}
                    </span>
                    <span className="text-xs text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded">
                      {t("save")}{" "}
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
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
                onClick={() => addToCart(product)}
                disabled={!product.inStock}
                className={`w-full font-bold py-4 px-8 rounded-xl text-lg flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 shadow-xl active:scale-95 ${product.inStock ? "bg-primary text-black hover:bg-white border-2 border-transparent" : "bg-background text-subtext border-2 border-border cursor-not-allowed"}`}
              >
                <ShoppingCart size={24} />{" "}
                {product.inStock ? t("add_to_cart") : t("unavailable")}
              </button>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleCompareToggle}
                  className={`py-3.5 rounded-xl font-bold border-2 flex items-center justify-center gap-2 transition-colors ${inCompare ? "bg-primary/10 border-primary text-primary" : "border-border text-subtext hover:border-text hover:text-text bg-surface"}`}
                >
                  <ArrowLeftRight size={18} />{" "}
                  {inCompare ? t("added") : t("compare")}
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`py-3.5 rounded-xl font-bold border-2 flex items-center justify-center gap-2 transition-colors ${inWishlist ? "bg-red-500/10 border-red-500 text-red-500" : "border-border text-subtext hover:border-text hover:text-text bg-surface"}`}
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
              <div className="flex items-center gap-3 text-subtext text-sm bg-background p-3 rounded-lg border border-border">
                <div className="bg-secondary/10 p-2 rounded text-secondary">
                  <Truck size={18} />
                </div>
                <span>{t("free_shipping_offer")}</span>
              </div>
              <div className="flex items-center gap-3 text-subtext text-sm bg-background p-3 rounded-lg border border-border">
                <div className="bg-green-500/10 p-2 rounded text-green-500">
                  <ShieldCheck size={18} />
                </div>
                <span>{t("official_warranty_badge")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Tabs Section */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden mb-16 shadow-sm">
        <div className="flex border-b border-border overflow-x-auto">
          <button
            className={`px-8 py-5 font-bold text-lg whitespace-nowrap transition-all border-b-2 relative ${activeTab === "desc" ? "text-primary border-primary bg-background" : "text-subtext border-transparent hover:text-text hover:bg-background/50"}`}
            onClick={() => setActiveTab("desc")}
          >
            {t("description")}
          </button>
          <button
            className={`px-8 py-5 font-bold text-lg whitespace-nowrap transition-all border-b-2 relative ${activeTab === "specs" ? "text-primary border-primary bg-background" : "text-subtext border-transparent hover:text-text hover:bg-background/50"}`}
            onClick={() => setActiveTab("specs")}
          >
            {t("features")} & {t("specs")}
          </button>
        </div>

        <div className="p-8 min-h-75 bg-background/30">
          {activeTab === "desc" && (
            <div className="animate-fade-in">
              <p className="text-text leading-loose text-lg whitespace-pre-line max-w-4xl">
                {product.description[lang]}
              </p>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-text mb-4">
                  {t("key_features")}
                </h3>
                <ul className="space-y-3">
                  {product.features.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-subtext group"
                    >
                      <span className="mt-1 bg-primary/10 text-primary rounded-full p-0.5 group-hover:bg-primary group-hover:text-black transition-colors">
                        <Check size={14} />
                      </span>
                      <span className="group-hover:text-text transition-colors">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-text mb-4">
                  {t("technical_specs")}
                </h3>
                <div className="bg-surface rounded-xl border border-border overflow-hidden">
                  <div className="flex justify-between p-4 border-b border-border hover:bg-background transition-colors">
                    <span className="text-subtext font-medium">
                      {t("brand")}
                    </span>
                    <span className="text-text font-bold">{product.brand}</span>
                  </div>
                  <div className="flex justify-between p-4 border-b border-border hover:bg-background transition-colors">
                    <span className="text-subtext font-medium">
                      {t("model")}
                    </span>
                    <span className="text-text font-bold">
                      {product.name["en"]}
                    </span>
                  </div>
                  <div className="flex justify-between p-4 border-b border-border hover:bg-background transition-colors">
                    <span className="text-subtext font-medium">
                      {t("resolution")}
                    </span>
                    <span className="text-text font-bold">4K Ultra HD</span>
                  </div>
                  <div className="flex justify-between p-4 hover:bg-background transition-colors">
                    <span className="text-subtext font-medium">
                      {t("connectivity")}
                    </span>
                    <span className="text-text font-bold">
                      WiFi / Ethernet / USB
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
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
