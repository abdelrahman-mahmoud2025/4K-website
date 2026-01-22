import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import PageLoader from "./PageLoader";
import { shouldAnimate } from "../config/animation";

// Lazy load pages
const Home = lazy(() => import("../pages/Home"));
const Shop = lazy(() => import("../pages/Shop"));
const ProductDetail = lazy(() => import("../pages/ProductDetail"));
const Cart = lazy(() => import("../pages/Cart"));
const Wishlist = lazy(() => import("../pages/Wishlist"));
const Compare = lazy(() => import("../pages/Compare"));
const Feeds = lazy(() => import("../pages/Feeds"));
const Downloads = lazy(() => import("../pages/Downloads"));
const Offers = lazy(() => import("../pages/Offers"));
const SearchResults = lazy(() => import("../pages/SearchResults"));
const Patcher = lazy(() => import("../pages/Patcher"));
const BundleBuilder = lazy(() => import("../pages/BundleBuilder"));
const About = lazy(() => import("../pages/About"));
const RefundTerms = lazy(() => import("../pages/RefundTerms"));
const Branches = lazy(() => import("../pages/Branches"));
const NotFound = lazy(() => import("../pages/NotFound"));

const activeVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const disabledVariants = {
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 1, y: 0 },
};

const pageTransition = {
  duration: 0.3,
  ease: "easeInOut",
};

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  const isAnimated = shouldAnimate(location.pathname);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={isAnimated ? activeVariants : disabledVariants}
        transition={pageTransition}
        className="w-full"
      >
        <Routes location={location}>
          <Route path="/" element={<Suspense fallback={<PageLoader />}><Home /></Suspense>} />
          <Route path="/shop" element={<Suspense fallback={<PageLoader />}><Shop /></Suspense>} />
          <Route path="/product/:id" element={<Suspense fallback={<PageLoader />}><ProductDetail /></Suspense>} />
          <Route path="/cart" element={<Suspense fallback={<PageLoader />}><Cart /></Suspense>} />
          <Route path="/wishlist" element={<Suspense fallback={<PageLoader />}><Wishlist /></Suspense>} />
          <Route path="/compare" element={<Suspense fallback={<PageLoader />}><Compare /></Suspense>} />
          <Route path="/feeds" element={<Suspense fallback={<PageLoader />}><Feeds /></Suspense>} />
          <Route path="/downloads" element={<Suspense fallback={<PageLoader />}><Downloads /></Suspense>} />
          <Route path="/offers" element={<Suspense fallback={<PageLoader />}><Offers /></Suspense>} />
          <Route path="/search" element={<Suspense fallback={<PageLoader />}><SearchResults /></Suspense>} />
          <Route path="/patcher" element={<Suspense fallback={<PageLoader />}><Patcher /></Suspense>} />
          <Route path="/bundle" element={<Suspense fallback={<PageLoader />}><BundleBuilder /></Suspense>} />
          <Route path="/about" element={<Suspense fallback={<PageLoader />}><About /></Suspense>} />
          <Route path="/refund-terms" element={<Suspense fallback={<PageLoader />}><RefundTerms /></Suspense>} />
          <Route path="/branches" element={<Suspense fallback={<PageLoader />}><Branches /></Suspense>} />
          <Route path="*" element={<Suspense fallback={<PageLoader />}><NotFound /></Suspense>} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;