import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useData } from "../store/DataContext";
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
} from "lucide-react";

type TabType = "branches" | "maintenance";

const Branches: React.FC = () => {
  const { t } = useTranslation();
  const { installers, loading } = useData();
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

    const message = `🛠 *Maintenance Request* 🛠
    
👤 *Name:* ${formData.name}
📱 *Phone:* ${formData.phone}
📍 *Address:* ${formData.address}
📡 *Device:* ${formData.device}

⚠️ *Issue:* ${formData.issue}

📅 *Preferred Date:* ${formData.date}
⏰ *Preferred Time:* ${formData.time}`;

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

  if (loading)
    return (
      <div className="text-text text-center py-20 animate-pulse">
        {t("loading")}
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-12 page-transition">
      {/* Header */}
      <div className="text-center mb-10 animate-fade-in-up">
        <h1 className="text-4xl font-bold text-text mb-4 flex items-center justify-center gap-3">
          <Store size={40} className="text-primary" />
          {t("branches.title")}
        </h1>
        <p className="text-subtext max-w-2xl mx-auto">
          {t("branches.subtitle")}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-10 animate-fade-in-up stagger-1">
        <div className="inline-flex bg-surface border border-border rounded-xl p-1.5 gap-1">
          <button
            onClick={() => setActiveTab("branches")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all btn-press
              ${
                activeTab === "branches"
                  ? "bg-primary text-black shadow-lg"
                  : "text-subtext hover:text-text hover:bg-background"
              }`}
          >
            <MapPin size={18} />
            {t("branches.tab_branches")}
          </button>
          <button
            onClick={() => setActiveTab("maintenance")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all btn-press
              ${
                activeTab === "maintenance"
                  ? "bg-primary text-black shadow-lg"
                  : "text-subtext hover:text-text hover:bg-background"
              }`}
          >
            <Settings size={18} />
            {t("branches.tab_maintenance")}
          </button>
        </div>
      </div>

      {/* Branches Tab */}
      {activeTab === "branches" && (
        <div className="animate-fade-in-up">
          {/* Filter */}
          <div className="max-w-md mx-auto mb-10">
            <div className="relative">
              <select
                className="w-full bg-surface border border-border text-text py-3 px-4 rounded-xl focus:border-primary focus:outline-none appearance-none cursor-pointer transition-all hover:border-primary/50"
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
              <MapPin
                className="absolute right-3 top-1/2 -translate-y-1/2 text-subtext pointer-events-none"
                size={20}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((inst, index) => (
              <div
                key={inst.id}
                className="bg-surface rounded-2xl p-6 border border-border hover:border-primary transition-all flex flex-col shadow-sm card-hover animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center text-subtext border border-border">
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-text flex items-center gap-2">
                        {inst.name}
                        {inst.verified && (
                          <ShieldCheck size={16} className="text-blue-500" />
                        )}
                      </h3>
                      <div className="flex items-center text-primary text-sm">
                        <Star size={12} fill="currentColor" />
                        <span className="ms-1">{inst.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs font-bold uppercase">
                    {inst.governorate}
                  </div>
                </div>

                <div className="mb-6 grow">
                  <h4 className="text-subtext text-xs font-bold uppercase mb-2">
                    {t("branches.specialties")}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {inst.specialties.map((spec, idx) => (
                      <span
                        key={idx}
                        className="bg-background border border-border text-text px-2 py-1 rounded-lg text-xs"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href={`tel:${inst.phone}`}
                  className="w-full bg-primary text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-surface hover:text-primary border border-transparent hover:border-primary transition-all btn-press"
                >
                  <Phone size={18} /> {t("branches.call_now")}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Maintenance Tab */}
      {activeTab === "maintenance" && (
        <div className="max-w-2xl mx-auto animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-primary/10 rounded-full text-primary mb-4">
              <Wrench size={48} />
            </div>
            <h2 className="text-2xl font-bold text-text mb-2">
              {t("maintenance_page.title")}
            </h2>
            <p className="text-subtext">{t("maintenance_page.subtitle")}</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-surface p-8 rounded-2xl border border-border shadow-xl space-y-6"
          >
            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-subtext flex items-center gap-2">
                  <User size={14} /> {t("maintenance_page.name")}
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-xl p-3 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-subtext transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-subtext flex items-center gap-2">
                  <Smartphone size={14} /> {t("maintenance_page.phone")}
                </label>
                <input
                  required
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-xl p-3 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-subtext transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-subtext flex items-center gap-2">
                <MapPin size={14} /> {t("maintenance_page.address")}
              </label>
              <input
                required
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded-xl p-3 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-subtext transition-all"
              />
            </div>

            {/* Device Info */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-subtext flex items-center gap-2">
                <PenTool size={14} /> {t("maintenance_page.device_model")}
              </label>
              <input
                required
                type="text"
                name="device"
                placeholder={t("device_placeholder")}
                value={formData.device}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded-xl p-3 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-subtext transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-subtext flex items-center gap-2">
                <Wrench size={14} /> {t("maintenance_page.issue")}
              </label>
              <textarea
                required
                name="issue"
                rows={4}
                value={formData.issue}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded-xl p-3 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-subtext transition-all resize-none"
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
              <div className="space-y-2">
                <label className="text-sm font-bold text-subtext flex items-center gap-2">
                  <Calendar size={14} /> {t("maintenance_page.date")}
                </label>
                <input
                  required
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-xl p-3 text-text focus:border-primary focus:outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-subtext flex items-center gap-2">
                  <Clock size={14} /> {t("maintenance_page.time")}
                </label>
                <input
                  required
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-xl p-3 text-text focus:border-primary focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white font-bold py-4 rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-3 text-lg mt-6 btn-press"
            >
              <Send size={20} /> {t("maintenance_page.submit")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Branches;
