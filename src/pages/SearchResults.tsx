import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useData } from '../store/DataContext';
import ProductCard from '../components/ProductCard';
import { Radio, Download, Tv, ArrowRight, Search, Sparkles } from 'lucide-react';

const SearchResults: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { search, loading } = useData();

  const results = search(query);
  const lang = i18n.language as 'ar' | 'en';

  if (loading) return <div className="text-center py-20 text-text animate-pulse">{t('loading')}</div>;

  const hasResults = results.products.length > 0 || results.feeds.length > 0 || results.downloads.length > 0 || results.pages?.length > 0;

  return (
    <div className="container mx-auto px-4 py-12 min-h-[80vh]">
      {/* Header Frame */}
      <div className="bg-surface/50 backdrop-blur-md border border-border rounded-[2rem] p-8 md:p-10 mb-12 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none transform group-hover:scale-110 duration-700">
           <Search size={200} />
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
            <Sparkles size={12} /> {t('search_results')}
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-text tracking-tight mb-2">
            {t('results_for')} <span className="text-primary italic">"{query}"</span>
          </h1>
          <p className="text-subtext flex items-center gap-2">
            {!hasResults ? t('no_results') : `${results.products.length + results.feeds.length + results.downloads.length + (results.pages?.length || 0)} ${t('results_found')}`}
          </p>
        </div>
      </div>

      {!hasResults && (
        <div className="text-center py-24 bg-surface rounded-[2.5rem] border border-border border-dashed">
          <Search size={64} className="text-subtext/20 mx-auto mb-6" />
          <p className="text-2xl font-bold text-subtext">{t('no_results')}</p>
          <p className="text-subtext mt-2">{t('no_results_hint')}</p>
        </div>
      )}

      {/* Pages */}
      {results.pages?.length > 0 && (
        <section className="mb-16">
           <h2 className="text-2xl font-bold text-text mb-8 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary"><ArrowRight size={20} /></div>
            Pages <span className="text-subtext font-normal text-lg">({results.pages.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {results.pages.map(page => (
               <Link key={page.id} to={page.path} className="group bg-surface p-6 rounded-2xl border border-border hover:border-primary transition-all shadow-sm hover:shadow-xl">
                  <div className="font-bold text-text text-lg group-hover:text-primary transition-colors">{page.title[lang]}</div>
                  {page.description && <div className="text-sm text-subtext mt-2 leading-relaxed">{page.description[lang]}</div>}
               </Link>
             ))}
          </div>
        </section>
      )}

      {/* Products */}
      {results.products.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-text mb-8 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary"><Tv size={20} /></div>
            {t('products')} <span className="text-subtext font-normal text-lg">({results.products.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {results.products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Feeds */}
      {results.feeds.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-text mb-8 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary"><Radio size={20} /></div>
            {t('feeds')} <span className="text-subtext font-normal text-lg">({results.feeds.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {results.feeds.map(f => (
               <div key={f.id} className="bg-surface p-6 rounded-2xl border border-border hover:border-primary/50 transition-all shadow-sm">
                  <div className="font-bold text-text text-lg mb-1">{f.channelName}</div>
                  <div className="text-sm text-subtext font-mono flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                    {f.satellite} - {f.frequency}
                  </div>
               </div>
             ))}
          </div>
        </section>
      )}

      {/* Downloads */}
      {results.downloads.length > 0 && (
        <section className="mb-16">
           <h2 className="text-2xl font-bold text-text mb-8 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary"><Download size={20} /></div>
            {t('downloads')} <span className="text-subtext font-normal text-lg">({results.downloads.length})</span>
          </h2>
          <div className="space-y-4">
             {results.downloads.map(d => (
               <div key={d.id} className="bg-surface p-5 rounded-2xl border border-border flex justify-between items-center hover:border-primary/50 transition-all shadow-sm group">
                  <div className="flex items-center gap-4">
                    <div className="bg-background p-3 rounded-xl text-subtext group-hover:text-primary transition-colors border border-border">
                      <Download size={24} />
                    </div>
                    <div>
                      <div className="font-bold text-text text-lg">{d.fileName}</div>
                      <div className="text-sm text-subtext">{d.brand} {d.model}</div>
                    </div>
                  </div>
                  <button className="bg-primary/10 text-primary p-3 rounded-xl hover:bg-primary hover:text-black transition-all active:scale-90 border border-primary/20">
                    <Download size={20} />
                  </button>
               </div>
             ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SearchResults;