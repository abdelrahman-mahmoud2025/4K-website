import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useData } from '../store/DataContext';
import ProductCard from '../components/ProductCard';
import { Radio, Download, Tv, ArrowRight } from 'lucide-react';

const SearchResults: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { search, loading } = useData();

  const results = search(query);
  const lang = i18n.language as 'ar' | 'en';

  if (loading) return <div className="text-center py-20 text-text">{t('loading')}</div>;

  const hasResults = results.products.length > 0 || results.feeds.length > 0 || results.downloads.length > 0 || results.pages?.length > 0;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-text mb-2">{t('search_results')}</h1>
      <p className="text-subtext mb-8">{t('results_for')} "{query}"</p>

      {!hasResults && (
        <div className="text-center py-20 bg-surface rounded-xl border border-border">
          <p className="text-xl text-subtext">{t('no_results')}</p>
        </div>
      )}

      {/* Pages */}
      {results.pages?.length > 0 && (
        <section className="mb-12">
           <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
            <ArrowRight /> Pages ({results.pages.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {results.pages.map(page => (
               <Link key={page.id} to={page.path} className="bg-surface p-4 rounded-lg border border-border hover:border-primary transition-colors block">
                  <div className="font-bold text-text">{page.title[lang]}</div>
                  {page.description && <div className="text-sm text-subtext">{page.description[lang]}</div>}
               </Link>
             ))}
          </div>
        </section>
      )}

      {/* Products */}
      {results.products.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
            <Tv /> {t('products')} ({results.products.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}



      {/* Feeds */}
      {results.feeds.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
            <Radio /> {t('feeds')} ({results.feeds.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {results.feeds.map(f => (
               <div key={f.id} className="bg-surface p-4 rounded-lg border border-border">
                  <div className="font-bold text-text">{f.channelName}</div>
                  <div className="text-sm text-subtext">{f.satellite} - {f.frequency}</div>
               </div>
             ))}
          </div>
        </section>
      )}

      {/* Downloads */}
      {results.downloads.length > 0 && (
        <section className="mb-12">
           <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
            <Download /> {t('downloads')} ({results.downloads.length})
          </h2>
          <div className="space-y-2">
             {results.downloads.map(d => (
               <div key={d.id} className="bg-surface p-4 rounded-lg border border-border flex justify-between items-center">
                  <div>
                    <div className="font-bold text-text">{d.fileName}</div>
                    <div className="text-sm text-subtext">{d.brand} {d.model}</div>
                  </div>
                  <button className="text-primary hover:text-text"><Download size={20} /></button>
               </div>
             ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SearchResults;