import React from 'react';
import { useLanguage } from '../LanguageContext';

const Help: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="min-h-screen py-24 container mx-auto px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 mb-4 rounded-full border border-accent-cyan/20 bg-accent-cyan/5 text-[10px] font-black uppercase tracking-widest text-accent-cyan">
            {t('help.tag')}
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            {t('help.title')} <span className="gradient-text">{t('help.title_highlight')}</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            {t('help.subtitle')}
          </p>
        </div>

        <div className="space-y-12">
          {/* Step 1: Registration */}
          <div className="glass p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-9xl leading-none select-none group-hover:scale-110 transition-transform duration-500">1</div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-accent-purple flex items-center justify-center text-sm">1</span>
              {t('help.step1_title')}
            </h3>
            <p className="text-gray-400 mb-8 leading-relaxed">
              {t('help.step1_desc')}
            </p>
            <a 
              href="https://kie.ai?ref=5a872d0ae7dd674867d4b3975d4a7204" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-accent-purple to-accent-pink text-white font-bold hover:brightness-110 transition-all shadow-lg shadow-accent-purple/20 active:scale-95"
            >
              {t('help.step1_btn')}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
          </div>

          {/* Step 2: Generation */}
          <div className="glass p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-9xl leading-none select-none group-hover:scale-110 transition-transform duration-500">2</div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-accent-cyan flex items-center justify-center text-sm text-black">2</span>
              {t('help.step2_title')}
            </h3>
            <div className="space-y-6 text-gray-400">
              <p>
                {t('help.step2_intro')}
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 min-w-1.5 min-h-1.5 rounded-full bg-accent-cyan"></div>
                  <div>
                    <strong className="text-white block mb-1">{t('help.step2_li1_title')}</strong>
                    {t('help.step2_li1_desc')}
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 min-w-1.5 min-h-1.5 rounded-full bg-accent-cyan"></div>
                  <div>
                    <strong className="text-white block mb-1">{t('help.step2_li2_title')}</strong>
                    {t('help.step2_li2_desc')}
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Step 3: Animation */}
          <div className="glass p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-9xl leading-none select-none group-hover:scale-110 transition-transform duration-500">3</div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-accent-pink flex items-center justify-center text-sm">3</span>
              {t('help.step3_title')}
            </h3>
            <div className="space-y-6 text-gray-400">
              <p>
                {t('help.step3_intro')}
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-accent-pink/50 transition-colors">
                  <h4 className="text-white font-bold mb-2">Veo 3.1</h4>
                  <p className="text-sm">{t('help.step3_veo_desc')}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-accent-pink/50 transition-colors">
                  <h4 className="text-white font-bold mb-2">Kling</h4>
                  <p className="text-sm">{t('help.step3_kling_desc')}</p>
                </div>
              </div>
              <p className="mt-4">
                {t('help.step3_outro')}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-6">{t('help.ready')}</p>
          <a 
            href="https://kie.ai?ref=5a872d0ae7dd674867d4b3975d4a7204" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block px-12 py-4 rounded-full bg-white text-black font-black uppercase tracking-widest hover:scale-105 transition-transform"
          >
            {t('help.start_btn')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Help;
