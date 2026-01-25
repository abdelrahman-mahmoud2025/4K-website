import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ShoppingCart,
  Menu,
  X,
  Search,
  Heart,
  ArrowRight,
  Sun,
  Moon,
  ChevronDown,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, useWishlist } from "../store/StoreContext";
import { useData } from "../store/DataContext";
import { useTheme } from "../store/ThemeContext";
import LazyImage from "./LazyImage";

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { items } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { search } = useData();
  const { isDark, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any>({
    products: [],
    feeds: [],
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    document.title = t("app_title");
  }, [t, i18n.language]);

  useEffect(() => {
    setShowMobileSearch(false);
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideDesktop = searchRef.current && !searchRef.current.contains(target);
      const isOutsideMobile = mobileSearchRef.current && !mobileSearchRef.current.contains(target);

      if (isOutsideDesktop && isOutsideMobile) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length > 1) {
        const results = search(searchQuery);
        setSuggestions({
          products: results.products.slice(0, 3),
          feeds: results.feeds.slice(0, 2),
          pages: results.pages.slice(0, 2),
        });
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, search]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const toggleLang = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
      setIsMenuOpen(false);
    }
  };

  const toggleMobileSubmenu = (label: string) => {
    setMobileSubmenuOpen(mobileSubmenuOpen === label ? null : label);
  };

  // Navigation Configuration
  const navItems = [
    { to: "/", label: "home" },
    { to: "/shop", label: "shop" },
    { to: "/offers", label: "offers" },
    { 
      label: "tools",
      dropdown: [
        { to: "/patcher", label: "patcher" },
        { to: "/feeds", label: "feeds" },
        { to: "/downloads", label: "downloads" },
        { to: "/bundle", label: "bundle" },
      ]
    },
    { to: "/branches", label: "branches.tab_branches" },
    { to: "/about", label: "about_me" },
  ];

  return (
    <header dir="ltr" className="bg-surface/95 backdrop-blur-md sticky top-0 z-50 border-b border-border transition-all duration-300 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <button
            className="lg:hidden text-text hover:text-primary transition-colors p-1"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open Menu"
          >
            <Menu />
          </button>

          <Link
            to="/"
            className="text-2xl font-bold text-primary flex items-center gap-1 italic tracking-tighter hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            <span className="text-text">4K</span>
            <span>STORE</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item, index) => (
              <div 
                key={index} 
                className="relative group"
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.dropdown ? (
                  <button
                    aria-label={`Open ${t(item.label)} Menu`}
                    className={`flex items-center gap-1 text-xs font-bold uppercase tracking-wide transition-colors cursor-pointer ${activeDropdown === item.label ? "text-primary" : "text-text/80 hover:text-primary"}`}
                  >
                    {t(item.label)}
                    <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === item.label ? "rotate-180" : ""}`} />
                  </button>
                ) : (
                  <Link
                    to={item.to!}
                    className={`text-xs font-bold uppercase tracking-wide relative group transition-colors ${location.pathname === item.to ? "text-primary" : "text-text/80 hover:text-primary"}`}
                  >
                    {t(item.label)}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${location.pathname === item.to ? "w-full" : "w-0 group-hover:w-full"}`}
                    ></span>
                  </Link>
                )}

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {item.dropdown && activeDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-xl overflow-hidden z-50"
                    >
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.to}
                          to={subItem.to}
                          className="block px-4 py-3 text-sm font-medium text-text hover:bg-primary/10 hover:text-primary transition-colors border-b border-border/50 last:border-0"
                        >
                          {t(subItem.label)}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:block grow max-w-xl mx-4" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                placeholder={t("search_placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background text-text text-sm rounded-full pl-10 pr-10 py-2 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all shadow-inner placeholder-subtext"
              />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-subtext group-focus-within:text-primary transition-colors"
                size={16}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setShowSuggestions(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-subtext hover:text-text"
                  aria-label="Clear Search"
                >
                  <X size={14} />
                </button>
              )}
            </form>

            {showSuggestions &&
              (suggestions.products.length > 0 ||
                suggestions.feeds.length > 0 || suggestions.pages?.length > 0) && (
                <div className="absolute w-100 bg-surface border border-border rounded-xl shadow-2xl z-50 mt-2 overflow-hidden animate-fade-in-up">
                  {suggestions.pages?.length > 0 && (
                    <div className="p-2 border-b border-border/50">
                      <div className="text-[10px] font-bold text-subtext uppercase px-3 py-1">
                        Pages
                      </div>
                      {suggestions.pages.map((page: any) => (
                        <Link
                          key={page.id}
                          to={page.path}
                          onClick={() => setShowSuggestions(false)}
                          className="flex items-center gap-3 p-2 hover:bg-background rounded-lg transition-colors group"
                        >
                          <div className="w-8 h-8 bg-background border border-border rounded p-0.5 shrink-0 flex items-center justify-center">
                            <ArrowRight size={14} className="text-primary" />
                          </div>
                          <div className="grow min-w-0">
                            <div className="text-text text-sm font-medium truncate group-hover:text-primary transition-colors">
                              {page.title[i18n.language === "ar" ? "ar" : "en"]}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {suggestions.products.length > 0 && (
                    <div className="p-2">
                      <div className="text-[10px] font-bold text-subtext uppercase px-3 py-1">
                        {t("shop")}
                      </div>
                      {suggestions.products.map((p: any) => (
                        <Link
                          key={p.id}
                          to={`/product/${p.id}`}
                          onClick={() => setShowSuggestions(false)}
                          className="flex items-center gap-3 p-2 hover:bg-background rounded-lg transition-colors group"
                        >
                          <div className="w-8 h-8 bg-background border border-border rounded p-0.5 shrink-0">
                            <LazyImage
                              src={p.image}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="grow min-w-0">
                            <div className="text-text text-sm font-medium truncate group-hover:text-primary transition-colors">
                              {p.name[i18n.language === "ar" ? "ar" : "en"]}
                            </div>
                          </div>
                          <div className="text-primary font-bold text-xs whitespace-nowrap">
                            {p.price}{" "}
                            <span className="text-[9px]">{t("currency")}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  <div
                    className="bg-primary/10 p-2 text-center text-primary text-xs font-bold cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={(e) => handleSearch(e as any)}
                  >
                    {t("view_all_results")}
                  </div>
                </div>
              )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/wishlist"
              className="md:hidden relative text-text/80 hover:text-primary transition-colors group"
            >
              <Heart
                size={22}
                className="group-hover:scale-110 transition-transform"
              />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full animate-bounce-short">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <button
              className="md:hidden text-text/80 hover:text-primary transition-colors p-1"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              aria-label="Toggle Search"
            >
              <Search size={22} />
            </button>

            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full hover:bg-background text-text/80 transition-colors hidden sm:block"
              title={
                isDark ? t("switch_to_light_mode") : t("switch_to_dark_mode")
              }
              aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={toggleLang}
              className="text-xs font-bold text-text/80 hover:text-primary hidden sm:block border border-border px-2 py-1 rounded hover:border-primary transition-all"
              aria-label="Switch Language"
            >
              {i18n.language === "ar" ? "EN" : "عربي"}
            </button>

            <Link
              to="/wishlist"
              className="hidden md:block relative text-text/80 hover:text-primary transition-colors group"
            >
              <Heart
                size={22}
                className="group-hover:scale-110 transition-transform"
              />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full animate-bounce-short">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative text-text/80 hover:text-primary transition-colors group"
            >
              <ShoppingCart
                size={22}
                className="group-hover:scale-110 transition-transform"
              />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-secondary text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full animate-bounce-short">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border bg-surface overflow-hidden"
          >
            <div className="p-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  autoFocus
                  type="text"
                  placeholder={t("search_placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background text-text text-sm rounded-xl px-4 py-3 border border-border focus:border-primary focus:outline-none shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => {
                     setSearchQuery("");
                     if (!searchQuery) setShowMobileSearch(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-subtext hover:text-primary p-1"
                >
                  {searchQuery ? <X size={18} /> : <Search size={18} />}
                </button>
              </form>

              {/* Mobile Suggestions */}
              {showSuggestions &&
                (suggestions.products.length > 0 ||
                  suggestions.feeds.length > 0 || suggestions.pages?.length > 0) && (
                  <div className="mt-2 bg-background/50 border border-border rounded-xl shadow-lg overflow-hidden animate-fade-in-up">
                    {suggestions.pages?.length > 0 && (
                      <div className="p-2 border-b border-border/50">
                        <div className="text-[10px] font-bold text-subtext uppercase px-3 py-1">
                          Pages
                        </div>
                        {suggestions.pages.map((page: any) => (
                          <Link
                            key={page.id}
                            to={page.path}
                            onClick={() => setShowMobileSearch(false)}
                            className="flex items-center gap-3 p-2 hover:bg-surface rounded-lg transition-colors group"
                          >
                            <div className="w-8 h-8 bg-surface border border-border rounded p-0.5 shrink-0 flex items-center justify-center">
                              <ArrowRight size={14} className="text-primary" />
                            </div>
                            <div className="grow min-w-0">
                              <div className="text-text text-sm font-medium truncate group-hover:text-primary transition-colors">
                                {page.title[i18n.language === "ar" ? "ar" : "en"]}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {suggestions.products.length > 0 && (
                      <div className="p-2">
                        <div className="text-[10px] font-bold text-subtext uppercase px-3 py-1">
                          {t("shop")}
                        </div>
                        {suggestions.products.map((p: any) => (
                          <Link
                            key={p.id}
                            to={`/product/${p.id}`}
                            onClick={() => setShowMobileSearch(false)}
                            className="flex items-center gap-3 p-2 hover:bg-surface rounded-lg transition-colors group"
                          >
                            <div className="w-8 h-8 bg-surface border border-border rounded p-0.5 shrink-0">
                              <LazyImage
                                src={p.image}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="grow min-w-0">
                              <div className="text-text text-sm font-medium truncate group-hover:text-primary transition-colors">
                                {p.name[i18n.language === "ar" ? "ar" : "en"]}
                              </div>
                            </div>
                            <div className="text-primary font-bold text-xs whitespace-nowrap">
                              {p.price}{" "}
                              <span className="text-[9px]">{t("currency")}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    <div
                      className="bg-primary/10 p-3 text-center text-primary text-xs font-bold cursor-pointer hover:bg-primary/20 transition-colors"
                      onClick={(e) => handleSearch(e as any)}
                    >
                      {t("view_all_results")}
                    </div>
                  </div>
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      {createPortal(
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-99 lg:hidden"
                onClick={() => setIsMenuOpen(false)}
              />
              
              {/* Drawer Panel */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-surface z-100 shadow-2xl flex flex-col lg:hidden"
              >
                {/* Drawer Header */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <Link
                    to="/"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-xl font-bold text-primary italic tracking-tighter"
                  >
                     <span className="text-text">4K</span>
                     <span>STORE</span>
                  </Link>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-1 text-text hover:text-primary transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Drawer Content */}
                <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                  <div className="flex flex-col gap-1">
                    {navItems.map((item, index) => (
                      <React.Fragment key={index}>
                        {item.dropdown ? (
                          <div className="border-b border-border/40 last:border-0">
                            <button
                              onClick={() => toggleMobileSubmenu(item.label)}
                              className={`w-full flex items-center justify-between px-3 py-3 rounded-lg font-medium transition-colors ${mobileSubmenuOpen === item.label ? "text-primary bg-primary/5" : "text-text hover:bg-background"}`}
                            >
                              <span className="uppercase text-sm tracking-wide">{t(item.label)}</span>
                              <ChevronDown
                                size={16}
                                className={`transition-transform duration-200 ${mobileSubmenuOpen === item.label ? "rotate-180" : ""}`}
                              />
                            </button>
                            
                            <AnimatePresence>
                              {mobileSubmenuOpen === item.label && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="pl-4 pr-2 pb-2 space-y-1">
                                    {item.dropdown.map((subItem) => (
                                      <Link
                                        key={subItem.to}
                                        to={subItem.to}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`block px-3 py-2.5 rounded-md text-sm transition-colors ${location.pathname === subItem.to ? "text-primary bg-primary/10 font-bold" : "text-text/70 hover:text-primary hover:bg-background"}`}
                                      >
                                        {t(subItem.label)}
                                      </Link>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (
                          <Link
                            to={item.to!}
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center justify-between px-3 py-3 rounded-lg font-medium transition-colors border-b border-border/40 last:border-0 ${location.pathname === item.to ? "text-primary bg-primary/5" : "text-text hover:bg-background"}`}
                          >
                            <span className="uppercase text-sm tracking-wide">{t(item.label)}</span>
                            <ArrowRight size={16} className={`opacity-50 ${location.pathname === item.to ? "text-primary opacity-100" : ""}`} />
                          </Link>
                        )}
                      </React.Fragment>
                    ))}
                    
                    <Link
                      to="/wishlist"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg font-medium text-text hover:text-primary hover:bg-background transition-colors border-b border-border/40"
                    >
                      <div className="flex items-center gap-3">
                        <Heart size={18} /> 
                        <span className="uppercase text-sm tracking-wide">{t("wishlist")}</span>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Drawer Footer */}
                <div className="p-4 border-t border-border bg-background/50 flex items-center justify-between gap-4">
                   <button
                    onClick={toggleTheme}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border text-text hover:border-primary hover:text-primary transition-all flex-1 justify-center"
                  >
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    <span className="text-xs font-bold">{isDark ? "Light" : "Dark"}</span>
                  </button>

                  <button
                    onClick={toggleLang}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border text-text hover:border-primary hover:text-primary transition-all flex-1 justify-center"
                  >
                    <Globe size={18} />
                    <span className="text-xs font-bold">{i18n.language === "ar" ? "English" : "عربي"}</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
};

export default Header;