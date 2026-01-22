import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTopBtn from "./ScrollToTopBtn";
import QuickViewModal from "./QuickViewModal";
import { useTranslation } from "react-i18next";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-black">
      <Header />
      <main className="grow animate-fade-in">{children}</main>
      <Footer />
      <ScrollToTopBtn />
      <QuickViewModal />
    </div>
  );
};

// Re-export components for backward compatibility
export { default as Header } from "./Header";
export { default as Footer } from "./Footer";
export { default as ScrollToTopBtn } from "./ScrollToTopBtn";
