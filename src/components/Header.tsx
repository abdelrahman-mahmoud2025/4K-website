import React, { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ShoppingCart,
  Menu,
  X,
  Search,
  Heart,
  Sun,
  Moon,
  ChevronDown,
  Globe,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, useWishlist } from "../store/StoreContext";
import { useData } from "../store/DataContext";
import { useTheme } from "../store/ThemeContext";
import LazyImage from "./LazyImage";
import { getCategoryInfo } from "../data/categoryConfig";

// ────────────────────────────────────────────────
// Helpers / Sub-components
// ────────────────────────────────────────────────

const NavLink = ({
  to,
  label,
  isActive,
  children = null,
  ...props
}: {
  to: string;
  label: string;
  isActive: boolean;
  children?: React.ReactNode;
  [key: string]: any;
}) => (
  <Link
    to={to}
    className={`text-xs font-bold uppercase tracking-wide relative group transition-colors ${
      isActive ? "text-primary" : "text-text/80 hover:text-primary"
    }`}
    {...props}
  >
    {label}
    <span
      className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
        isActive ? "w-full" : "w-0 group-hover:w-full"
      }`}
    />
    {children}
  </Link>
);

const DropdownButton = ({
  label,
  isOpen,
  onClick,
}: {
  label: string;
  isOpen: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1 text-xs font-bold uppercase tracking-wide transition-colors ${
      isOpen ? "text-primary" : "text-text/80 hover:text-primary"
    }`}
  >
    {label}
    <ChevronDown
      size={14}
      className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
    />
  </button>
);

const SuggestionSection = ({
  title,
  items,
  renderItem,
  onClose,
}: {
  title: string;
  items: any[];
  renderItem: (item: any) => React.ReactNode;
  onClose?: () => void;
}) =>
  items?.length > 0 && (
    <div className="p-2 border-b border-border/50 last:border-0">
      <div className="text-[10px] font-bold text-subtext uppercase px-3 py-1">
        {title}
      </div>
      {items.map(renderItem)}
    </div>
  );

// ────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────

