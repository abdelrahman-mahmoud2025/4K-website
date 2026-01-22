import React from "react";
import { useTranslation } from "react-i18next";
import { ShieldAlert, CheckCircle } from "lucide-react";

const RefundTerms: React.FC = () => {
  const { t } = useTranslation();
  const terms = t("refund_page.terms", { returnObjects: true }) as string[];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto animate-fade-in-up">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-red-500/10 p-3 rounded-full text-red-500">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-4xl font-bold text-text">
            {t("refund_page.title")}
          </h1>
        </div>

        <div className="bg-surface p-8 rounded-2xl border border-border mb-8 shadow-lg">
          <p className="text-text text-lg mb-6 leading-relaxed">
            {t("refund_page.intro")}
          </p>

          <ul className="space-y-4">
            {terms.map((term, index) => (
              <li
                key={index}
                className="flex items-start gap-4 p-4 bg-background rounded-xl border border-border hover:border-primary/50 transition-colors"
              >
                <CheckCircle className="text-primary mt-1 shrink-0" size={20} />
                <span className="text-subtext leading-relaxed font-medium">
                  {term}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-subtext/60 text-center text-sm">
          {t('last_updated')} January 2026
        </p>
      </div>
    </div>
  );
};

export default RefundTerms;
