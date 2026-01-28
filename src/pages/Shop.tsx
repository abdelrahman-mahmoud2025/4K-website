import React, { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  ChevronDown,
  Check,
  Zap,
  SlidersHorizontal,
  X,
  Ruler,
  Cpu,
  Wifi,
  Clock,
  Layers,
  ChevronUp,
  Store,
  Sparkles,
  LayoutGrid,
} from "lucide-react";
import { useData } from "../store/DataContext";
import { useCompare } from "../store/StoreContext";
import { useSEO } from "../hooks/useSEO";
import ProductCard from "../components/ProductCard";
import { getCategoryInfo } from "../data/categoryConfig";

// Helper function to categorize a feature string into a group
const categorizeFeature = (feature: string): string => {
  const lowerFeature = feature.toLowerCase();
  if (
    lowerFeature.includes("متر") ||
    lowerFeature.includes("meter") ||
    lowerFeature.includes("m ") ||
    lowerFeature.includes("طول")
  ) {
    return "length";
  }
  if (
    lowerFeature.includes("android") ||
    lowerFeature.includes("ios") ||
    lowerFeature.includes("windows") ||
    lowerFeature.includes("نظام")
  ) {
    return "system";
  }
  if (
    lowerFeature.includes("wifi") ||
    lowerFeature.includes("bluetooth") ||
    lowerFeature.includes("واي فاي") ||
    lowerFeature.includes("اتصال")
  ) {
    return "connectivity";
  }
  if (
    lowerFeature.includes("اشتراك") ||
    lowerFeature.includes("subscription") ||
    lowerFeature.includes("سنة") ||
    lowerFeature.includes("شهر")
  ) {
    return "subscription";
  }
  return "other";
};

// Helper function to get icon for feature group
const getGroupIcon = (group: string): React.ReactNode => {
  switch (group) {
    case "length":
      return <Ruler size={14} className="text-primary" />;
    case "system":
      return <Cpu size={14} className="text-primary" />;
    case "connectivity":
      return <Wifi size={14} className="text-primary" />;
    case "subscription":
      return <Clock size={14} className="text-primary" />;
    default:
      return <Layers size={14} className="text-primary" />;
  }
};

// Dropdown Component for Desktop Row
const FilterDropdown: React.FC<{
  title: string;
  icon?: React.ReactNode;
  activeCount: number;
  children: React.ReactNode;
}> = ({ title, icon, activeCount, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors text-sm font-bold whitespace-nowrap
        ${
          isOpen || activeCount > 0
            ? "bg-primary/10 border-primary text-primary"
            : "bg-surface border-border text-subtext hover:border-primary/50 hover:text-text"
        }`}
      >
        {icon}
        {title}
        {activeCount > 0 && (
          <span className="bg-primary text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {activeCount}
          </span>
        )}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-64 bg-surface border border-border rounded-xl shadow-xl z-30 p-4 max-h-80 overflow-y-auto custom-scrollbar animate-fade-in-up">
          {children}
        </div>
      )}
    </div>
  );
};

// Reusable Filter Section for Mobile
const MobileFilterSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-border/50 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 text-left font-bold text-text hover:text-primary transition-colors"
      >
        {title}
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && <div className="pb-3 px-1 space-y-2">{children}</div>}
    </div>
  );
};

const FilterCheckbox: React.FC<{
  checked: boolean;
  label: string;
  onChange: () => void;
}> = ({ checked, label, onChange }) => (
  <label className="flex items-center gap-3 text-text cursor-pointer select-none group p-1.5 hover:bg-background rounded-lg transition-colors">
    <div
      className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
        checked
          ? "bg-primary border-primary"
          : "border-border bg-background group-hover:border-primary"
      }`}
    >
      {checked && <Check size={14} className="text-black" strokeWidth={3} />}
    </div>
    <input
      type="checkbox"
      className="hidden"
      checked={checked}
      onChange={onChange}
    />
    <span className="font-medium text-sm truncate">{label}</span>
  </label>
);

