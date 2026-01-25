import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useData } from "../store/DataContext";
import ProductCard from "../components/ProductCard";
import {
  ArrowRight,
  Server,
  Wifi,
  Tv,
  Zap,
  ShieldCheck,
  Tag,
  Download,
  Wrench,
  Play,
  Star,
  CreditCard,
  Sparkles,
} from "lucide-react";
import LazyImage from "../components/LazyImage";

const OffersBar: React.FC = () => {
  const { t } = useTranslation();

  const offers = [
    {
      title: t("bundle_save_title"),
      desc: t("bundle_save_desc"),
      icon: <Tag size={24} />,
      color: "bg-purple-600/10 text-purple-600",
      link: "/bundle",
    },
    {
      title: t("software_center_title"),
      desc: t("software_center_desc"),
      icon: <Download size={24} />,
      color: "bg-blue-600/10 text-blue-600",
      link: "/patcher",
    },
    {
      title: t("book_technician_title"),
      desc: t("book_technician_desc"),
      icon: <Wrench size={24} />,
      color: "bg-green-600/10 text-green-600",
      link: "/installers",
    },
  ];

  return (
    <div className="container mx-auto px-4 -mt-16 relative z-30">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offers.map((offer, idx) => (
          <Link
            key={idx}
            to={offer.link}
            className="bg-surface/80 p-6 rounded-4xl shadow-2xl border border-border/50 hover:border-primary transition-all hover:-translate-y-2 flex items-center gap-5 group backdrop-blur-xl"
          >
            <div
              className={`${offer.color} p-4 rounded-2xl shadow-inner group-hover:scale-110 transition-transform`}
            >
              {offer.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-text text-lg leading-tight">
                {offer.title}
              </h3>
              <p className="text-subtext text-xs mt-1 line-clamp-1">{offer.desc}</p>
            </div>
            <div className="bg-background p-2.5 rounded-full text-subtext group-hover:bg-primary group-hover:text-black transition-all shadow-sm">
              <ArrowRight size={18} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { products, loading } = useData();
  const featuredProducts = products
    .filter((p) => p.isOffer || p.rating > 4.5)
    .slice(0, 4);

  if (loading)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-text">
        Loading...
      </div>
    );

  return (
    <div className="space-y-16 pb-16">
      {/* Modern Split-Layout Hero Section */}
      <section className="relative overflow-hidden bg-background">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-200 h-200 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-125 h-125 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

        <div className="container mx-auto px-4 pt-12 pb-24 md:pt-20 md:pb-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="order-2 lg:order-1 space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-surface/50 border border-border backdrop-blur-sm shadow-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-text font-bold tracking-wide text-xs uppercase">
                  {t("server_status")}: {t("online")}
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-text leading-[1.1] tracking-tight">
                {t("hero_title_1")} <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                  {t("hero_title_2")}
                </span>{" "}
                {t("hero_title_3")}
              </h1>

              <p className="text-xl text-subtext leading-relaxed max-w-lg">
                {t("hero_desc")}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-3 bg-primary text-black text-lg font-bold py-4 px-8 rounded-xl hover:bg-white hover:shadow-2xl hover:shadow-primary/20 transition-all transform hover:-translate-y-1"
                >
                  {t("shop_now")} <ArrowRight strokeWidth={2.5} />
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4 text-sm font-bold text-subtext">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-background"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-background"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-background flex items-center justify-center text-[8px]">
                      1k+
                    </div>
                  </div>
                  <span>{t("happy_customers")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span>{t("rating_label")}</span>
                </div>
              </div>
            </div>

            {/* Visual Content (Floating) */}
            <div className="order-1 lg:order-2 relative h-100 md:h-125 flex items-center justify-center">
              {/* Product Glow */}
              <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent rounded-full blur-[100px] animate-pulse"></div>

              {/* Simulated Floating Products Collage */}
              <div className="relative w-full h-full animate-slow-zoom">
                {/* Main Receiver Image */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 md:w-2/3 z-20 transition-transform hover:scale-105 duration-500">
                  <div className="relative bg-black/10 backdrop-blur-sm rounded-3xl p-4 border border-white/10 shadow-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=1000&auto=format&fit=crop"
                      alt="Satellite Receiver"
                      className="rounded-2xl w-full object-cover shadow-lg"
                    />
                    {/* Floating Badge */}
                    <div className="absolute -top-6 -right-6 bg-secondary text-white p-4 rounded-full font-bold shadow-xl rotate-12 text-center text-xs w-20 h-20 flex flex-col items-center justify-center z-30">
                      <span>{t("best_seller_badge").split(" ")[0]}</span>
                      <span className="text-lg">
                        {t("best_seller_badge").split(" ")[1]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Remote (Decorative) */}
                <div className="absolute bottom-0 right-0 md:right-10 w-1/3 z-30 animate-bounce-short">
                  <img
                    src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=1000&auto=format&fit=crop"
                    alt="Remote"
                    className="rounded-xl shadow-2xl border-4 border-surface"
                    style={{ transform: "rotate(-15deg)" }}
                  />
                </div>

                {/* Floating Dish (Decorative) */}
                <div className="absolute top-0 left-0 md:left-10 w-1/4 z-10 opacity-80">
                  <div className="bg-surface/50 p-2 rounded-2xl backdrop-blur-md shadow-lg border border-white/20">
                    <Wifi size={48} className="text-primary mx-auto" />
                    <div className="text-[10px] text-center font-bold mt-1 text-text">
                      {t("high_signal")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offers Bar (Floating Intersection) */}
      <OffersBar />

      {/* Features Banner */}
      <div className="container mx-auto px-4 mt-8">
        <div className="bg-surface/40 backdrop-blur-md border border-border rounded-[2.5rem] py-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-r from-primary/5 to-secondary/5 pointer-events-none"></div>
          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-start group">
              <div className="p-4 bg-primary/10 rounded-2xl text-primary group-hover:bg-primary group-hover:text-black transition-all duration-300 shrink-0 shadow-inner">
                <Zap size={28} />
              </div>
              <div>
                <h4 className="text-text font-bold text-sm md:text-base">
                  {t("fast_delivery")}
                </h4>
                <p className="text-subtext text-xs md:text-sm mt-1 hidden sm:block">
                  {t("fast_delivery_desc")}
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-start group">
              <div className="p-4 bg-secondary/10 rounded-2xl text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300 shrink-0 shadow-inner">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h4 className="text-text font-bold text-sm md:text-base">
                  {t("official_warranty")}
                </h4>
                <p className="text-subtext text-xs md:text-sm mt-1 hidden sm:block">
                  {t("official_warranty_desc")}
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-start group">
              <div className="p-4 bg-green-500/10 rounded-2xl text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all duration-300 shrink-0 shadow-inner">
                <Server size={28} />
              </div>
              <div>
                <h4 className="text-text font-bold text-sm md:text-base">
                  {t("support_24_7")}
                </h4>
                <p className="text-subtext text-xs md:text-sm mt-1 hidden sm:block">
                  {t("support_desc")}
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-start group">
              <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shrink-0 shadow-inner">
                <CreditCard size={28} />
              </div>
              <div>
                <h4 className="text-text font-bold text-sm md:text-base">
                  {t("secure_payment")}
                </h4>
                <p className="text-subtext text-xs md:text-sm mt-1 hidden sm:block">
                  {t("secure_payment_desc")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Highlights */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              id: "receivers",
              icon: <Tv size={48} />,
              label: t("categories.receivers"),
              desc: "4K, Android, Sunplus",
            },
            {
              id: "servers",
              icon: <Server size={48} />,
              label: t("categories.servers"),
              desc: "Forever, Nashare, CCCAM",
            },
            {
              id: "accessories",
              icon: <Wifi size={48} />,
              label: t("categories.accessories"),
              desc: "LNBs, WiFi Adapters",
            },
          ].map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className="group relative overflow-hidden bg-surface/60 backdrop-blur-sm rounded-[2.5rem] p-10 border border-border hover:border-primary transition-all duration-500 shadow-lg hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-all duration-700"></div>

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center p-5 bg-background rounded-2xl text-subtext group-hover:text-primary group-hover:bg-primary/5 transition-all duration-500 transform group-hover:scale-110 mb-8 border border-border group-hover:border-primary/20">
                  {cat.icon}
                </div>
                <h3 className="text-3xl font-black text-text mb-3 tracking-tight">
                  {cat.label}
                </h3>
                <p className="text-subtext text-lg mb-8 leading-relaxed opacity-80">{cat.desc}</p>
                <span className="inline-flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-4 transition-all uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-full border border-primary/20 group-hover:bg-primary group-hover:text-black">
                  {t("view_details")} <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="bg-surface/30 backdrop-blur-sm border border-border rounded-[2.5rem] p-8 md:p-12 mb-10 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
             <Star size={200} />
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                <Sparkles size={14} /> {t("handpicked_selections")}
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-text tracking-tight">
                {t("featured_products")}
              </h2>
            </div>
            <Link
              to="/shop"
              className="group inline-flex items-center gap-3 bg-primary text-black font-bold py-4 px-8 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-primary/20 transition-all transform hover:-translate-y-1"
            >
              {t("view_all_products")}
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
