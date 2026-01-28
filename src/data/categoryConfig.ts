import {
  Tv,
  Radio,
  Gamepad2,
  Disc,
  Cable,
  Wrench,
  Camera,
  Settings,
  Plug,
  Monitor,
  Cpu,
  Package,
  type LucideIcon,
} from "lucide-react";

export interface CategoryInfo {
  name: {
    ar: string;
    en: string;
  };
  icon: LucideIcon;
  description?: {
    ar: string;
    en: string;
  };
}

// Category configuration with Arabic/English names and icons
// Categories are auto-extracted from products.json, this config provides display info
export const categoryConfig: Record<string, CategoryInfo> = {
  // Receivers - رسيفرات
  receivers: {
    name: { ar: "رسيفرات", en: "Receivers" },
    icon: Tv,
    description: { ar: "رسيفرات 4K وHD", en: "4K & HD Receivers" },
  },

  // LNB - عدسات
  lnb: {
    name: { ar: "LNB", en: "LNB" },
    icon: Radio,
    description: { ar: "عدسات 1-8 مخرج", en: "1-8 Port LNB" },
  },

  // Remotes - ريموتات
  remotes: {
    name: { ar: "ريموتات", en: "Remotes" },
    icon: Gamepad2,
    description: { ar: "ريموتات رسيفر وشاشات", en: "Receiver & TV Remotes" },
  },

  // Dishes - أطباق
  dishes: {
    name: { ar: "أطباق", en: "Dishes" },
    icon: Disc,
    description: { ar: "أطباق ستالايت", en: "Satellite Dishes" },
  },

  // Cables - كابلات
  cables: {
    name: { ar: "كابلات", en: "Cables" },
    icon: Cable,
    description: { ar: "كابلات HDMI وRCA", en: "HDMI & RCA Cables" },
  },

  // Accessories - اكسسوارات
  accessories: {
    name: { ar: "اكسسوارات", en: "Accessories" },
    icon: Package,
    description: { ar: "حوامل ومستلزمات", en: "Mounts & Accessories" },
  },

  // Servers - سيرفرات
  servers: {
    name: { ar: "منصات", en: "Servers" },
    icon: Cpu,
    description: { ar: "IPTV و Sharing", en: "IPTV & Sharing" },
  },

  // CCTV - كاميرات مراقبة
  cctv: {
    name: { ar: "كاميرات مراقبة", en: "CCTV" },
    icon: Camera,
    description: { ar: "كاميرات وDVR", en: "Cameras & DVR" },
  },

  // Wire/Cables - سلك
  wire: {
    name: { ar: "سلك", en: "Wire" },
    icon: Cable,
    description: { ar: "سلك ستالايت", en: "Satellite Wire" },
  },

  // DiSEqC - دايزك
  diseqc: {
    name: { ar: "دايزك", en: "DiSEqC" },
    icon: Settings,
    description: { ar: "محولات دايزك", en: "DiSEqC Switches" },
  },

  // Adapters - ادابتور
  adapters: {
    name: { ar: "ادابتور", en: "Adapters" },
    icon: Plug,
    description: { ar: "محولات كهرباء", en: "Power Adapters" },
  },

  // TV Mounts - حوامل شاشات
  mounts: {
    name: { ar: "حوامل شاشات", en: "TV Mounts" },
    icon: Monitor,
    description: { ar: "حوامل ثابتة ومتحركة", en: "Fixed & Motion Mounts" },
  },

  // HD Switch - سوتش
  switch: {
    name: { ar: "سوتش HD", en: "HD Switch" },
    icon: Settings,
    description: { ar: "محولات HDMI", en: "HDMI Switches" },
  },

  // Updates - تحديثات
  updates: {
    name: { ar: "تحديثات", en: "Updates" },
    icon: Wrench,
    description: { ar: "تحديثات رسيفرات", en: "Receiver Updates" },
  },

  // Screens - شاشات
  screens: {
    name: { ar: "شاشات عرض", en: "Displays" },
    icon: Monitor,
    description: { ar: "شاشات عرض", en: "Display Screens" },
  },
};

// Default config for unknown categories
export const defaultCategoryInfo: CategoryInfo = {
  name: { ar: "أخرى", en: "Other" },
  icon: Package,
  description: { ar: "منتجات أخرى", en: "Other Products" },
};

// Helper function to get category info with fallback
export const getCategoryInfo = (categoryId: string): CategoryInfo => {
  return categoryConfig[categoryId] || defaultCategoryInfo;
};

// Helper function to get category name based on language
export const getCategoryName = (
  categoryId: string,
  lang: "ar" | "en",
): string => {
  const info = getCategoryInfo(categoryId);
  return info.name[lang];
};
