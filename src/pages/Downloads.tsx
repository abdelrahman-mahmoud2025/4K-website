import React from 'react';
import { useTranslation } from 'react-i18next';
import { useData } from '../store/DataContext';
import { Download as DownloadIcon, FileText } from 'lucide-react';

const Downloads: React.FC = () => {
  const { t } = useTranslation();
  const { downloads, loading } = useData();

  if (loading) return <div className="text-text text-center py-20">{t('loading_downloads')}</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-text mb-8 border-r-4 border-green-500 pr-4">
        {t('downloads')}
      </h1>

      <div className="space-y-4">
        {downloads.map(file => (
          <div key={file.id} className="bg-surface rounded-xl p-4 border border-border flex flex-col md:flex-row items-center justify-between gap-4 hover:border-primary/50 transition-colors shadow-sm">
            <div className="flex items-center gap-4 w-full">
              <div className="bg-background p-3 rounded-lg text-subtext border border-border">
                <FileText size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-text">{file.fileName}</h4>
                <div className="flex gap-4 text-sm text-subtext mt-1">
                  <span>{file.brand} {file.model}</span>
                  <span>•</span>
                  <span>{file.size}</span>
                  <span>•</span>
                  <span>{file.date}</span>
                </div>
              </div>
            </div>
            
            <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-black font-bold py-2 px-6 rounded-lg transition-colors border border-primary/20 hover:border-primary">
              <DownloadIcon size={18} />
              {t('download_btn')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Downloads;