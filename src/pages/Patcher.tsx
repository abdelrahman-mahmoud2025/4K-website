import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useData } from "../store/DataContext";
import {
  Download,
  Cpu,
  Disc,
  CheckCircle,
  Search,
  ChevronRight,
  X,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Patcher: React.FC = () => {
  const { t } = useTranslation();
  const { downloads } = useData();

  const [step, setStep] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const brands = Array.from(
    new Set<string>(downloads.map((d) => d.brand)),
  ).sort();

  const filteredBrands = brands.filter((brand: string) =>
    brand.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const models: string[] = downloads
    .filter((d) => d.brand === selectedBrand)
    .map((d) => d.model)
    .sort();

  const filteredModels = models.filter((model: string) =>
    model.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const matchingFiles = downloads.filter(
    (d) => d.brand === selectedBrand && d.model === selectedModel,
  );

  // Reset search when step changes
  useEffect(() => {
    setSearchTerm("");
  }, [step]);

  const reset = () => {
    setStep(1);
    setSelectedBrand("");
    setSelectedModel("");
    setSearchTerm("");
  };

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
    setStep(2);
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    setStep(3);
  };

  const SearchInput = ({ placeholder }: { placeholder: string }) => (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-subtext" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-10 py-3 border border-border rounded-xl leading-5 bg-background text-text placeholder-subtext focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all shadow-sm"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        autoFocus
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm("")}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-subtext hover:text-text cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );

  const variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-[80vh]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-text mb-3">
            {t("patcher.title")}
          </h1>
          <p className="text-subtext text-lg">{t("patcher.subtitle")}</p>
        </div>

        {/* Steps Indicator Frame */}
        <div className="mb-12 max-w-2xl mx-auto bg-surface/50 backdrop-blur-md border border-border rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-center relative px-4">
            {/* Progress Bar Background */}
            <div className="absolute top-6 left-4 right-4 h-1 bg-surface border-t border-b border-border -z-10 rounded-full"></div>

            {/* Active Progress Bar */}
            <div className="absolute top-6 left-4 right-4 h-1 -z-10">
              <motion.div
                className="h-full bg-primary origin-left rounded-full"
                initial={{ width: "0%" }}
                animate={{
                  width: step === 1 ? "0%" : step === 2 ? "50%" : "100%",
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>

            {[
              { num: 1, label: t("brand"), icon: Disc },
              { num: 2, label: t("model"), icon: Cpu },
              { num: 3, label: t("downloads"), icon: Download },
            ].map((s) => {
              const isCompleted = step > s.num;
              const isCurrent = step === s.num;
              const isClickable = s.num < step;

              return (
                <div
                  key={s.num}
                  className="flex flex-col items-center gap-3 relative z-10 group"
                >
                  <motion.button
                    initial={false}
                    onClick={() => isClickable && setStep(s.num)}
                    disabled={!isClickable}
                    animate={{
                      scale: isCurrent ? 1.1 : 1,
                      backgroundColor:
                        isCompleted || isCurrent
                          ? "var(--color-primary)"
                          : "var(--color-surface)",
                      borderColor:
                        isCompleted || isCurrent
                          ? "var(--color-primary)"
                          : "var(--color-border)",
                    }}
                    whileHover={isClickable ? { scale: 1.15 } : {}}
                    whileTap={isClickable ? { scale: 0.95 } : {}}
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-4 shadow-lg transition-all duration-300 ${
                      isClickable ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-black" />
                    ) : (
                      <span
                        className={`font-bold text-lg ${isCurrent || isCompleted ? "text-black" : "text-subtext"}`}
                      >
                        {s.num}
                      </span>
                    )}
                  </motion.button>

                  <motion.span
                    animate={{
                      color: isCurrent
                        ? "var(--color-primary)"
                        : isCompleted
                          ? "var(--color-text)"
                          : "var(--color-subtext)",
                      fontWeight: isCurrent ? 700 : 500,
                    }}
                    className="text-sm whitespace-nowrap"
                  >
                    {s.label}
                  </motion.span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-text mb-6 flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Disc className="text-primary w-6 h-6" />
                  </div>
                  {t("patcher.select_brand")}
                </h2>

                <SearchInput
                  placeholder={t("search_brand", "Search brand...")}
                />

                {filteredBrands.length === 0 ? (
                  <div className="text-center py-12 text-subtext bg-background/50 rounded-xl border border-dashed border-border">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>
                      {t("no_results", "No brands found matching your search")}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredBrands.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => handleBrandSelect(brand)}
                        className="group bg-background p-4 rounded-xl border border-border text-left flex items-center justify-between card-hover btn-press"
                      >
                        <span className="font-bold text-lg text-text">
                          {brand}
                        </span>
                        <ChevronRight className="text-subtext group-hover:text-primary transition-colors" />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-text mb-6 flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Cpu className="text-primary w-6 h-6" />
                  </div>
                  {t("patcher.select_model")}
                  <span className="text-sm font-normal text-subtext ml-auto bg-background px-3 py-1 rounded-full border border-border">
                    {selectedBrand}
                  </span>
                </h2>

                <SearchInput
                  placeholder={t("search_model", "Search model...")}
                />

                {filteredModels.length === 0 ? (
                  <div className="text-center py-12 text-subtext bg-background/50 rounded-xl border border-dashed border-border">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>
                      {t("no_results", "No models found matching your search")}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredModels.map((model) => (
                      <button
                        key={model}
                        onClick={() => handleModelSelect(model)}
                        className="group bg-background p-4 rounded-xl border border-border text-left flex items-center justify-between card-hover btn-press"
                      >
                        <span className="font-bold text-lg text-text">
                          {model}
                        </span>
                        <ChevronRight className="text-subtext group-hover:text-primary transition-colors" />
                      </button>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setStep(1)}
                  className="mt-8 text-subtext hover:text-text hover:bg-background px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium"
                >
                  &larr; {t("back_to_brands", "Back to Brands")}
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="mb-8 p-6 bg-background/50 rounded-2xl border border-border inline-block">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <CheckCircle
                      size={80}
                      className="text-green-500 mx-auto mb-4"
                    />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-text mb-1">
                    {t("patcher.success")}
                  </h2>
                  <p className="text-subtext text-lg flex items-center justify-center gap-2">
                    <span className="font-semibold text-primary">
                      {selectedBrand}
                    </span>
                    <span className="text-border">/</span>
                    <span className="font-semibold text-primary">
                      {selectedModel}
                    </span>
                  </p>
                </div>

                <div className="space-y-4 mb-10 max-w-xl mx-auto">
                  {matchingFiles.map((file, index) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-background p-5 rounded-xl border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 card-hover group"
                    >
                      <div className="flex items-start gap-4 text-left">
                        <div className="p-3 bg-surface rounded-lg border border-border group-hover:border-primary/50 transition-colors">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-bold text-text text-lg leading-tight mb-1">
                            {file.fileName}
                          </div>
                          <div className="text-sm text-subtext flex flex-wrap gap-x-3">
                            <span className="bg-surface px-2 py-0.5 rounded text-xs border border-border">
                              {file.version}
                            </span>
                            <span>{file.date}</span>
                          </div>
                        </div>
                      </div>
                      <button className="w-full sm:w-auto bg-primary text-black px-6 py-3 rounded-xl font-bold hover:bg-white hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2 transition-all duration-200">
                        <Download size={18} /> {t("download_btn")}
                      </button>
                    </motion.div>
                  ))}
                </div>

                <button
                  onClick={reset}
                  className="text-subtext hover:text-primary hover:bg-background px-6 py-3 rounded-xl transition-all font-medium"
                >
                  {t("patcher.start_over")}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Patcher;
