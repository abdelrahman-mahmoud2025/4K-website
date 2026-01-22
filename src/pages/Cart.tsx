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
    const message = `Hello, I would like to order:\n\n${itemList}\n\nTotal: ${total} EGP\nPayment: ${methodText}\n\n${paymentMethod === "instapay" ? "I will send the payment screenshot shortly." : "Please confirm my address."}`;

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
    const message = `Hello, I have questions about these products in my cart:\n\n${itemList}`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="container mx-auto px-4 py-12 relative">
      <h1 className="text-3xl font-bold text-text mb-8">{t("cart")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-surface p-4 rounded-2xl border border-border flex flex-col sm:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-24 h-24 bg-white rounded-xl shrink-0 p-2 flex items-center justify-center border border-border">
                  <LazyImage
                    src={item.image}
                    alt={item.name[lang]}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="grow text-center sm:text-left">
                  <h3 className="text-lg font-bold text-text mb-1 line-clamp-2">
                    {item.name[lang]}
                  </h3>
                  <p className="text-primary font-bold text-lg">
                    {item.price} {t("currency")}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-background rounded-xl p-1.5 border border-border">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface hover:bg-border text-text transition-colors active:scale-90"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-text w-6 text-center font-bold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface hover:bg-border text-text transition-colors active:scale-90"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10 p-2.5 rounded-xl transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-surface p-6 rounded-2xl border border-border sticky top-24 shadow-lg">
            <h3 className="text-xl font-bold text-text mb-6 border-b border-border pb-4">
              {t("total")}
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-subtext">
                <span>{t("subtotal")}</span>
                <span>
                  {total} {t("currency")}
                </span>
              </div>
              <div className="flex justify-between text-subtext">
                <span>{t("shipping")}</span>
                <span className="text-green-500 font-bold">{t("free")}</span>
              </div>
            </div>

            <div className="flex justify-between text-3xl font-bold text-primary mb-8 pt-4 border-t border-border">
              <span>{t("total")}</span>
              <span>
                {total}{" "}
                <span className="text-base text-subtext font-normal">
                  {t("currency")}
                </span>
              </span>
            </div>

            <button
              onClick={() => setShowCheckout(true)}
              className="w-full bg-primary text-black font-bold py-4 rounded-xl hover:bg-white transition-all shadow-lg hover:shadow-primary/20 transform active:scale-95"
            >
              {t("checkout")}
            </button>

            <button
              onClick={handleAskOnly}
              className="w-full mt-4 border-2 border-green-500 text-green-500 font-bold py-3 rounded-xl hover:bg-green-500 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} /> {t("ask_on_whatsapp")}
            </button>
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
