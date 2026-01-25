import React from "react";
import { useTranslation } from "react-i18next";
import {
  ShoppingBag,
  Users,
  Award,
  Globe,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Send,
  User,
  Map,
  Clock,
  Instagram,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSEO } from "../hooks/useSEO";

const About: React.FC = () => {
  const { t, i18n } = useTranslation();

  // SEO Meta Tags
  useSEO({
    title:
      i18n.language === "ar"
        ? "من نحن - تعرف على 4K Store وزياد شوقي"
        : "About Us - Learn About 4K Store & Zyad Shawky",
    description:
      i18n.language === "ar"
        ? "4K Store - فور كيه ستور - متجر زياد شوقي للستالايت. تعرف على قصتنا، فروعنا في مصر، وتواصل معنا عبر الهاتف أو السوشيال ميديا."
        : "4K Store - Zyad Shawky Satellite Store. Learn about our story, branches across Egypt, and contact us via phone or social media.",
  });

  return (
    <div className="container mx-auto px-4 py-16 relative min-h-screen">
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Header Frame */}
        <div className="bg-surface/50 backdrop-blur-md border border-border rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none transform group-hover:scale-110 duration-700">
            <Users size={300} />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
              <Sparkles size={12} /> {t("about_me")}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-text mb-8 tracking-tight leading-tight">
              {t("about_page.title")}
            </h1>
            <p className="text-subtext text-xl leading-relaxed whitespace-pre-line mb-10 opacity-90">
              {t("about_page.content")}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-background border border-border text-primary font-bold text-sm shadow-sm transition-all hover:border-primary/30">
                <Award size={18} /> {t("official_distributor")}
              </div>
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-background border border-border text-primary font-bold text-sm shadow-sm transition-all hover:border-primary/30">
                <Users size={18} /> {t("community_count")}
              </div>
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-background border border-border text-primary font-bold text-sm shadow-sm transition-all hover:border-primary/30">
                <Globe size={18} /> {t("egypt_wide")}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: ShoppingBag,
              color: "text-primary",
              val: "3000+",
              label: t("products_sold"),
              bg: "bg-primary/5",
            },
            {
              icon: Users,
              color: "text-secondary",
              val: "1500+",
              label: t("happy_customers_count"),
              bg: "bg-secondary/5",
            },
            {
              icon: Award,
              color: "text-green-500",
              val: "#1",
              label: t("top_rated_store"),
              bg: "bg-green-500/5",
            },
            {
              icon: Clock,
              color: "text-blue-500",
              val: "24/7",
              label: t("online_support"),
              bg: "bg-blue-500/5",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-surface/60 backdrop-blur-sm border border-border p-8 rounded-3xl text-center hover:border-primary/50 transition-all hover:-translate-y-2 shadow-lg group"
            >
              <div
                className={`${stat.bg} ${stat.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-inner`}
              >
                <stat.icon size={32} />
              </div>
              <h3 className="text-text font-black text-3xl mb-2">{stat.val}</h3>
              <p className="text-subtext font-bold text-xs uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Owner & Team */}
        <div className="bg-surface/40 backdrop-blur-md rounded-[2.5rem] border border-border p-10 md:p-16 shadow-2xl flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

          <div className="w-48 h-48 md:w-64 md:h-64 bg-background rounded-3xl overflow-hidden border-8 border-surface shadow-2xl shrink-0 transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop"
              alt="CEO"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-center md:text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              {t("founder_title")}
            </div>
            <h2 className="text-4xl font-black text-text mb-6 tracking-tight">
              {t("founder_name")}
            </h2>
            <p className="text-subtext text-xl leading-relaxed mb-8 italic opacity-80">
              {t("founder_quote")}
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <button className="bg-blue-600/10 text-blue-600 p-4 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95 border border-blue-600/20">
                <Facebook size={24} />
              </button>
              <button className="bg-sky-500/10 text-sky-500 p-4 rounded-2xl hover:bg-sky-500 hover:text-white transition-all shadow-sm active:scale-95 border border-sky-500/20">
                <Send size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Contact & Branches */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Branch Info */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-text tracking-tight flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <MapPin size={24} />
                </div>
                {t("our_branches")}
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  name: t("branch_cairo"),
                  address: "123 Satellite St, Downtown",
                  phone: "+20 123 456 789",
                },
                {
                  name: t("branch_alex"),
                  address: "45 Corniche Rd, Stanley",
                  phone: "+20 123 456 790",
                },
                {
                  name: t("branch_giza"),
                  address: "88 Haram St, Giza",
                  phone: "+20 123 456 791",
                },
              ].map((branch, idx) => (
                <div
                  key={idx}
                  className="bg-surface/60 backdrop-blur-sm border border-border p-6 rounded-3xl hover:border-primary/50 transition-all shadow-sm group"
                >
                  <h3 className="text-xl font-bold text-text mb-4 group-hover:text-primary transition-colors">
                    {branch.name}
                  </h3>
                  <div className="space-y-3 text-subtext font-medium">
                    <p className="flex items-center gap-3 bg-background/50 p-3 rounded-xl border border-border/50">
                      <MapPin size={18} className="text-primary" />{" "}
                      {branch.address}
                    </p>
                    <p className="flex items-center gap-3 bg-background/50 p-3 rounded-xl border border-border/50">
                      <Phone size={18} className="text-primary" />{" "}
                      {branch.phone}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location Map Placeholder */}
          <div className="bg-background rounded-[2.5rem] overflow-hidden border border-border h-full min-h-100 relative group shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop"
              alt="Map Location"
              className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-700 transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="text-center">
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary text-black font-black py-5 px-10 rounded-4xl shadow-2xl hover:bg-white transition-all flex items-center gap-3 transform hover:-translate-y-1"
                >
                  <Map size={24} /> {t("open_google_maps")}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Social Cards */}
        <div className="pt-10">
          <h2 className="text-4xl font-black text-text mb-12 text-center tracking-tight">
            {t("join_community")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <a
              href="#"
              className="bg-[#1877F2] text-white p-10 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 hover:shadow-2xl hover:shadow-[#1877F2]/30 transition-all hover:-translate-y-2 group"
            >
              <div className="p-5 bg-white/10 rounded-3xl group-hover:scale-110 transition-transform">
                <Facebook size={48} />
              </div>
              <div className="text-center">
                <span className="text-3xl font-black block mb-1">Facebook</span>
                <span className="text-white/70 font-bold uppercase tracking-widest text-xs">
                  {t("follow_offers")}
                </span>
              </div>
            </a>
            <a
              href="#"
              className="bg-[#E4405F] text-white p-10 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 hover:shadow-2xl hover:shadow-[#E4405F]/30 transition-all hover:-translate-y-2 group"
            >
              <div className="p-5 bg-white/10 rounded-3xl group-hover:scale-110 transition-transform">
                <Instagram size={48} />
              </div>
              <div className="text-center">
                <span className="text-3xl font-black block mb-1">
                  Instagram
                </span>
                <span className="text-white/70 font-bold uppercase tracking-widest text-xs">
                  {t("see_products")}
                </span>
              </div>
            </a>
            <a
              href="#"
              className="bg-[#25D366] text-white p-10 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 hover:shadow-2xl hover:shadow-[#25D366]/30 transition-all hover:-translate-y-2 group"
            >
              <div className="p-5 bg-white/10 rounded-3xl group-hover:scale-110 transition-transform">
                <Phone size={48} />
              </div>
              <div className="text-center">
                <span className="text-3xl font-black block mb-1">WhatsApp</span>
                <span className="text-white/70 font-bold uppercase tracking-widest text-xs">
                  {t("chat_support")}
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
