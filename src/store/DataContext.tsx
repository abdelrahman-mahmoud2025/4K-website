import React, { createContext, useContext, useMemo } from "react";
import Fuse from "fuse.js";
import { Product, Feed, Download, Installer, SearchablePage } from "../types";
import { allProducts, allFeeds, allDownloads, allInstallers, allPages } from "../data";

interface DataContextType {
  products: Product[];
  feeds: Feed[];
  downloads: Download[];
  installers: Installer[];
  loading: boolean;
  search: (query: string) => {
    products: Product[];
    feeds: Feed[];
    downloads: Download[];
    pages: SearchablePage[];
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Fuse.js configuration
const fuseOptions = {
  threshold: 0.3,
  ignoreLocation: true,
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Use useMemo for Fuse instances - only created once
  const fuseProducts = useMemo(
    () =>
      new Fuse(allProducts, {
        ...fuseOptions,
        keys: [
          "name.en",
          "name.ar",
          "brand",
          "description.en",
          "description.ar",
        ],
      }),
    [],
  );

  const fuseFeeds = useMemo(
    () =>
      new Fuse(allFeeds, {
        ...fuseOptions,
        keys: ["channelName", "satellite", "type"],
      }),
    [],
  );

  const fuseDownloads = useMemo(
    () =>
      new Fuse(allDownloads, {
        ...fuseOptions,
        keys: ["fileName", "brand", "model"],
      }),
    [],
  );

  const fusePages = useMemo(
    () =>
      new Fuse(allPages, {
        ...fuseOptions,
        keys: ["title.en", "title.ar", "description.en", "description.ar"],
      }),
    [],
  );

  // Memoized search function
  const search = useMemo(
    () => (query: string) => {
      if (!query.trim()) return { products: [], feeds: [], downloads: [], pages: [] };

      return {
        products: fuseProducts.search(query).map((r) => r.item),
        feeds: fuseFeeds.search(query).map((r) => r.item),
        downloads: fuseDownloads.search(query).map((r) => r.item),
        pages: fusePages.search(query).map((r) => r.item),
      };
    },
    [fuseProducts, fuseFeeds, fuseDownloads, fusePages],
  );

  // Context value - memoized to prevent unnecessary re-renders
  const value = useMemo<DataContextType>(
    () => ({
      products: allProducts,
      feeds: allFeeds,
      downloads: allDownloads,
      installers: allInstallers,
      loading: false,
      search,
    }),
    [search],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};
