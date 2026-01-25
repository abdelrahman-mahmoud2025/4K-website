export interface LocalizedString {
  ar: string;
  en: string;
}

// Product variant for items with multiple options (sizes, lengths, subscriptions, etc.)
export interface ProductVariant {
  id: string;
  name: LocalizedString;
  price: number;
  originalPrice?: number;
  inStock?: boolean;
}

export interface Product {
  id: string;
  name: LocalizedString;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string;
  image: string;
  images?: string[]; // Multiple images for slider
  description: LocalizedString;
  features: (LocalizedString | string)[];
  specs?: Record<string, string>; // Key-value for comparison
  rating: number;
  inStock: boolean;
  isOffer?: boolean;
  offerEndsAt?: string;
  createdAt?: string; // For Newest sort
  variants?: ProductVariant[]; // For products with multiple options
}



export interface Feed {
  id: string;
  channelName: string;
  frequency: string;
  polarization: 'H' | 'V';
  symbolRate: number;
  satellite: string;
  status: 'FTA' | 'Encrypted';
  type: 'Sports' | 'News' | 'Movies';
}

export interface Download {
  id: string;
  fileName: string;
  brand: string;
  model: string;
  date: string;
  size: string;
  version: string;
}

export interface Installer {
  id: string;
  name: string;
  governorate: string;
  phone: string;
  rating: number;
  specialties: string[];
  verified: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariant?: ProductVariant; // The variant selected when adding to cart
}

export interface SearchablePage {
  id: string;
  title: LocalizedString;
  path: string;
  description?: LocalizedString;
}