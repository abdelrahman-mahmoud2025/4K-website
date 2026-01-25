import React from "react";
import { useTranslation } from "react-i18next";
import { useCompare, useCart } from "../store/StoreContext";
import LazyImage from "../components/LazyImage";
import { X, ShoppingCart, Trash2, Plus, ArrowLeftRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Compare: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();
  const lang = i18n.language as "ar" | "en";

  if (compareList.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center min-h-[80vh] flex flex-col items-center justify-center">
        <div className="bg-surface/50 p-10 rounded-[2.5rem] border border-border border-dashed max-w-md w-full">
          <ArrowLeftRight size={80} className="mx-auto text-subtext/20 mb-6" />
          <h2 className="text-2xl font-black text-text mb-4">
            {t("compare_empty")}
          </h2>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-primary text-black font-black py-4 px-8 rounded-2xl hover:bg-white transition-all shadow-xl shadow-primary/20 transform active:scale-95">
            {t("shop_now")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      {/* Header Frame */}
      <div className="bg-surface/50 backdrop-blur-md border border-border rounded-4xl p-8 md:p-10 mb-12 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none transform group-hover:scale-110 duration-700">
           <ArrowLeftRight size={200} />
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
              <Sparkles size={12} /> {t('compare')}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-text tracking-tight mb-2">
              {t("compare_products")}
            </h1>
            <p className="text-subtext flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              {compareList.length} {t("items_to_compare")}
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link
              to="/shop"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-background text-text px-6 py-3.5 rounded-xl hover:bg-surface transition-all border border-border font-bold text-sm shadow-sm"
            >
              <Plus size={18} />
              {t("add_more_products")}
            </Link>
            <button
              onClick={clearCompare}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white px-6 py-3.5 rounded-xl transition-all font-bold text-sm border border-red-500/20 active:scale-95"
            >
              <Trash2 size={18} /> {t("clear_all")}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile View: Stacked Cards */}
      <div className="md:hidden space-y-6">
        {compareList.map((product) => (
          <div key={product.id} className="bg-surface rounded-xl p-4 border border-border relative">
            <button
              onClick={() => removeFromCompare(product.id)}
              className="absolute top-4 right-4 text-subtext hover:text-red-500"
              title={t("remove")}
            >
              <X size={20} />
            </button>
            
            <div className="flex gap-4 mb-4">
              <div className="w-24 h-24 bg-white rounded-lg p-2 shrink-0">
                <LazyImage
                  src={product.image}
                  alt={product.name[lang]}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col justify-center">
                <Link
                  to={`/product/${product.id}`}
                  className="font-bold text-text hover:text-primary mb-1 line-clamp-2"
                >
                  {product.name[lang]}
                </Link>
                <div className="text-primary font-bold text-lg">
                  {product.price} {t("currency")}
                </div>
                <div className="text-xs text-subtext mt-1">
                  {product.brand} | {t(`categories.${product.category}`)}
                </div>
              </div>
            </div>

            <div className="space-y-3 divide-y divide-border">
              {/* Rating */}
              <div className="pt-3 flex justify-between">
                <span className="text-subtext font-medium">{t("rating")}</span>
                <span className="text-primary">{product.rating} / 5</span>
              </div>
              
              {/* Description */}
              <div className="pt-3">
                <span className="text-subtext font-medium block mb-1">{t("description")}</span>
                <p className="text-text text-sm leading-relaxed">{product.description[lang]}</p>
              </div>

              {/* Features */}
              <div className="pt-3">
                 <span className="text-subtext font-medium block mb-1">{t("features")}</span>
                 <ul className="list-disc list-inside text-sm text-text space-y-1">
                    {product.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                 </ul>
              </div>

              {/* Action */}
              <div className="pt-4">
                <button
                  onClick={() => addToCart(product)}
                  className="w-full bg-primary text-black px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-white flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingCart size={16} /> {t("add_to_cart")}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View: Transposed Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-250">
          <thead>
            <tr className="bg-gray-50 dark:bg-surface/50 border-b border-border">
              <th className="p-4 text-subtext font-bold w-64">{t("product")}</th>
              <th className="p-4 text-subtext font-bold">{t("price")}</th>
              <th className="p-4 text-subtext font-bold">{t("brand")}</th>
              <th className="p-4 text-subtext font-bold">{t("category")}</th>
              <th className="p-4 text-subtext font-bold">{t("rating")}</th>
              <th className="p-4 text-subtext font-bold w-64">{t("description")}</th>
              <th className="p-4 text-subtext font-bold w-80">{t("features")}</th>
              <th className="p-4 text-subtext font-bold w-32">{t("action")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {compareList.map((product) => (
              <tr key={product.id} className="hover:bg-gray-100 dark:hover:bg-white/5 relative group">
                {/* Product Info */}
                <td className="p-4">
                   <div className="relative">
                      <button
                        onClick={() => removeFromCompare(product.id)}
                        className="absolute -top-2 -left-2 bg-surface rounded-full p-1 text-subtext hover:text-red-500 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        title={t("remove")}
                      >
                        <X size={16} />
                      </button>
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-20 h-20 bg-white rounded-lg p-1">
                          <LazyImage
                            src={product.image}
                            alt={product.name[lang]}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <Link
                          to={`/product/${product.id}`}
                          className="font-bold text-text hover:text-primary text-center text-sm"
                        >
                          {product.name[lang]}
                        </Link>
                      </div>
                   </div>
                </td>
                
                {/* Price */}
                <td className="p-4 text-primary font-bold whitespace-nowrap">
                   {product.price} {t("currency")}
                </td>

                {/* Brand */}
                <td className="p-4 text-text">
                   {product.brand}
                </td>

                {/* Category */}
                <td className="p-4 text-text">
                   {t(`categories.${product.category}`)}
                </td>

                 {/* Rating */}
                <td className="p-4 text-primary whitespace-nowrap">
                   {product.rating} / 5
                </td>

                {/* Description */}
                <td className="p-4 text-subtext text-sm min-w-50">
                   <p className="line-clamp-4 hover:line-clamp-none transition-all">{product.description[lang]}</p>
                </td>

                {/* Features */}
                <td className="p-4 text-subtext text-sm min-w-62.5">
                  <ul className="list-disc list-inside space-y-1">
                    {product.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </td>

                {/* Action */}
                <td className="p-4">
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-primary text-black px-3 py-2 rounded-full text-xs font-bold hover:bg-white flex items-center justify-center gap-1 w-full whitespace-nowrap"
                    >
                      <ShoppingCart size={14} /> {t("add_to_cart")}
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Compare;
