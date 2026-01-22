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
  Info
} from "lucide-react";
import toast from "react-hot-toast";

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
    localStorage.removeItem("bundle_selection");
  };

  const renderSelectionStep = (
    stepNumber: number,
    title: string,
    icon: React.ReactNode,
    items: Product[],
    selected: Product | null,
    onSelect: (p: Product) => void,
  ) => (
    <div className="mb-8 animate-fade-in-up" style={{ animationDelay: `${stepNumber * 100}ms` }}>
      <div className="flex items-center gap-3 mb-4 border-b border-border pb-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${selected ? "bg-green-500 text-white" : "bg-primary text-black"}`}>
          {selected ? <Check size={16} /> : stepNumber}
        </div>
        <h3 className="text-xl font-bold text-text flex items-center gap-2">
          {icon} {title}
        </h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            className={`cursor-pointer rounded-xl border p-3 transition-all relative group
              ${selected?.id === item.id 
                ? "bg-primary/5 border-primary shadow-sm ring-1 ring-primary" 
                : "bg-surface border-border hover:border-primary/50 hover:shadow-md"}`}
          >
            {selected?.id === item.id && (
              <div className="absolute top-2 right-2 bg-primary text-black rounded-full p-1 z-10 shadow-sm">
                <Check size={12} strokeWidth={3} />
              </div>
            )}
            
            <div className="aspect-square bg-white rounded-lg mb-3 p-2 flex items-center justify-center overflow-hidden">
              <LazyImage
                src={item.image}
                alt={item.name[lang]}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <div className="font-bold text-text text-sm line-clamp-2 mb-1 min-h-[2.5em]">
              {item.name[lang]}
            </div>
            
            <div className="text-primary font-bold">
              {item.price} {t("currency")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-text mb-2 flex items-center gap-3">
             <Package size={36} className="text-primary" />
             {t("bundle.title")}
          </h1>
          <p className="text-subtext max-w-2xl">{t("bundle.subtitle")}</p>
        </div>
        <button
          onClick={clearBundle}
          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold border border-transparent hover:border-red-500/20"
        >
          <Trash2 size={16} /> {t("clear_selection")}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative">
        {/* Left: Steps */}
        <div className="grow space-y-8">
          {renderSelectionStep(
            1,
            t("categories.receivers"),
            <Tv className="text-primary" />,
            receivers,
            receiver,
            setReceiver,
          )}
          {renderSelectionStep(
            2,
            t("categories.accessories"),
            <Disc className="text-primary" />,
            accessories,
            lnb,
            setLnb,
          )}
          {renderSelectionStep(
            3,
            t("categories.cables"),
            <Wifi className="text-primary" />,
            cables,
            cable,
            setCable,
          )}
          {renderSelectionStep(
            4,
            t("categories.servers"),
            <Server className="text-primary" />,
            servers,
            server,
            setServer,
          )}
        </div>

        {/* Right: Summary Sidebar */}
        <div className="lg:w-96 shrink-0">
          <div className="bg-surface rounded-2xl border border-border p-6 sticky top-24 shadow-xl transition-all">
            <h3 className="text-xl font-bold text-text mb-6 border-b border-border pb-4 flex items-center justify-between">
              {t("bundle.summary")}
              {isComplete && <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-full">{t("discount")} 10%</span>}
            </h3>

            {/* Selected Items List */}
            <div className="space-y-4 mb-6">
              {/* Receiver */}
              <div className="flex justify-between items-center group">
                <div className="flex items-center gap-3 overflow-hidden">
                   <div className="w-8 h-8 rounded bg-background flex items-center justify-center text-subtext shrink-0">
                      <Tv size={14} />
                   </div>
                   <div className="flex flex-col overflow-hidden">
                      <span className="text-xs text-subtext">{t("categories.receivers")}</span>
                      <span className={`text-sm font-medium truncate ${receiver ? "text-text" : "text-subtext/50 italic"}`}>
                        {receiver ? receiver.name[lang] : t("bundle.incomplete")}
                      </span>
                   </div>
                </div>
                <span className="text-text font-mono font-bold shrink-0">
                  {receiver ? receiver.price : "--"}
                </span>
              </div>

              {/* LNB */}
              <div className="flex justify-between items-center group">
                <div className="flex items-center gap-3 overflow-hidden">
                   <div className="w-8 h-8 rounded bg-background flex items-center justify-center text-subtext shrink-0">
                      <Disc size={14} />
                   </div>
                   <div className="flex flex-col overflow-hidden">
                      <span className="text-xs text-subtext">{t("categories.accessories")}</span>
                      <span className={`text-sm font-medium truncate ${lnb ? "text-text" : "text-subtext/50 italic"}`}>
                        {lnb ? lnb.name[lang] : t("bundle.incomplete")}
                      </span>
                   </div>
                </div>
                <span className="text-text font-mono font-bold shrink-0">
                  {lnb ? lnb.price : "--"}
                </span>
              </div>

              {/* Cable */}
              <div className="flex justify-between items-center group">
                <div className="flex items-center gap-3 overflow-hidden">
                   <div className="w-8 h-8 rounded bg-background flex items-center justify-center text-subtext shrink-0">
                      <Wifi size={14} />
                   </div>
                   <div className="flex flex-col overflow-hidden">
                      <span className="text-xs text-subtext">{t("categories.cables")}</span>
                      <span className={`text-sm font-medium truncate ${cable ? "text-text" : "text-subtext/50 italic"}`}>
                        {cable ? cable.name[lang] : t("bundle.incomplete")}
                      </span>
                   </div>
                </div>
                <span className="text-text font-mono font-bold shrink-0">
                  {cable ? cable.price : "--"}
                </span>
              </div>

              {/* Server */}
              <div className="flex justify-between items-center group">
                <div className="flex items-center gap-3 overflow-hidden">
                   <div className="w-8 h-8 rounded bg-background flex items-center justify-center text-subtext shrink-0">
                      <Server size={14} />
                   </div>
                   <div className="flex flex-col overflow-hidden">
                      <span className="text-xs text-subtext">{t("categories.servers")}</span>
                      <span className={`text-sm font-medium truncate ${server ? "text-text" : "text-subtext/50 italic"}`}>
                        {server ? server.name[lang] : t("bundle.incomplete")}
                      </span>
                   </div>
                </div>
                <span className="text-text font-mono font-bold shrink-0">
                  {server ? server.price : "--"}
                </span>
              </div>
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
              <div className="flex justify-between items-end mt-4 pt-2 border-t border-border/50">
                 <span className="text-text font-bold text-lg">{t("total")}</span>
                 <div className="text-3xl font-bold text-primary">
                    {finalPrice} <span className="text-base font-normal text-subtext">{t("currency")}</span>
                 </div>
              </div>
            </div>

            {/* Action */}
            <button
              onClick={handleAddBundle}
              disabled={!isComplete}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-lg
                ${isComplete 
                  ? "bg-primary text-black hover:bg-white hover:shadow-primary/30" 
                  : "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed shadow-none"}`}
            >
              <ShoppingCart size={20} /> {t("bundle.add_all")}
            </button>
            
            {!isComplete && (
              <div className="flex items-start gap-2 mt-4 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 p-3 rounded-lg text-xs leading-relaxed">
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