const Header = () => {
  const { t, i18n } = useTranslation();
  const { items: cartItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { search, products } = useData();
  const { isDark, toggleTheme } = useTheme();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState({
    products: [],
    feeds: [],
    pages: [],
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const lang = i18n.language;
  const isArabic = lang === "ar";

  // Dynamic categories & shop dropdown
  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))],
    [products],
  );

  const shopItems = useMemo(
    () => [
      { to: "/shop", label: isArabic ? "عرض الكل" : "View All" },
      ...categories.map((cat) => {
        const info = getCategoryInfo(cat);
        return {
          to: `/shop?category=${cat}`,
          label: info.name[isArabic ? "ar" : "en"],
        };
      }),
    ],
    [categories, isArabic],
  );

  const navConfig = [
    { to: "/", label: "home" },
    {
      label: "shop",
      dropdown: shopItems.map((item) => ({ ...item, isTranslated: true })),
    },
    { to: "/offers", label: "offers" },
    {
      label: "tools",
      dropdown: [
        { to: "/patcher", label: "patcher" },
        { to: "/feeds", label: "feeds" },
        { to: "/downloads", label: "downloads" },
        { to: "/bundle", label: "bundle" },
      ],
    },
    { to: "/branches", label: "branches.tab_branches" },
    { to: "/about", label: "about_me" },
  ];

  // ─── Effects ─────────────────────────────────────

  useEffect(() => {
    document.title = t("app_title");
  }, [t, lang]);

  useEffect(() => {
    setIsMenuOpen(false);
    setShowMobileSearch(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length < 2) {
        setShowSuggestions(false);
        return;
      }
      const res = search(searchQuery);
      setSuggestions({
        products: res.products.slice(0, 3),
        feeds: res.feeds.slice(0, 2),
        pages: res.pages?.slice(0, 2) ?? [],
      });
      setShowSuggestions(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, search]);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ─── Handlers ────────────────────────────────────

  const toggleLang = () => i18n.changeLanguage(isArabic ? "en" : "ar");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    setShowSuggestions(false);
    setShowMobileSearch(false);
    setIsMenuOpen(false);
  };

  const SuggestionItem = (item) => (
    <Link
      key={item.id ?? item.to}
      to={item.path ?? item.to ?? `/product/${item.id}`}
      onClick={() => {
        setShowSuggestions(false);
        setShowMobileSearch(false);
      }}
      className="flex items-center gap-3 p-2 hover:bg-background rounded-lg transition-colors group"
    >
      {item.image ? (
        <div className="w-8 h-8 bg-background border border-border rounded p-0.5 shrink-0">
          <LazyImage
            src={item.image}
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        <div className="w-8 h-8 bg-background border border-border rounded p-0.5 shrink-0 flex items-center justify-center">
          <ArrowRight size={14} className="text-primary" />
        </div>
      )}
      <div className="grow min-w-0">
        <div className="text-text text-sm font-medium truncate group-hover:text-primary">
          {item.title?.[isArabic ? "ar" : "en"] ??
            item.name?.[isArabic ? "ar" : "en"] ??
            item.label}
        </div>
      </div>
      {item.price && (
        <div className="text-primary font-bold text-xs whitespace-nowrap">
          {item.price} <span className="text-[9px]">{t("currency")}</span>
        </div>
      )}
    </Link>
  );

  // ─── Render ──────────────────────────────────────

  const toggleIcon = isDark ? <Sun size={18} /> : <Moon size={18} />;
  const langText = isArabic ? "EN" : "عربي";

  return (
    <header
      dir="ltr"
      className="bg-surface/95 backdrop-blur-md sticky top-0 z-50 border-b border-border shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Mobile menu btn */}
          <button
            className="lg:hidden text-text hover:text-primary p-1"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu />
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-primary flex items-center gap-1 italic tracking-tighter hover:opacity-90"
          >
            <span className="text-text">4K</span>
            <span>STORE</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navConfig.map((item, i) => {
              const isActive = location.pathname === item.to;
              const label = t(item.label);

              return (
                <div
                  key={i}
                  className="relative group"
                  onMouseEnter={() =>
                    item.dropdown && setActiveDropdown(item.label)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.dropdown ? (
                    <DropdownButton
                      label={label}
                      isOpen={activeDropdown === item.label}
                    />
                  ) : (
                    <NavLink to={item.to} label={label} isActive={isActive} />
                  )}

                  <AnimatePresence>
                    {item.dropdown && activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-xl z-50"
                      >
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.to}
                            to={sub.to}
                            className="block px-4 py-3 text-sm font-medium text-text hover:bg-primary/10 hover:text-primary border-b border-border/50 last:border-0"
                          >
                            {sub.isTranslated ? sub.label : t(sub.label)}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Desktop Search */}
          <div className="hidden md:block grow max-w-xl mx-4" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder={t("search_placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background text-text text-sm rounded-full pl-10 pr-10 py-2 border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 shadow-inner placeholder-subtext"
              />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-subtext"
                size={12}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-subtext hover:text-text"
                >
                  <X size={14} />
                </button>
              )}
            </form>

            <AnimatePresence>
              {showSuggestions &&
                (suggestions.products.length || suggestions.pages.length) && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute w-full bg-surface border border-border rounded-xl shadow-2xl z-50 mt-2 overflow-hidden"
                  >
                    <SuggestionSection
                      title="Pages"
                      items={suggestions.pages}
                      renderItem={SuggestionItem}
                    />
                    <SuggestionSection
                      title={t("shop")}
                      items={suggestions.products}
                      renderItem={SuggestionItem}
                    />

                    <div
                      className="bg-primary/10 p-2 text-center text-primary text-xs font-bold cursor-pointer hover:bg-primary/20"
                      onClick={handleSearch}
                    >
                      {t("view_all_results")}
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden"
              onClick={() => setShowMobileSearch((v) => !v)}
            >
              <Search size={22} className="text-text/80 hover:text-primary" />
            </button>

            <Link to="/wishlist" className="relative hidden md:block">
              <Heart
                size={22}
                className="text-text/80 hover:text-primary group-hover:scale-110 transition-transform"
              />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] h-4 w-4 rounded-full flex items-center justify-center animate-bounce-short">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <button
              onClick={toggleTheme}
              className="hidden sm:block p-1.5 rounded-full hover:bg-background"
            >
              {toggleIcon}
            </button>

            <button
              onClick={toggleLang}
              className="hidden sm:block text-xs font-bold border border-border px-2 py-1 rounded hover:border-primary"
            >
              {langText}
            </button>

            <Link to="/cart" className="relative">
              <ShoppingCart
                size={22}
                className="text-text/80 hover:text-primary group-hover:scale-110 transition-transform"
              />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-secondary text-white text-[9px] h-4 w-4 rounded-full flex items-center justify-center animate-bounce-short">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="md:hidden border-t border-border bg-surface overflow-hidden"
          >
            <div className="p-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("search_placeholder")}
                  className="w-full bg-background text-text rounded-xl px-4 py-3 border border-border focus:border-primary shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    if (!searchQuery) setShowMobileSearch(false);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-subtext hover:text-primary"
                >
                  {searchQuery ? <X size={18} /> : <Search size={18} />}
                </button>
              </form>

              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 bg-background/50 border border-border rounded-xl shadow-lg overflow-hidden"
                  >
                    <SuggestionSection
                      title="Pages"
                      items={suggestions.pages}
                      renderItem={SuggestionItem}
                    />
                    <SuggestionSection
                      title={t("shop")}
                      items={suggestions.products}
                      renderItem={SuggestionItem}
                    />

                    <div
                      className="bg-primary/10 p-3 text-center text-primary text-xs font-bold cursor-pointer hover:bg-primary/20"
                      onClick={handleSearch}
                    >
                      {t("view_all_results")}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer – keep almost same logic but cleaner */}
      {createPortal(
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-99 lg:hidden"
                onClick={() => setIsMenuOpen(false)}
              />

              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 220 }}
                className="fixed inset-y-0 left-0 w-[85%] max-w-xs bg-surface z-100 shadow-2xl flex flex-col lg:hidden"
              >
                {/* Header */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <Link
                    to="/"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-xl font-bold text-primary italic"
                  >
                    <span className="text-text">4K</span>
                    <span>STORE</span>
                  </Link>
                  <button onClick={() => setIsMenuOpen(false)}>
                    <X size={24} />
                  </button>
                </div>

                {/* Links */}
                <div className="flex-1 overflow-y-auto p-4">
                  {navConfig.map((item, i) =>
                    item.dropdown ? (
                      <div key={i} className="border-b border-border/40">
                        <button
                          onClick={() =>
                            setMobileSubmenu((v) =>
                              v === item.label ? null : item.label,
                            )
                          }
                          className={`w-full flex justify-between items-center px-3 py-3 rounded-lg font-medium ${
                            mobileSubmenu === item.label
                              ? "text-primary bg-primary/5"
                              : "hover:bg-background"
                          }`}
                        >
                          <span className="uppercase text-sm tracking-wide">
                            {t(item.label)}
                          </span>
                          <ChevronDown
                            size={16}
                            className={`transition-transform ${mobileSubmenu === item.label ? "rotate-180" : ""}`}
                          />
                        </button>

                        <AnimatePresence>
                          {mobileSubmenu === item.label && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-6 pr-4 py-2 space-y-1">
                                {item.dropdown.map((sub) => (
                                  <Link
                                    key={sub.to}
                                    to={sub.to}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block px-3 py-2.5 rounded-md text-sm ${
                                      location.pathname === sub.to
                                        ? "text-primary bg-primary/10 font-bold"
                                        : "text-text/70 hover:text-primary hover:bg-background"
                                    }`}
                                  >
                                    {sub.isTranslated
                                      ? sub.label
                                      : t(sub.label)}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        key={i}
                        to={item.to}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex justify-between items-center px-3 py-3 rounded-lg border-b border-border/40 font-medium ${
                          location.pathname === item.to
                            ? "text-primary bg-primary/5"
                            : "hover:bg-background"
                        }`}
                      >
                        <span className="uppercase text-sm tracking-wide">
                          {t(item.label)}
                        </span>
                        <ArrowRight
                          size={16}
                          className={
                            location.pathname === item.to
                              ? "text-primary"
                              : "opacity-50"
                          }
                        />
                      </Link>
                    ),
                  )}

                  <Link
                    to="/wishlist"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:text-primary hover:bg-background border-b border-border/40"
                  >
                    <Heart size={18} />
                    <span className="uppercase text-sm tracking-wide">
                      {t("wishlist")}
                    </span>
                  </Link>
                </div>

                {/* Footer buttons */}
                <div className="p-4 border-t border-border bg-background/50 flex gap-3">
                  <button
                    onClick={toggleTheme}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-primary hover:text-primary"
                  >
                    {toggleIcon}
                    <span className="text-xs font-bold">
                      {isDark ? "Light" : "Dark"}
                    </span>
                  </button>
                  <button
                    onClick={toggleLang}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-primary hover:text-primary"
                  >
                    <Globe size={18} />
                    <span className="text-xs font-bold">
                      {langText === "EN" ? "English" : "عربي"}
                    </span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </header>
  );
};

export default Header;
