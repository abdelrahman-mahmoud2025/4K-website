import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useData } from '../store/DataContext';
import { Radio, Lock, Search, X, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const Feeds: React.FC = () => {
  const { t } = useTranslation();
  const { feeds, loading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (loading) return <div className="text-text text-center py-20 animate-pulse">{t('loading_feeds')}</div>;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success(t('copied', 'Copied to clipboard!'));
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredFeeds = feeds.filter(feed => 
    feed.channelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feed.satellite.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feed.frequency.includes(searchTerm)
  );

  return (
    <div className="container mx-auto px-4 py-12 min-h-[80vh]">
      {/* Header */}
      <div className="bg-surface/50 backdrop-blur-md border border-border rounded-3xl p-8 mb-10 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
           <Radio size={200} />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center p-3 bg-secondary/10 rounded-xl mb-4 text-secondary">
             <Radio size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-2">
             {t('feeds')}
          </h1>
          <p className="text-subtext text-lg max-w-xl leading-relaxed">
             {t('feeds_subtitle', 'Live satellite frequency updates and channel data')}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8 relative max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-subtext" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-12 py-4 border border-border rounded-2xl bg-surface/80 text-text placeholder-subtext focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all shadow-sm text-lg"
          placeholder={t('search_placeholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-subtext hover:text-text cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeeds.length > 0 ? (
          filteredFeeds.map((feed, index) => (
            <div 
              key={feed.id} 
              className="bg-surface rounded-2xl p-6 border border-border hover:border-secondary/50 hover:shadow-lg transition-all group animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex justify-between items-start mb-5">
                <div className="p-3 bg-background rounded-xl text-secondary border border-border group-hover:scale-110 transition-transform duration-300">
                  <Radio size={24} />
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${feed.status === 'FTA' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                  {feed.status === 'Encrypted' && <Lock size={12} />}
                  {t(`status.${feed.status}`)}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-text mb-1 group-hover:text-secondary transition-colors">{feed.channelName}</h3>
              <p className="text-subtext text-sm mb-5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary/50"></span>
                {feed.satellite}
              </p>
              
              <div 
                onClick={() => handleCopy(`${feed.frequency} ${feed.polarization} ${feed.symbolRate}`, feed.id)}
                className="bg-background rounded-xl p-4 font-mono text-center text-secondary text-lg tracking-wider border border-border group-hover:border-secondary/30 transition-all cursor-pointer relative overflow-hidden group/freq"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {feed.frequency} {feed.polarization} {feed.symbolRate}
                  {copiedId === feed.id ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-subtext opacity-0 group-hover/freq:opacity-100 transition-opacity" />}
                </div>
                {/* Visual feedback overlay */}
                <div className={`absolute inset-0 bg-secondary/5 transition-opacity ${copiedId === feed.id ? 'opacity-100' : 'opacity-0'}`}></div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-surface/30 rounded-3xl border border-border border-dashed">
            <Search className="w-16 h-16 text-subtext/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text mb-2">{t('no_results')}</h3>
            <p className="text-subtext">{t('no_results_hint')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feeds;