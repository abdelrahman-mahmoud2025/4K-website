import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Phone,
  Facebook,
  MessageCircle,
  Mail,
  ArrowRight,
  Code,
  MapPin,
  Instagram,
} from "lucide-react";

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer dir="ltr" className="bg-surface border-t border-border pt-16 mt-auto transition-colors duration-300">
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Contact */}
          <div className="md:col-span-1 space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-text mb-4 tracking-tight">
                4K<span className="text-primary">STORE</span>
              </h3>
              <p className="text-subtext text-sm leading-relaxed">
                {t("footer_about")}
              </p>
            </div>
            
            <div className="space-y-3 text-subtext text-sm">
              <p className="flex items-center gap-3 hover:text-text transition-colors">
                <Phone size={16} className="text-primary shrink-0" /> 
                <span dir="ltr">+201277697483</span>
              </p>
              <p className="flex items-center gap-3 hover:text-text transition-colors">
                <Mail size={16} className="text-primary shrink-0" /> 
                support@4kstore.com
              </p>
              <p className="flex items-start gap-3 hover:text-text transition-colors">
                <MapPin size={16} className="text-primary shrink-0 mt-1" /> 
                <span>123 Satellite St, Downtown,<br />Cairo, Egypt</span>
              </p>
            </div>

            <div className="flex gap-3">
              <a href="#" className="bg-background p-2.5 rounded-full text-subtext hover:text-white hover:bg-blue-600 transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="bg-background p-2.5 rounded-full text-subtext hover:text-white hover:bg-pink-600 transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="bg-background p-2.5 rounded-full text-subtext hover:text-white hover:bg-green-500 transition-all">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold text-text mb-6">
              {t("shop")}
            </h3>
            <div className="space-y-3 text-subtext text-sm">
              {[
                { to: "/shop", label: "view_all_products" },
                { to: "/offers", label: "offers" },
                { to: "/bundle", label: "bundle.title" },
                { to: "/wishlist", label: "wishlist" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block hover:text-primary transition-colors hover:translate-x-1 duration-200"
                >
                  {t(link.label)}
                </Link>
              ))}
            </div>
          </div>

          {/* Tools & Services */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold text-text mb-6">
              {t("tools")}
            </h3>
            <div className="space-y-3 text-subtext text-sm">
              {[
                { to: "/patcher", label: "patcher" },
                { to: "/feeds", label: "feeds" },
                { to: "/downloads", label: "downloads" },
                { to: "/branches", label: "branches.tab_branches" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block hover:text-primary transition-colors hover:translate-x-1 duration-200"
                >
                  {t(link.label)}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold text-text mb-6">
              {t("newsletter_title")}
            </h3>
            <p className="text-subtext text-sm mb-4">{t("newsletter_desc")}</p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder={t("email_placeholder")}
                className="bg-background border border-border rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary transition-colors placeholder-subtext text-sm"
              />
              <button className="bg-primary text-black font-bold py-3 rounded-xl hover:bg-white border border-transparent hover:border-primary transition-all transform active:scale-95 flex items-center justify-center gap-2">
                {t("subscribe")} <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-subtext text-xs">
          <p>{t("rights_reserved")}</p>
          <div className="flex gap-6 font-medium">
            <Link to="/about" className="hover:text-text transition-colors">
              {t("about_me")}
            </Link>
            <Link to="/refund-terms" className="hover:text-text transition-colors">
              {t("refund_terms")}
            </Link>
          </div>
        </div>
      </div>

      {/* Developer Footer */}
      <div className="bg-background border-t border-border py-3 transition-colors duration-300">
        <div className="container mx-auto px-4 text-center text-[10px] text-subtext/70 flex items-center justify-center gap-2">
          <Code size={10} />
          <span>{t("designed_by")}</span>
          <a
            href="https://abdelrhman-mahmoud.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-text font-bold transition-colors"
          >
            Abdelrhman Mahmoud
          </a>
          <span className="hidden sm:inline">
            | {t("all_rights_reserved_dev")}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;