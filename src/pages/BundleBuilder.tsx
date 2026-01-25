import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useData } from "../store/DataContext";
import { useCart } from "../store/StoreContext";
import { Product } from "../types";
import LazyImage from "../components/LazyImage";
import {
  Tv,
  Server,
  Wifi,
  Disc,
  ShoppingCart,
  Check,
  Trash2,
  Package,
  Info,
  ChevronDown
} from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const BundleBuilder: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { products } = useData();
  const { addToCart } = useCart();
  const lang = i18n.language as "ar" | "en";

  const [receiver, setReceiver] = useState<Product | null>(null);
  const [lnb, setLnb] = useState<Product | null>(null);
  const [cable, setCable] = useState<Product | null>(null);
  const [server, setServer] = useState<Product | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bundle_selection");
      if (saved && products.length > 0) {
        const parsed = JSON.parse(saved);
        if (parsed.receiver)
          setReceiver(products.find((p) => p.id === parsed.receiver) || null);
        if (parsed.lnb)
          setLnb(products.find((p) => p.id === parsed.lnb) || null);
        if (parsed.cable)
          setCable(products.find((p) => p.id === parsed.cable) || null);
        if (parsed.server)
          setServer(products.find((p) => p.id === parsed.server) || null);
      }
    } catch (e) {
      console.error("Error loading bundle", e);
    }
    setLoaded(true);
  }, [products]);

  // Save to LocalStorage
  useEffect(() => {
    if (!loaded) return;
    const selection = {
      receiver: receiver?.id,
      lnb: lnb?.id,
      cable: cable?.id,
      server: server?.id,
    };
    localStorage.setItem("bundle_selection", JSON.stringify(selection));
  }, [receiver, lnb, cable, server, loaded]);

  const receivers = products.filter((p) => p.category === "receivers");
  const accessories = products.filter((p) => p.category === "accessories");
  const cables = products.filter((p) => p.category === "cables");
  const servers = products.filter((p) => p.category === "servers");

  const totalPrice =
    (receiver?.price || 0) +
    (lnb?.price || 0) +
    (cable?.price || 0) +
    (server?.price || 0);
  const discount = Math.round(totalPrice * 0.1);
  const finalPrice = totalPrice - discount;
  const isComplete = receiver && lnb && cable && server;

  const handleAddBundle = () => {
    if (receiver) addToCart(receiver);
    if (lnb) addToCart(lnb);
    if (cable) addToCart(cable);
    if (server) addToCart(server);

    toast.success(t("bundle.added_success"));
  };

  const clearBundle = () => {
    setReceiver(null);
    setLnb(null);
    setCable(null);
    setServer(null);
    setActiveStep(1);
    localStorage.removeItem("bundle_selection");
  };

  const handleSelect = (item: Product, setFn: (p: Product) => void, step: number) => {
    setFn(item);
    if (step < 4) {
      setTimeout(() => setActiveStep(step + 1), 300);
    }
  };

  const renderSelectionStep = (
    stepNumber: number,
    title: string,
    icon: React.ReactNode,
    items: Product[],
    selected: Product | null,
    setFn: (p: Product) => void,
  ) => {
    const isActive = activeStep === stepNumber;
    const isCompleted = !!selected;

    return (
      <div className={`mb-4 rounded-3xl border transition-all overflow-hidden ${isActive ? 'bg-surface border-primary shadow-lg ring-1 ring-primary/20' : 'bg-surface/50 border-border hover:border-primary/30'}`}>
        <button 
          onClick={() => setActiveStep(isActive ? 0 : stepNumber)}
          className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-300 ${isCompleted ? 'bg-green-500 text-white shadow-green-500/20 shadow-lg' : isActive ? 'bg-primary text-black shadow-primary/20 shadow-lg' : 'bg-background text-subtext border border-border'}`}>
              {isCompleted ? <Check size={20} /> : stepNumber}
            </div>
            <div>
              <h3 className={`text-xl font-bold transition-colors ${isActive ? 'text-primary' : 'text-text'}`}>
                <span className="flex items-center gap-2">{icon} {title}</span>
              </h3>
              {selected && !isActive && (
                <p className="text-sm text-text/70 font-medium mt-1 pl-1 border-l-2 border-primary/20">{selected.name[lang]}</p>
              )}
            </div>
          </div>
          <div className={`transition-transform duration-300 text-subtext ${isActive ? 'rotate-180 text-primary' : ''}`}>
            <ChevronDown size={24} />
          </div>
        </button>
        
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="px-6 pb-6 border-t border-border/50 pt-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item, setFn, stepNumber)}
                      className={`cursor-pointer rounded-2xl border p-3 transition-all relative group
                        ${selected?.id === item.id 
                          ? "bg-primary/5 border-primary shadow-md ring-1 ring-primary" 
                          : "bg-background border-border hover:border-primary/50 hover:shadow-lg hover:-translate-y-1"}`}
                    >
                      {selected?.id === item.id && (
                        <div className="absolute top-2 right-2 bg-primary text-black rounded-full p-1 z-10 shadow-sm animate-scale-in">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                      
                      <div className="aspect-square bg-white rounded-xl mb-3 p-4 flex items-center justify-center overflow-hidden">
                        <LazyImage
                          src={item.image}
                          alt={item.name[lang]}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      
                      <div className="font-bold text-text text-sm line-clamp-2 mb-2 min-h-[2.5em] leading-tight">
                        {item.name[lang]}
                      </div>
                      
                      <div className="text-primary font-black text-lg">
                        {item.price} <span className="text-xs font-normal text-subtext">{t("currency")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      {/* Header */}
      <div className="bg-surface/50 backdrop-blur-md border border-border rounded-3xl p-8 mb-10 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
           <Package size={200} />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl mb-4 text-primary">
               <Package size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-text mb-2">
               {t("bundle.title")}
            </h1>
            <p className="text-subtext text-lg max-w-xl leading-relaxed">
               {t("bundle.subtitle")}
            </p>
          </div>
          
          <button
            onClick={clearBundle}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-red-500 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all font-medium text-sm hover:shadow-md active:scale-95"
          >
            <Trash2 size={18} /> 
            <span>{t("clear_selection")}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative">
        {/* Left: Steps Accordion */}
        <div className="grow">
          {renderSelectionStep(
            1,
            t("categories.receivers"),
            <Tv size={20} />,
            receivers,
            receiver,
            setReceiver,
          )}
          {renderSelectionStep(
            2,
            t("categories.accessories"),
            <Disc size={20} />,
            accessories,
            lnb,
            setLnb,
          )}
          {renderSelectionStep(
            3,
            t("categories.cables"),
            <Wifi size={20} />,
            cables,
            cable,
            setCable,
          )}
          {renderSelectionStep(
            4,
            t("categories.servers"),
            <Server size={20} />,
            servers,
            server,
            setServer,
          )}
        </div>

        {/* Right: Summary Sidebar */}
        <div className="lg:w-96 shrink-0">
          <div className="bg-surface/80 backdrop-blur-xl rounded-4xl border border-border p-6 sticky top-24 shadow-2xl transition-all">
            <h3 className="text-xl font-bold text-text mb-6 border-b border-border pb-4 flex items-center justify-between">
              {t("bundle.summary")}
              {isComplete && <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-full font-bold border border-green-500/20">{t("discount")} 10%</span>}
            </h3>

            {/* Selected Items List */}
            <div className="space-y-4 mb-6">
              {[
                { label: t("categories.receivers"), icon: <Tv size={14} />, item: receiver },
                { label: t("categories.accessories"), icon: <Disc size={14} />, item: lnb },
                { label: t("categories.cables"), icon: <Wifi size={14} />, item: cable },
                { label: t("categories.servers"), icon: <Server size={14} />, item: server }
              ].map((row, idx) => (
                <div key={idx} className="flex justify-between items-center group">
                  <div className="flex items-center gap-3 overflow-hidden">
                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${row.item ? 'bg-primary/10 text-primary' : 'bg-background text-subtext'}`}>
                        {row.icon}
                     </div>
                     <div className="flex flex-col overflow-hidden">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-subtext">{row.label}</span>
                        <span className={`text-sm font-medium truncate ${row.item ? "text-text" : "text-subtext/50 italic"}`}>
                          {row.item ? row.item.name[lang] : t("bundle.incomplete")}
                        </span>
                     </div>
                  </div>
                  <span className="text-text font-mono font-bold shrink-0">
                    {row.item ? row.item.price : "--"}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-border pt-4 mb-6 space-y-2">
              <div className="flex justify-between text-subtext text-sm">
                <span>{t("subtotal")}</span>
                <span>
                  {totalPrice} {t("currency")}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-500 font-bold text-sm">
                  <span>{t("discount")} (10%)</span>
                  <span>
                    -{discount} {t("currency")}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-end mt-4 pt-4 border-t border-border/50">
                 <span className="text-text font-black text-lg">{t("total")}</span>
                 <div className="text-3xl font-black text-primary">
                    {finalPrice} <span className="text-sm font-bold text-subtext">{t("currency")}</span>
                 </div>
              </div>
            </div>

            {/* Action */}
            <button
              onClick={handleAddBundle}
              disabled={!isComplete}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all transform shadow-lg
                ${isComplete 
                  ? "bg-primary text-black hover:bg-white hover:shadow-primary/30 active:scale-95" 
                  : "bg-background text-subtext border border-border cursor-not-allowed shadow-none opacity-50"}`}
            >
              <ShoppingCart size={20} /> {t("bundle.add_all")}
            </button>
            
            {!isComplete && (
              <div className="flex items-start gap-2 mt-4 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 p-3 rounded-xl text-xs font-medium leading-relaxed border border-yellow-500/20">
                 <Info size={16} className="shrink-0 mt-0.5" />
                 {t("bundle.incomplete")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundleBuilder;