import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Users, Award, Globe, MapPin, Phone, Mail, Facebook, Send, User, Map, Clock, Instagram } from 'lucide-react';

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Intro Section */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-text mb-6">
            {t('about_page.title')}
          </h1>
          <p className="text-text/70 text-lg leading-relaxed whitespace-pre-line mb-8">
            {t('about_page.content')}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
             <div className="flex items-center gap-2 text-primary font-bold"><Award /> {t('official_distributor')}</div>
             <div className="flex items-center gap-2 text-primary font-bold"><Users /> {t('community_count')}</div>
             <div className="flex items-center gap-2 text-primary font-bold"><Globe /> {t('egypt_wide')}</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { icon: ShoppingBag, color: 'text-primary', val: '3000+', label: t('products_sold') },
             { icon: Users, color: 'text-secondary', val: '1500+', label: t('happy_customers_count') },
             { icon: Award, color: 'text-green-500', val: '#1', label: t('top_rated_store') },
             { icon: Clock, color: 'text-blue-500', val: '24/7', label: t('online_support') },
           ].map((stat, idx) => (
             <div key={idx} className="bg-surface border border-border p-6 rounded-2xl text-center hover:border-primary transition-all hover:-translate-y-1 shadow-sm">
                <stat.icon className={`mx-auto ${stat.color} mb-4`} size={32} />
                <h3 className="text-text font-bold text-2xl mb-1">{stat.val}</h3>
                <p className="text-text/60 text-sm">{stat.label}</p>
             </div>
           ))}
        </div>

        {/* Owner & Team */}
        <div className="bg-surface rounded-3xl border border-border p-8 md:p-12 shadow-lg flex flex-col md:flex-row items-center gap-8">
           <div className="w-32 h-32 md:w-48 md:h-48 bg-background rounded-full overflow-hidden border-4 border-primary/20 shrink-0">
             <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop" alt="CEO" className="w-full h-full object-cover" />
           </div>
           <div className="text-center md:text-left">
              <div className="text-secondary font-bold uppercase tracking-widest text-sm mb-2">{t('founder_title')}</div>
              <h2 className="text-3xl font-bold text-text mb-4">{t('founder_name')}</h2>
              <p className="text-text/70 text-lg max-w-xl mb-6">
                {t('founder_quote')}
              </p>
              <div className="flex justify-center md:justify-start gap-4">
                 <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"><Facebook size={20} /></button>
                 <button className="bg-sky-500 text-white p-2 rounded-full hover:bg-sky-600 transition-colors"><Send size={20} /></button>
              </div>
           </div>
        </div>

        {/* Contact & Branches */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Branch Info */}
           <div className="space-y-6">
              <h2 className="text-3xl font-bold text-text mb-6 flex items-center gap-3">
                 <MapPin className="text-primary" /> {t('our_branches')}
              </h2>
              
              {[
                { name: t('branch_cairo'), address: '123 Satellite St, Downtown', phone: '+20 123 456 789' },
                { name: t('branch_alex'), address: '45 Corniche Rd, Stanley', phone: '+20 123 456 790' },
                { name: t('branch_giza'), address: '88 Haram St, Giza', phone: '+20 123 456 791' },
              ].map((branch, idx) => (
                <div key={idx} className="bg-surface border border-border p-6 rounded-xl hover:border-primary transition-colors">
                   <h3 className="text-xl font-bold text-text mb-2">{branch.name}</h3>
                   <div className="space-y-2 text-text/70 text-sm">
                      <p className="flex items-center gap-2"><MapPin size={16} /> {branch.address}</p>
                      <p className="flex items-center gap-2"><Phone size={16} /> {branch.phone}</p>
                   </div>
                </div>
              ))}
           </div>

           {/* Location Map Placeholder */}
           <div className="bg-background rounded-3xl overflow-hidden border border-border h-full min-h-100px relative group">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" 
                alt="Map Location" 
                className="w-full h-full object-cover opacity-50 group-hover:opacity-60 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                 <a 
                   href="https://maps.google.com" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="bg-primary text-black font-bold py-3 px-8 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
                 >
                   <Map /> {t('open_google_maps')}
                 </a>
              </div>
           </div>
        </div>

        {/* Social Cards */}
        <div>
           <h2 className="text-3xl font-bold text-text mb-8 text-center">{t('join_community')}</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a href="#" className="bg-[#1877F2] text-white p-8 rounded-2xl flex flex-col items-center justify-center gap-4 hover:opacity-90 transition-opacity">
                 <Facebook size={48} />
                 <span className="text-2xl font-bold">Facebook</span>
                 <span className="opacity-80">{t('follow_offers')}</span>
              </a>
              <a href="#" className="bg-[#E4405F] text-white p-8 rounded-2xl flex flex-col items-center justify-center gap-4 hover:opacity-90 transition-opacity">
                 <Instagram size={48} />
                 <span className="text-2xl font-bold">Instagram</span>
                 <span className="opacity-80">{t('see_products')}</span>
              </a>
              <a href="#" className="bg-[#25D366] text-white p-8 rounded-2xl flex flex-col items-center justify-center gap-4 hover:opacity-90 transition-opacity">
                 <Phone size={48} />
                 <span className="text-2xl font-bold">WhatsApp</span>
                 <span className="opacity-80">{t('chat_support')}</span>
              </a>
           </div>
        </div>

      </div>
    </div>
  );
};

export default About;