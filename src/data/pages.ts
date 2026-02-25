import { SearchablePage } from '../types';

export const allPages: SearchablePage[] = [
  {
    id: 'home',
    title: { en: 'Home', ar: 'الرئيسية' },
    path: '/',
    description: { en: 'Main page of C2Z Store', ar: 'الصفحة الرئيسية لمتجر C2Z' }
  },
  {
    id: 'shop',
    title: { en: 'Shop', ar: 'المتجر' },
    path: '/shop',
    description: { en: 'Browse all satellite products', ar: 'تصفح جميع منتجات الستالايت' }
  },
  {
    id: 'offers',
    title: { en: 'Offers', ar: 'العروض' },
    path: '/offers',
    description: { en: 'Special deals and discounts', ar: 'عروض وخصومات خاصة' }
  },
  {
    id: 'patcher',
    title: { en: 'Patcher', ar: 'باتشات' },
    path: '/patcher',
    description: { en: 'Find software for your receiver', ar: 'ابحث عن سوفتوير لجهازك' }
  },
  {
    id: 'feeds',
    title: { en: 'Feeds', ar: 'الفيدات' },
    path: '/feeds',
    description: { en: 'Latest satellite feeds', ar: 'أحدث فيدات الأقمار الصناعية' }
  },
  {
    id: 'downloads',
    title: { en: 'Downloads', ar: 'التحميلات' },
    path: '/downloads',
    description: { en: 'Download center', ar: 'مركز التحميلات' }
  },
  {
    id: 'bundle',
    title: { en: 'Bundle Builder', ar: 'باقات' },
    path: '/bundle',
    description: { en: 'Build your own satellite system', ar: 'صمم نظام الستالايت الخاص بك' }
  },
  {
    id: 'branches',
    title: { en: 'Branches & Services', ar: 'الفروع والخدمات' },
    path: '/branches',
    description: { en: 'Find locations and maintenance', ar: 'أماكن الفروع وخدمات الصيانة' }
  },
  {
    id: 'about',
    title: { en: 'About Us', ar: 'من نحن' },
    path: '/about',
    description: { en: 'Learn more about C2Z Store', ar: 'تعرف أكثر على متجر C2Z' }
  },
  {
    id: 'refund-terms',
    title: { en: 'Refund Policy', ar: 'سياسة الاسترجاع' },
    path: '/refund-terms',
    description: { en: 'Terms and conditions for refunds', ar: 'الشروط والأحكام للاسترجاع' }
  }
];