const Shop: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { products, loading } = useData();
  const { compareList } = useCompare();
  const [searchParams, setSearchParams] = useSearchParams();

  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [brandFilters, setBrandFilters] = useState<string[]>([]);
  const [featureFilters, setFeatureFilters] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(10000);
  const [showFilters, setShowFilters] = useState(false); // Mobile toggle
  const [showMoreFilters, setShowMoreFilters] = useState(false); // Desktop toggle
  const [sortBy, setSortBy] = useState<string>("featured");

  // SEO Meta Tags
  useSEO({
    title:
      i18n.language === "ar"
        ? "المتجر - تسوق رسيفرات وسيرفرات الستالايت"
        : "Shop - Browse Satellite Receivers & Servers",
    description:
      i18n.language === "ar"
        ? "تصفح مجموعتنا الكاملة من رسيفرات الستالايت، سيرفرات IPTV، اكسسوارات، وكابلات. أفضل الأسعار في مصر مع ضمان رسمي."
        : "Browse our complete collection of satellite receivers, IPTV servers, accessories, and cables. Best prices in Egypt with official warranty.",
  });

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setCategoryFilters([cat]);
  }, [searchParams]);

  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  // Filter Logic
  const productsForFilters = useMemo(() => {
    let base = products;
    if (categoryFilters.length > 0) {
      base = base.filter((p) => categoryFilters.includes(p.category));
    }
    return base;
  }, [products, categoryFilters]);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))),
    [products],
  );

  const availableBrands = useMemo(
    () => Array.from(new Set(productsForFilters.map((p) => p.brand))).sort(),
    [productsForFilters],
  );

  // Helper function to get feature as string (handles both LocalizedString and string)
  const getFeatureString = (
    feature: string | { ar: string; en: string },
  ): string => {
    if (typeof feature === "string") return feature;
    // For filtering, combine both languages to ensure matches in either
    return `${feature.ar} ${feature.en}`;
  };

  const featureGroups = useMemo(() => {
    const groups: Record<string, string[]> = {
      system: [],
      connectivity: [],
      subscription: [],
      other: [],
    };

    // Extract all features as strings for categorization
    const allFeatures = Array.from(
      new Set(
        productsForFilters.flatMap((p) =>
          p.features.map((f) => getFeatureString(f)),
        ),
      ),
    );

    allFeatures.forEach((f: string) => {
      const group = categorizeFeature(f);
      if (groups[group]) {
        groups[group].push(f);
      } else {
        groups.other.push(f);
      }
    });

    const finalGroups: Record<string, string[]> = {};
    Object.entries(groups).forEach(([k, v]) => {
      if (v.length > 0) {
        finalGroups[k] = v.sort();
      }
    });

    return finalGroups;
  }, [productsForFilters]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        categoryFilters.length === 0 ||
        categoryFilters.includes(product.category);

      const matchesBrand =
        brandFilters.length === 0 || brandFilters.includes(product.brand);

      const matchesFeatures =
        featureFilters.length === 0 ||
        featureFilters.every((selectedFeat) =>
          product.features.some((prodFeat) =>
            getFeatureString(prodFeat)
              .toLowerCase()
              .includes(selectedFeat.toLowerCase()),
          ),
        );

      const matchesPrice = product.price <= priceRange;

      const matchesSearch = searchQuery
        ? product.name["ar"].toLowerCase().includes(searchQuery) ||
          product.name["en"].toLowerCase().includes(searchQuery) ||
          product.brand.toLowerCase().includes(searchQuery)
        : true;

      return (
        matchesCategory &&
        matchesBrand &&
        matchesFeatures &&
        matchesPrice &&
        matchesSearch
      );
    });

    switch (sortBy) {
      case "price_low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
      default:
        break;
    }

    return result;
  }, [
    products,
    categoryFilters,
    brandFilters,
    featureFilters,
    priceRange,
    searchQuery,
    sortBy,
  ]);

  const toggleFilter = (
    setFn: React.Dispatch<React.SetStateAction<string[]>>,
    item: string,
  ) => {
    setFn((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const clearAllFilters = () => {
    setCategoryFilters([]);
    setBrandFilters([]);
    setFeatureFilters([]);
    setPriceRange(10000);
    setSortBy("featured");
    setShowFilters(false);
  };

  if (loading)
    return (
      <div className="text-text text-center py-20 animate-pulse">
        {t("loading_products")}
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {/* Compare Floater */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-surface/90 border border-primary px-2 py-2 rounded-full shadow-2xl flex items-center gap-4 animate-fade-in-up backdrop-blur-md">
          <span className="text-text font-bold text-center ">
            {compareList.length} {t("items_to_compare")}
          </span>
          <Link
            to="/compare"
            className="bg-primary text-black text-center px-3 py-2 rounded-full text-sm font-bold hover:bg-gray-400 transition-all shadow-lg shadow-primary/20"
          >
            {t("compare_now")}
          </Link>
        </div>
      )}

      {/* Header Frame */}
      <div className="bg-surface/50 backdrop-blur-md border border-border rounded-4xl p-8 md:p-10 mb-10 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none transform group-hover:scale-110 duration-700">
          <Store size={200} />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
              <Sparkles size={12} /> {t("view_all_products")}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-text tracking-tight mb-2">
              {t("shop")}
            </h1>
            <p className="text-subtext flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              {filteredProducts.length} {t("results_found")}
            </p>
          </div>

          <div className="w-full md:w-auto">
            {/* Sort Dropdown */}
            <div className="relative group min-w-50">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-subtext group-hover:text-primary transition-colors">
                <SlidersHorizontal size={16} />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-background border border-border text-text pl-12 pr-10 py-3.5 rounded-xl focus:border-primary focus:outline-none cursor-pointer font-bold shadow-sm transition-all hover:border-primary/50"
              >
                <option value="featured">{t("sort.featured")}</option>
                <option value="price_low">{t("sort.price_low")}</option>
                <option value="price_high">{t("sort.price_high")}</option>
                <option value="rating">{t("sort.rating")}</option>
                <option value="newest">{t("sort.newest")}</option>
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-subtext pointer-events-none group-hover:text-primary transition-colors"
                size={18}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Grid Selector */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <LayoutGrid size={18} className="text-primary" />
          <h2 className="text-lg font-bold text-text">
            {t("browse_by_category")}
          </h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {/* All Products Card */}
          <button
            onClick={() => {
              setCategoryFilters([]);
              setSearchParams({});
            }}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300 group hover:scale-105 ${
              categoryFilters.length === 0
                ? "bg-primary text-black border-primary shadow-lg shadow-primary/20"
                : "bg-surface border-border text-text hover:border-primary hover:bg-primary/5"
            }`}
          >
            <LayoutGrid
              size={24}
              className={
                categoryFilters.length === 0
                  ? "text-black"
                  : "text-primary group-hover:scale-110 transition-transform"
              }
            />
            <span className="text-xs font-bold text-center leading-tight">
              {i18n.language === "ar" ? "الكل" : "All"}
            </span>
          </button>

          {/* Category Cards */}
          {categories.map((cat) => {
            const catInfo = getCategoryInfo(cat);
            const IconComponent = catInfo.icon;
            const isActive = categoryFilters.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => {
                  setCategoryFilters([cat]);
                  setSearchParams({ category: cat });
                }}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300 group hover:scale-105 ${
                  isActive
                    ? "bg-primary text-black border-primary shadow-lg shadow-primary/20"
                    : "bg-surface border-border text-text hover:border-primary hover:bg-primary/5"
                }`}
              >
                <IconComponent
                  size={24}
                  className={
                    isActive
                      ? "text-black"
                      : "text-primary group-hover:scale-110 transition-transform"
                  }
                />
                <span className="text-xs font-bold text-center leading-tight">
                  {catInfo.name[i18n.language === "ar" ? "ar" : "en"]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DESKTOP FILTERS (Row) */}
      <div className="hidden md:block mb-10 relative z-40">
        <div className="bg-surface/30 backdrop-blur-sm border border-border rounded-2xl p-4 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-xs font-black text-subtext uppercase tracking-widest mr-2 flex items-center gap-2">
              <Filter size={14} className="text-primary" /> {t("filters")}
            </div>

            {/* Brand Filter */}
            <FilterDropdown
              title={t("brand")}
              activeCount={brandFilters.length}
            >
              <div className="space-y-1">
                {availableBrands.map((brand) => (
                  <FilterCheckbox
                    key={brand}
                    label={brand}
                    checked={brandFilters.includes(brand)}
                    onChange={() => toggleFilter(setBrandFilters, brand)}
                  />
                ))}
              </div>
            </FilterDropdown>

            {/* Price Filter */}
            <FilterDropdown
              title={t("price_range")}
              activeCount={priceRange < 10000 ? 1 : 0}
            >
              <div className="px-2 py-2">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-background rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-text mt-3 font-mono font-bold text-sm flex justify-between">
                  <span>0</span>
                  <span>
                    {priceRange} {t("currency")}
                  </span>
                </div>
              </div>
            </FilterDropdown>

            {/* Clear Button */}
            {(brandFilters.length > 0 ||
              featureFilters.length > 0 ||
              priceRange < 10000) && (
              <button
                onClick={clearAllFilters}
                className="text-red-500 hover:text-white hover:bg-red-500/80 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-red-500/20 flex items-center gap-2 active:scale-95"
              >
                <X size={14} /> {t("clear_filters")}
              </button>
            )}

            <div className="grow"></div>

            {/* More Filters Toggle */}
            <button
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all text-xs font-black uppercase tracking-wider
                ${
                  showMoreFilters || featureFilters.length > 0
                    ? "bg-primary text-black border-primary shadow-lg shadow-primary/20"
                    : "bg-background border-border text-subtext hover:border-primary/50 hover:text-text"
                }`}
            >
              <SlidersHorizontal size={14} />
              {showMoreFilters ? t("less_filters") : t("more_filters")}
              {featureFilters.length > 0 && (
                <span className="bg-black/20 text-black text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {featureFilters.length}
                </span>
              )}
            </button>
          </div>

          {/* Secondary Row (Features) */}
          {showMoreFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-background/50 rounded-2xl border border-border overflow-hidden"
            >
              {Object.entries(featureGroups).map(
                ([group, features]: [string, string[]]) => (
                  <div key={group} className="space-y-4">
                    <h4 className="text-[10px] font-black text-subtext uppercase tracking-widest flex items-center gap-2 opacity-60">
                      {getGroupIcon(group)}
                      {t(`feature_groups.${group}`) || t("features")}
                    </h4>
                    <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                      {features.map((feat) => (
                        <FilterCheckbox
                          key={feat}
                          label={feat}
                          checked={featureFilters.includes(feat)}
                          onChange={() => toggleFilter(setFeatureFilters, feat)}
                        />
                      ))}
                    </div>
                  </div>
                ),
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* MOBILE FLOATING FILTER BUTTON */}
      <div className="md:hidden">
        {/* Floating Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`fixed bottom-6 left-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center
            ${showFilters ? "bg-red-500 rotate-90" : "bg-primary text-black hover:scale-105"}`}
        >
          {showFilters ? (
            <X size={24} className="text-white" />
          ) : (
            <Filter size={24} />
          )}
        </button>

        {/* Mobile Drop-up Menu */}
        {showFilters && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
              onClick={() => setShowFilters(false)}
            />

            {/* Menu Container */}
            <div className="fixed bottom-24 right-4 w-80 max-w-[calc(100vw-2rem)] bg-surface border border-border rounded-2xl shadow-2xl z-50 flex flex-col max-h-[70vh] animate-fade-in-up origin-bottom-right overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-border bg-surface sticky top-0 z-10 flex justify-between items-center">
                <h3 className="font-bold text-lg text-text flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-primary" />
                  {t("filters")}
                </h3>
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-red-500 hover:underline"
                >
                  {t("clear_filters")}
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto p-4 space-y-4">
                {/* Category */}
                <MobileFilterSection title={t("category")}>
                  {categories.map((cat) => (
                    <FilterCheckbox
                      key={cat}
                      label={t(`categories.${cat}`) || cat}
                      checked={categoryFilters.includes(cat)}
                      onChange={() => toggleFilter(setCategoryFilters, cat)}
                    />
                  ))}
                </MobileFilterSection>

                {/* Price */}
                <div className="border-b border-border/50 pb-4">
                  <h4 className="font-bold text-text mb-2 text-sm">
                    {t("price_range")}
                  </h4>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-primary h-1.5 bg-background rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs font-bold text-subtext mt-2">
                    <span>0</span>
                    <span>
                      {priceRange} {t("currency")}
                    </span>
                  </div>
                </div>

                {/* Brand */}
                <MobileFilterSection title={t("brand")}>
                  {availableBrands.map((brand) => (
                    <FilterCheckbox
                      key={brand}
                      label={brand}
                      checked={brandFilters.includes(brand)}
                      onChange={() => toggleFilter(setBrandFilters, brand)}
                    />
                  ))}
                </MobileFilterSection>

                {/* Features */}
                {Object.entries(featureGroups).map(
                  ([group, features]: [string, string[]]) => (
                    <MobileFilterSection
                      key={group}
                      title={t(`feature_groups.${group}`) || t("features")}
                    >
                      {features.map((feat) => (
                        <FilterCheckbox
                          key={feat}
                          label={feat}
                          checked={featureFilters.includes(feat)}
                          onChange={() => toggleFilter(setFeatureFilters, feat)}
                        />
                      ))}
                    </MobileFilterSection>
                  ),
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Product Grid */}
      <div className="min-h-[50vh]">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-surface rounded-3xl border border-border border-dashed text-center">
            <div className="bg-background p-6 rounded-full mb-4">
              <Filter size={48} className="text-subtext" />
            </div>
            <h3 className="text-xl font-bold text-text mb-2">
              {t("no_results")}
            </h3>
            <p className="text-subtext max-w-md mx-auto mb-6">
              {t("no_results_hint")}
            </p>
            <button
              onClick={clearAllFilters}
              className="text-primary font-bold hover:underline"
            >
              {t("clear_filters")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
