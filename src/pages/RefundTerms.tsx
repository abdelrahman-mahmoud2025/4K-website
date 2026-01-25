import React from "react";
import { useTranslation } from "react-i18next";
import { ShieldAlert, CheckCircle, Sparkles, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const RefundTerms: React.FC = () => {
  const { t } = useTranslation();
  const terms = t("refund_page.terms", { returnObjects: true }) as string[];

  return (
    <div className="container mx-auto px-4 py-16 relative min-h-screen">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header Frame */}
        <div className="bg-surface/50 backdrop-blur-md border border-border rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none transform group-hover:scale-110 duration-700">
             <ShieldCheck size={300} />
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest mb-6">
              <Sparkles size={12} /> {t('official_warranty')}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-text mb-6 tracking-tight leading-tight">
              {t("refund_page.title")}
            </h1>
            <p className="text-subtext text-xl leading-relaxed max-w-2xl mx-auto opacity-90">
              {t("refund_page.intro")}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-surface/40 backdrop-blur-md p-8 md:p-12 rounded-[2.5rem] border border-border shadow-xl relative overflow-hidden">
          <ul className="space-y-6">
            {terms.map((term, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-6 p-6 bg-background/50 rounded-2xl border border-border hover:border-primary/30 hover:bg-background transition-all group"
              >
                <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-black transition-all shadow-sm shrink-0">
                  <CheckCircle size={24} strokeWidth={3} />
                </div>
                <span className="text-text leading-relaxed font-bold text-lg opacity-80 group-hover:opacity-100 transition-opacity">
                  {term}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface/50 border border-border text-subtext text-xs font-bold uppercase tracking-widest">
            {t('last_updated')} January 2026
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundTerms;
