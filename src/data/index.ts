import { Product, Feed, Download, Installer, SearchablePage } from '../types';

import productsData from './products.json';
import feedsData from './feeds.json';
import downloadsData from './downloads.json';
import installersData from './branches.json';
import { allPages } from './pages';

export const allProducts = productsData as Product[];
export const allFeeds = feedsData as Feed[];
export const allDownloads = downloadsData as Download[];
export const allInstallers = installersData as Installer[];
export { allPages };

export const siteData = {
  products: allProducts,
  feeds: allFeeds,
  downloads: allDownloads,
  installers: allInstallers,
  pages: allPages,
};