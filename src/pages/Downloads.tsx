import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useData } from '../store/DataContext';
import { Download as DownloadIcon, FileText, Search, X } from 'lucide-react';

const Downloads: React.FC = () => {
  const { t } = useTranslation();
  const { downloads, loading } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) return <div className="text-text text-center py-20 animate-pulse">{t('loading_downloads')}</div>;

  const filteredDownloads = downloads.filter(file => 
    file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12 min-h-[80vh]">
      {/* Header */}
      <div className="bg-surface/50 backdrop-blur-md border border-border rounded-3xl p-8 mb-10 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
           <DownloadIcon size={200} />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl mb-4 text-primary">
             <DownloadIcon size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-2">
             {t('downloads')}
          </h1>
          <p className="text-subtext text-lg max-w-xl leading-relaxed">
             {t('software_center_desc')}
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
          className="block w-full pl-12 pr-12 py-4 border border-border rounded-2xl bg-surface/80 text-text placeholder-subtext focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm text-lg"
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

      {/* Results */}
      <div className="space-y-4">
        {filteredDownloads.length > 0 ? (
          filteredDownloads.map((file, index) => (
            <div 
              key={file.id} 
              className="bg-surface rounded-2xl p-5 border border-border flex flex-col md:flex-row items-center justify-between gap-6 hover:border-primary/50 hover:shadow-lg transition-all group animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-5 w-full">
                <div className="bg-background p-4 rounded-xl text-primary border border-border group-hover:scale-110 transition-transform duration-300">
                  <FileText size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-text mb-1 group-hover:text-primary transition-colors">{file.fileName}</h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-subtext">
                    <span className="flex items-center gap-1 bg-background px-2 py-0.5 rounded border border-border/50">
                      {file.brand} {file.model}
                    </span>
                    <span className="flex items-center gap-1">• {file.size}</span>
                    <span className="flex items-center gap-1">• {file.date}</span>
                  </div>
                </div>
              </div>
              
              <button className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 bg-primary text-black font-bold py-3 px-8 rounded-xl transition-all transform active:scale-95 hover:bg-white hover:shadow-primary/20 hover:shadow-lg">
                <DownloadIcon size={20} />
                {t('download_btn')}
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-surface/30 rounded-3xl border border-border border-dashed">
            <Search className="w-16 h-16 text-subtext/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text mb-2">{t('no_results')}</h3>
            <p className="text-subtext">{t('no_results_hint')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Downloads;