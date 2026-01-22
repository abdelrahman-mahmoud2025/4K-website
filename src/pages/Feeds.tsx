import React from 'react';
import { useTranslation } from 'react-i18next';
import { useData } from '../store/DataContext';
import { Radio, Lock } from 'lucide-react';

const Feeds: React.FC = () => {
  const { t } = useTranslation();
  const { feeds, loading } = useData();

  if (loading) return <div className="text-text text-center py-20">{t('loading_feeds')}</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-text mb-8 border-r-4 border-secondary pr-4">
        {t('feeds')}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feeds.map(feed => (
          <div key={feed.id} className="bg-surface rounded-xl p-6 border border-border hover:border-secondary transition-colors group shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-background rounded-full text-secondary border border-border">
                <Radio size={24} />
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold ${feed.status === 'FTA' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                {feed.status === 'Encrypted' && <Lock size={10} className="inline me-1" />}
                {t(`status.${feed.status}`)}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-text mb-2">{feed.channelName}</h3>
            <p className="text-subtext text-sm mb-4">{feed.satellite}</p>
            
            <div className="bg-background rounded-lg p-3 font-mono text-center text-primary text-lg tracking-wider border border-border group-hover:border-secondary transition-colors">
              {feed.frequency} {feed.polarization} {feed.symbolRate}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feeds;