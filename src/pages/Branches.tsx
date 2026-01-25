import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "../store/DataContext";
import { useTheme } from "../store/ThemeContext";
import {
  MapPin,
  Phone,
  Star,
  ShieldCheck,
  User,
  Wrench,
  Calendar,
  Clock,
  Send,
  Smartphone,
  PenTool,
  Store,
  Settings,
  ChevronDown,
  Sparkles,
  CheckCircle,
} from "lucide-react";

type TabType = "branches" | "maintenance";

const Branches: React.FC = () => {
  const { t } = useTranslation();
  const { installers, loading } = useData();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>("branches");
  const [filterGov, setFilterGov] = useState("");

  // Maintenance form
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    device: "",
    issue: "",
    date: "",
    time: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const message = `🛠 *طلب صيانة* 🛠
    
    👤 *الاسم:* ${formData.name}
    📱 *الهاتف:* ${formData.phone}
    📍 *العنوان:* ${formData.address}
    📡 *الجهاز:* ${formData.device}

    ⚠️ *المشكلة:* ${formData.issue}

    📅 *التاريخ المفضل:* ${formData.date}
    ⏰ *الوقت المفضل:* ${formData.time}`;

    const phoneNumber = "+201090969040";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const filtered = installers.filter((i) =>
    filterGov
      ? i.governorate.toLowerCase().includes(filterGov.toLowerCase())
      : true,
  );

  const governorates = Array.from(
    new Set(installers.map((i) => i.governorate)),
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-subtext">{t("loading")}</span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Header Frame */}
      <div className="container mx-auto px-4 pt-12">
        <div className="bg-surface/50 backdrop-blur-md border border-border rounded-[2.5rem] p-10 md:p-16 mb-12 shadow-2xl relative overflow-hidden group">
          {/* Decorative Background Icon */}
          <div className="absolute -top-10 -right-10 p-10 opacity-5 group-hover:opacity-10 transition-all duration-700 pointer-events-none transform group-hover:rotate-12 group-hover:scale-110">
            <MapPin size={320} />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="inline-flex items-center justify-center p-5 bg-primary/10 rounded-2xl mb-8 text-primary shadow-inner"
            >
              <Store size={48} />
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-black mb-6 text-text tracking-tight">
              {t("branches.title")}
            </h1>
            <p className="text-subtext text-xl leading-relaxed">
              {t("branches.subtitle")}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-10"
        >
          <div
            className="inline-flex p-1.5 rounded-2xl gap-1"
            style={{
              background: isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.04)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
            }}
          >
            <button
              onClick={() => setActiveTab("branches")}
              className={`relative flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-300
                ${
                  activeTab === "branches"
                    ? "text-black"
                    : isDark
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-500 hover:text-gray-900"
                }`}
            >
              {activeTab === "branches" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <MapPin size={18} />
                {t("branches.tab_branches")}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("maintenance")}
              className={`relative flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-300
                ${
                  activeTab === "maintenance"
                    ? "text-black"
                    : isDark
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-500 hover:text-gray-900"
                }`}
            >
              {activeTab === "maintenance" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Settings size={18} />
                {t("branches.tab_maintenance")}
              </span>
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Branches Tab */}
          {activeTab === "branches" && (
            <motion.div
              key="branches"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Filter */}
              <div className="max-w-md mx-auto mb-10">
                <div className="relative group">
                  <select
                    className={`w-full py-4 px-5 pe-12 rounded-2xl appearance-none cursor-pointer font-medium transition-all
                      ${
                        isDark
                          ? "bg-surface border border-border text-text hover:border-primary/50 focus:border-primary"
                          : "bg-white border border-gray-200 text-gray-900 hover:border-primary/50 focus:border-primary shadow-sm"
                      } focus:outline-none focus:ring-2 focus:ring-primary/20`}
                    value={filterGov}
                    onChange={(e) => setFilterGov(e.target.value)}
                  >
                    <option value="">{t("branches.filter_all")}</option>
                    {governorates.map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-subtext pointer-events-none group-hover:text-primary transition-colors"
                    size={20}
                  />
                </div>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filtered.map((inst) => (
                  <motion.div
                    key={inst.id}
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group rounded-3xl p-6 flex flex-col transition-all duration-300"
                    style={{
                      background: isDark
                        ? "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)"
                        : "linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)",
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                      boxShadow: isDark
                        ? "0 4px 20px rgba(0,0,0,0.2)"
                        : "0 4px 20px rgba(0,0,0,0.05)",
                    }}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-5">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center"
                          style={{
                            background: isDark
                              ? "rgba(218,165,32,0.1)"
                              : "rgba(218,165,32,0.08)",
                          }}
                        >
                          <User size={26} className="text-primary" />
                        </div>
                        <div>
                          <h3
                            className={`text-lg font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}
                          >
                            {inst.name}
                            {inst.verified && (
                              <ShieldCheck
                                size={16}
                                className="text-blue-500"
                              />
                            )}
                          </h3>
                          <div className="flex items-center gap-1 mt-1">
                            <Star
                              size={14}
                              className="text-primary fill-primary"
                            />
                            <span className="text-primary font-bold text-sm">
                              {inst.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        className="px-3 py-1.5 rounded-full text-xs font-bold"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(218,165,32,0.15) 0%, rgba(218,165,32,0.1) 100%)",
                          color: isDark ? "#DAA520" : "#B8860B",
                        }}
                      >
                        {inst.governorate}
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="mb-6 grow">
                      <h4
                        className={`text-xs font-bold uppercase mb-3 flex items-center gap-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                      >
                        <Sparkles size={12} />
                        {t("branches.specialties")}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {inst.specialties.map((spec, idx) => (
                          <span
                            key={idx}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                              ${
                                isDark
                                  ? "bg-background text-gray-300 border border-border"
                                  : "bg-gray-100 text-gray-700 border border-gray-200"
                              }`}
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Call Button */}
                    <motion.a
                      href={`tel:${inst.phone}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3.5 rounded-xl flex items-center justify-center gap-3 font-bold text-sm transition-all"
                      style={{
                        background:
                          "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                        color: "white",
                        boxShadow: "0 8px 25px rgba(34,197,94,0.3)",
                      }}
                    >
                      <Phone size={18} />
                      {t("branches.call_now")}
                    </motion.a>
                  </motion.div>
                ))}
              </motion.div>

              {filtered.length === 0 && (
                <div className="text-center py-20">
                  <MapPin
                    size={48}
                    className="text-subtext mx-auto mb-4 opacity-30"
                  />
                  <p className="text-subtext">No branches found in this area</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Maintenance Tab */}
          {activeTab === "maintenance" && (
            <motion.div
              key="maintenance"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              {/* Header */}
              <div className="text-center mb-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="inline-flex p-5 rounded-3xl mb-5"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 100%)",
                    border: "1px solid rgba(34,197,94,0.2)",
                  }}
                >
                  <Wrench size={48} className="text-green-500" />
                </motion.div>
                <h2
                  className={`text-2xl md:text-3xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {t("maintenance_page.title")}
                </h2>
                <p className={isDark ? "text-gray-400" : "text-gray-500"}>
                  {t("maintenance_page.subtitle")}
                </p>
              </div>

              {/* Form */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onSubmit={handleSubmit}
                className="rounded-3xl p-8 space-y-6"
                style={{
                  background: isDark
                    ? "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)"
                    : "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                  boxShadow: isDark
                    ? "0 20px 60px rgba(0,0,0,0.3)"
                    : "0 20px 60px rgba(0,0,0,0.08)",
                }}
              >
                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label
                      className={`text-sm font-bold flex items-center gap-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      <User size={14} /> {t("maintenance_page.name")}
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full rounded-xl p-4 transition-all focus:outline-none focus:ring-2 focus:ring-primary/30
                        ${
                          isDark
                            ? "bg-background border border-border text-text focus:border-primary"
                            : "bg-gray-50 border border-gray-200 text-gray-900 focus:border-primary"
                        }`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      className={`text-sm font-bold flex items-center gap-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      <Smartphone size={14} /> {t("maintenance_page.phone")}
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full rounded-xl p-4 transition-all focus:outline-none focus:ring-2 focus:ring-primary/30
                        ${
                          isDark
                            ? "bg-background border border-border text-text focus:border-primary"
                            : "bg-gray-50 border border-gray-200 text-gray-900 focus:border-primary"
                        }`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    className={`text-sm font-bold flex items-center gap-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    <MapPin size={14} /> {t("maintenance_page.address")}
                  </label>
                  <input
                    required
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full rounded-xl p-4 transition-all focus:outline-none focus:ring-2 focus:ring-primary/30
                      ${
                        isDark
                          ? "bg-background border border-border text-text focus:border-primary"
                          : "bg-gray-50 border border-gray-200 text-gray-900 focus:border-primary"
                      }`}
                  />
                </div>

                {/* Device Info */}
                <div className="space-y-2">
                  <label
                    className={`text-sm font-bold flex items-center gap-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    <PenTool size={14} /> {t("maintenance_page.device_model")}
                  </label>
                  <input
                    required
                    type="text"
                    name="device"
                    placeholder={t("device_placeholder")}
                    value={formData.device}
                    onChange={handleChange}
                    className={`w-full rounded-xl p-4 transition-all focus:outline-none focus:ring-2 focus:ring-primary/30
                      ${
                        isDark
                          ? "bg-background border border-border text-text placeholder-subtext focus:border-primary"
                          : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-primary"
                      }`}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className={`text-sm font-bold flex items-center gap-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    <Wrench size={14} /> {t("maintenance_page.issue")}
                  </label>
                  <textarea
                    required
                    name="issue"
                    rows={4}
                    value={formData.issue}
                    onChange={handleChange}
                    className={`w-full rounded-xl p-4 transition-all resize-none focus:outline-none focus:ring-2 focus:ring-primary/30
                      ${
                        isDark
                          ? "bg-background border border-border text-text focus:border-primary"
                          : "bg-gray-50 border border-gray-200 text-gray-900 focus:border-primary"
                      }`}
                  />
                </div>

                {/* Date & Time */}
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6"
                  style={{
                    borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                  }}
                >
                  <div className="space-y-2">
                    <label
                      className={`text-sm font-bold flex items-center gap-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      <Calendar size={14} /> {t("maintenance_page.date")}
                    </label>
                    <input
                      required
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className={`w-full rounded-xl p-4 transition-all focus:outline-none focus:ring-2 focus:ring-primary/30
                        ${
                          isDark
                            ? "bg-background border border-border text-text focus:border-primary"
                            : "bg-gray-50 border border-gray-200 text-gray-900 focus:border-primary"
                        }`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      className={`text-sm font-bold flex items-center gap-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      <Clock size={14} /> {t("maintenance_page.time")}
                    </label>
                    <input
                      required
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className={`w-full rounded-xl p-4 transition-all focus:outline-none focus:ring-2 focus:ring-primary/30
                        ${
                          isDark
                            ? "bg-background border border-border text-text focus:border-primary"
                            : "bg-gray-50 border border-gray-200 text-gray-900 focus:border-primary"
                        }`}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-lg font-bold text-white mt-8 transition-all"
                  style={{
                    background:
                      "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                    boxShadow: "0 12px 35px rgba(34,197,94,0.35)",
                  }}
                >
                  <Send size={22} />
                  {t("maintenance_page.submit")}
                </motion.button>

                {/* Trust indicators */}
                <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-sm">
                  <div
                    className={`flex items-center gap-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    <CheckCircle size={16} className="text-green-500" />
                    <span>Fast Response</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    <ShieldCheck size={16} className="text-blue-500" />
                    <span>Verified Technicians</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    <Star size={16} className="text-primary fill-primary" />
                    <span>Top Rated</span>
                  </div>
                </div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Branches;
