import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Smartphone,
  MessageCircle,
  X,
  Banknote,
  CheckCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useCart } from "../store/StoreContext";
import { Link } from "react-router-dom";
import LazyImage from "../components/LazyImage";
import { motion, AnimatePresence } from "framer-motion";

const Cart: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"instapay" | "cash">(
    "instapay",
  );
  const lang = i18n.language as "ar" | "en";

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag
          size={80}
          className="mx-auto text-subtext mb-6 opacity-50"
        />
        <h2 className="text-2xl font-bold text-text mb-4">{t("cart_empty")}</h2>
        <Link
          to="/shop"
          className="text-primary hover:underline font-bold text-lg"
        >
          {t("shop_now")}
        </Link>
      </div>
    );
  }

  const handleWhatsAppCheckout = () => {
    const phoneNumber = "+201090969040";
    const itemList = items
      .map(
        (i) => `- ${i.name["en"]} x${i.quantity} (${i.price * i.quantity} EGP)`,
      )
      .join("\n");

    const methodText =
      paymentMethod === "cash" ? t("payment_cash") : t("payment_instapay");
    const message = `اهلا, اريد طلب:\n\n${itemList}\n\nTotal: ${total} EGP\nPayment: ${methodText}\n\n${paymentMethod === "instapay" ? "سأقوم بارسال شاشة الدفع قريبا." : "يرجى تأكيد عنواني."}`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

    // Ask for confirmation before clearing cart
    const confirmed = window.confirm(t("confirm_order_sent"));
    if (confirmed) {
      clearCart();
    }
    setShowCheckout(false);
  };

  const handleAskOnly = () => {
    const phoneNumber = "+201090969040";
    const itemList = items.map((i) => `- ${i.name["en"]}`).join("\n");
    const message = `اهلا, لدي استفسار حول هذه المنتجات في عربة التسوق:\n\n${itemList}`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="container mx-auto px-4 py-12 relative min-h-[80vh]">
      {/* Header Frame */}
      <div className="bg-surface/50 backdrop-blur-md border border-border rounded-4xl p-8 md:p-10 mb-10 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none transform group-hover:scale-110 duration-700">
          <ShoppingBag size={200} />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
            <Sparkles size={12} /> {t("checkout")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-text tracking-tight mb-2">
            {t("cart")}
          </h1>
          <p className="text-subtext flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            {items.reduce((acc, item) => acc + item.quantity, 0)} {t("items")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {items.map((item) => {
              // Use variant price if available, otherwise use product price
              const displayPrice = item.selectedVariant?.price ?? item.price;
              const cartKey = item.selectedVariant
                ? `${item.id}-${item.selectedVariant.id}`
                : item.id;

              return (
                <motion.div
                  key={cartKey}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-surface/60 backdrop-blur-sm p-5 rounded-3xl border border-border flex flex-col sm:flex-row items-center gap-6 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all group"
                >
                  <div className="w-28 h-28 bg-white rounded-2xl shrink-0 p-3 flex items-center justify-center border border-border shadow-inner group-hover:scale-105 transition-transform">
                    <LazyImage
                      src={item.image}
                      alt={item.name[lang]}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="grow text-center sm:text-left">
                    <h3 className="text-xl font-bold text-text mb-1 line-clamp-2 leading-tight">
                      {item.name[lang]}
                    </h3>
                    {/* Show variant name if available */}
                    {item.selectedVariant && (
                      <p className="text-sm text-primary font-bold mb-2">
                        {item.selectedVariant.name[lang]}
                      </p>
                    )}
                    <div className="flex items-center justify-center sm:justify-start gap-3">
                      <p className="text-primary font-black text-2xl">
                        {displayPrice}{" "}
                        <span className="text-sm font-normal text-subtext uppercase">
                          {t("currency")}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4 bg-background/50 rounded-2xl p-2 border border-border">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface border border-border hover:border-primary hover:text-primary transition-all active:scale-90 shadow-sm"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="text-text w-8 text-center font-black text-lg">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface border border-border hover:border-primary hover:text-primary transition-all active:scale-90 shadow-sm"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-subtext hover:text-red-500 hover:bg-red-500/10 p-3 rounded-2xl transition-all active:scale-90"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-surface/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-border sticky top-24 shadow-2xl overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>

            <h3 className="text-2xl font-black text-text mb-8 flex items-center justify-between relative z-10">
              {t("bundle.summary")}
              <ShoppingBag className="text-primary opacity-20" size={24} />
            </h3>

            <div className="space-y-4 mb-8 relative z-10">
              <div className="flex justify-between text-subtext font-medium">
                <span>{t("subtotal")}</span>
                <span className="text-text font-bold">
                  {total} {t("currency")}
                </span>
              </div>
              <div className="flex justify-between text-subtext font-medium">
                <span>{t("shipping")}</span>
                <span className="text-green-500 font-black uppercase tracking-widest text-xs bg-green-500/10 px-2 py-1 rounded-lg">
                  {t("free")}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-10 pt-6 border-t border-border relative z-10">
              <span className="text-subtext font-bold uppercase tracking-widest text-xs mb-1">
                {t("total")}
              </span>
              <div className="text-right">
                <div className="text-4xl font-black text-primary leading-none">
                  {total}
                </div>
                <div className="text-xs text-subtext font-bold uppercase mt-1">
                  {t("currency")}
                </div>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full bg-primary text-black font-black text-lg py-5 rounded-2xl hover:bg-white transition-all shadow-xl shadow-primary/20 transform active:scale-95 flex items-center justify-center gap-3"
              >
                {t("checkout")} <ArrowRight size={20} />
              </button>

              <button
                onClick={handleAskOnly}
                className="w-full group border border-border bg-background/50 hover:bg-green-500/10 hover:border-green-500/30 text-subtext hover:text-green-500 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <MessageCircle
                  size={20}
                  className="group-hover:animate-bounce"
                />{" "}
                {t("ask_on_whatsapp")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-surface rounded-3xl w-full max-w-lg border border-border shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-bold text-text">
                {t("payment_method")}
              </h2>
              <button
                onClick={() => setShowCheckout(false)}
                className="text-subtext hover:text-text bg-background p-2 rounded-full hover:bg-border transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Payment Selector */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod("instapay")}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === "instapay" ? "border-primary bg-primary/5 text-primary" : "border-border bg-background text-subtext hover:border-primary/50"}`}
                >
                  <Smartphone size={24} />
                  <span className="text-sm font-bold text-center">
                    {t("payment_instapay")}
                  </span>
                  {paymentMethod === "instapay" && (
                    <CheckCircle size={16} className="text-primary" />
                  )}
                </button>

                <button
                  onClick={() => setPaymentMethod("cash")}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === "cash" ? "border-green-500 bg-green-500/5 text-green-500" : "border-border bg-background text-subtext hover:border-green-500/50"}`}
                >
                  <Banknote size={24} />
                  <span className="text-sm font-bold text-center">
                    {t("payment_cash")}
                  </span>
                  {paymentMethod === "cash" && (
                    <CheckCircle size={16} className="text-green-500" />
                  )}
                </button>
              </div>

              {/* Dynamic Content */}
              <div className="bg-background p-5 rounded-2xl border border-border min-h-40">
                {paymentMethod === "instapay" ? (
                  <div className="space-y-4 animate-fade-in">
                    <p className="text-subtext text-sm">
                      {t("transfer_instruction")}{" "}
                      <span className="text-text font-bold">
                        {total} {t("currency")}
                      </span>
                    </p>
                    <div className="bg-white dark:bg-black/20 text-black dark:text-white font-mono text-xl p-3 rounded-xl text-center font-bold tracking-wider select-all border border-border">
                      010 1234 5678
                    </div>
                    <div className="text-xs text-subtext text-center">
                      {t("supported_wallets")}
                    </div>
                    <ul className="text-xs text-subtext space-y-1 list-disc pl-4">
                      <li>{t("checkout_step_1")}</li>
                      <li>{t("checkout_step_2")}</li>
                    </ul>
                  </div>
                ) : (
                  <div className="space-y-4 animate-fade-in flex flex-col items-center justify-center h-full text-center">
                    <Banknote
                      size={48}
                      className="text-green-500 opacity-50 mb-2"
                    />
                    <p className="text-text font-medium">
                      {t("payment_on_delivery", { amount: total })}
                    </p>
                    <p className="text-xs text-subtext">
                      {t("whatsapp_verification")}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={handleWhatsAppCheckout}
                className="w-full bg-green-500 text-white font-bold py-4 rounded-xl hover:bg-green-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 active:scale-95"
              >
                <MessageCircle size={20} /> {t("confirm_whatsapp")}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Cart;
