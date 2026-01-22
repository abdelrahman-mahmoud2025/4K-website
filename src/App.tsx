import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { StoreProvider } from "./store/StoreContext";
import { DataProvider } from "./store/DataContext";
import { ThemeProvider } from "./store/ThemeContext";
import { Layout } from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import AnimatedRoutes from "./components/AnimatedRoutes";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <DataProvider>
          <StoreProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Toaster position="bottom-center" reverseOrder={false} />
              <Layout>
                <AnimatedRoutes />
              </Layout>
            </BrowserRouter>
          </StoreProvider>
        </DataProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;