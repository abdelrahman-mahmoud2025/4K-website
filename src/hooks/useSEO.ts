import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  product?: {
    name: string;
    price: number;
    currency?: string;
    brand?: string;
    availability?: 'InStock' | 'OutOfStock';
    image?: string;
    description?: string;
    sku?: string;
  };
}

const SITE_NAME = 'C2Z Store - سي تو زد ستور';
const DEFAULT_DESCRIPTION = 'C2Z Store - سي تو زد ستور. متجر متخصص في رسيفرات 4K، نوفا، تايجر، سيناتور، ستارسات، أيكون. سيرفرات Forever، G-Share، Nashare، IPTV. أفضل الأسعار في مصر.';
const BASE_URL = 'https://c2zstore.com';

/**
 * Custom hook for managing SEO meta tags dynamically
 * Updates document title, meta description, Open Graph, and Twitter cards
 */
export const useSEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image = '/og-image.jpg',
  url,
  type = 'website',
  product
}: SEOProps = {}) => {
  const location = useLocation();
  const currentUrl = url || `${BASE_URL}${location.pathname}`;
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const fullImage = image.startsWith('http') ? image : `${BASE_URL}${image}`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Helper function to update or create meta tag
    const updateMetaTag = (selector: string, content: string, attr = 'content') => {
      let element = document.querySelector(selector) as HTMLMetaElement;
      if (element) {
        element.setAttribute(attr, content);
      } else {
        element = document.createElement('meta');
        const [attrType, attrValue] = selector.replace(/[\[\]'"]/g, '').split('=');
        element.setAttribute(attrType.replace('meta', '').trim(), attrValue);
        element.setAttribute(attr, content);
        document.head.appendChild(element);
      }
    };

    // Update meta description
    updateMetaTag('meta[name="description"]', description);

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical) {
      canonical.href = currentUrl;
    }

    // Open Graph tags
    updateMetaTag('meta[property="og:title"]', fullTitle);
    updateMetaTag('meta[property="og:description"]', description);
    updateMetaTag('meta[property="og:url"]', currentUrl);
    updateMetaTag('meta[property="og:image"]', fullImage);
    updateMetaTag('meta[property="og:type"]', type === 'product' ? 'product' : 'website');

    // Twitter Card tags
    updateMetaTag('meta[name="twitter:title"]', fullTitle);
    updateMetaTag('meta[name="twitter:description"]', description);
    updateMetaTag('meta[name="twitter:image"]', fullImage);

    // Product structured data
    if (product) {
      // Remove existing product schema if any
      const existingSchema = document.querySelector('script[data-seo-product]');
      if (existingSchema) {
        existingSchema.remove();
      }

      // Add new product schema
      const schema = document.createElement('script');
      schema.type = 'application/ld+json';
      schema.setAttribute('data-seo-product', 'true');
      schema.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description || description,
        image: product.image ? (product.image.startsWith('http') ? product.image : `${BASE_URL}${product.image}`) : fullImage,
        brand: {
          '@type': 'Brand',
          name: product.brand || 'C2Z Store'
        },
        sku: product.sku,
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: product.currency || 'EGP',
          availability: `https://schema.org/${product.availability || 'InStock'}`,
          seller: {
            '@type': 'Organization',
            name: SITE_NAME
          }
        }
      });
      document.head.appendChild(schema);

      // Cleanup on unmount
      return () => {
        const schemaToRemove = document.querySelector('script[data-seo-product]');
        if (schemaToRemove) {
          schemaToRemove.remove();
        }
      };
    }
  }, [fullTitle, description, currentUrl, fullImage, type, product]);

  return { title: fullTitle, description, url: currentUrl };
};

export default useSEO;
