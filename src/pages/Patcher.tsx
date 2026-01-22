import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useData } from '../store/DataContext';
import { Download, Cpu, Disc, CheckCircle } from 'lucide-react';

const Patcher: React.FC = () => {
  const { t } = useTranslation();
  const { downloads } = useData();
  
  const [step, setStep] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  const brands = Array.from(new Set(downloads.map(d => d.brand)));
  const models = downloads
    .filter(d => d.brand === selectedBrand)
    .map(d => d.model);

  const matchingFiles = downloads.filter(d => d.brand === selectedBrand && d.model === selectedModel);

  const reset = () => {
    setStep(1);
    setSelectedBrand('');
    setSelectedModel('');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-text mb-2">{t('patcher.title')}</h1>
          <p className="text-subtext">{t('patcher.subtitle')}</p>
        </div>

        {/* Steps */}
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-border -z-10"></div>
          {[1, 2, 3].map(s => (
            <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 transition-colors ${step >= s ? 'bg-primary border-primary text-black' : 'bg-surface border-border text-subtext'}`}>
              {s}
            </div>
          ))}
        </div>

        <div className="bg-surface border border-border rounded-2xl p-8 shadow-xl">
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold text-text mb-6 flex items-center gap-2">
                <Disc className="text-primary" /> {t('patcher.select_brand')}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {brands.map(brand => (
                  <button
                    key={brand}
                    onClick={() => { setSelectedBrand(brand); setStep(2); }}
                    className="bg-background hover:bg-primary hover:text-black text-text py-4 rounded-xl border border-border transition-all font-bold shadow-sm"
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold text-text mb-6 flex items-center gap-2">
                <Cpu className="text-primary" /> {t('patcher.select_model')}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {models.map(model => (
                  <button
                    key={model}
                    onClick={() => { setSelectedModel(model); setStep(3); }}
                    className="bg-background hover:bg-primary hover:text-black text-text py-4 rounded-xl border border-border transition-all font-bold shadow-sm"
                  >
                    {model}
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(1)} className="mt-6 text-subtext hover:text-primary text-sm flex items-center gap-1">
                &larr; {t('back')}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in text-center">
              <div className="mb-6">
                <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-text">{t('patcher.success')}</h2>
                <p className="text-subtext">{selectedBrand} - {selectedModel}</p>
              </div>
              
              <div className="space-y-3 mb-8">
                {matchingFiles.map(file => (
                  <div key={file.id} className="bg-background p-4 rounded-lg border border-border flex items-center justify-between">
                    <div className="text-left">
                      <div className="font-bold text-text">{file.fileName}</div>
                      <div className="text-xs text-subtext">{file.version} • {file.date}</div>
                    </div>
                    <button className="bg-primary text-black px-4 py-2 rounded font-bold hover:bg-white border border-transparent hover:border-primary flex items-center gap-2 transition-all">
                      <Download size={16} /> {t('download_btn')}
                    </button>
                  </div>
                ))}
              </div>

              <button onClick={reset} className="text-primary hover:underline">
                {t('patcher.start_over')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Patcher;