import React from 'react';
import { useLanguage } from '../LanguageContext';
import { useSection } from '../ContentContext';

interface FooterProps {
  onNavigate: (view: 'home' | 'about' | 'help' | 'price' | 'store' | 'custom') => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const showAbout = useSection('about');
  const showHelp = useSection('help');

  return (
    <footer className="relative bg-black/40 backdrop-blur-xl border-t border-white/5 pt-20 pb-10 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent-purple/10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent-cyan/10 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <button onClick={() => onNavigate('home')} className="group flex items-center gap-3 focus:outline-none">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent-purple to-accent-cyan rounded-xl blur opacity-40 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-tr from-accent-purple to-accent-cyan flex items-center justify-center text-white font-black text-lg rotate-6 group-hover:rotate-0 transition-transform duration-300 shadow-2xl">
                  SS
                </div>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-2xl font-black tracking-tighter leading-none">Sinemagic</span>
                <span className="text-sm font-medium gradient-text tracking-widest uppercase">Studio</span>
              </div>
            </button>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              {t('footer.desc')}
            </p>
            <div className="flex gap-4">
               {/* Social Icons */}
               <a href="https://t.me/Sinemagic" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#229ED9] hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-8.609 3.33c-2.068.8-4.133 1.598-5.724 2.21a405.15 405.15 0 0 1-2.849 1.09c-.42.147-.99.332-1.473.901-.728.968.193 1.798.919 2.286 1.61.516 3.275 1.009 4.654 1.472.509 1.793.997 3.592 1.48 5.388.16.36.506.494.864.498l-.002.018s.281 .028.555-.038a2.1 2.1 0 0 0 .933-.517c.345-.324 1.28-1.244 1.811-1.764l3.999 2.952.032.018s.442.311 1.09.355c.324.022.75-.04 1.116-.308.37-.27.613-.702.728-1.196.342-1.492 2.61-12.285 2.997-14.072l-.01.042c.27-1.006.17-1.928-.455-2.381a2.06 2.06 0 0 0-1.022-.215z"/></svg>
               </a>
               <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#ff0050] hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
               </a>
               <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#E1306C] hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
               </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Product</h3>
            <ul className="space-y-4">
              <li>
                <button onClick={() => onNavigate('home')} className="text-gray-400 hover:text-accent-cyan transition-colors text-sm font-medium flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {t('header.home')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('price')} className="text-gray-400 hover:text-accent-cyan transition-colors text-sm font-medium flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {t('header.price')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('store')} className="text-gray-400 hover:text-accent-cyan transition-colors text-sm font-medium flex items-center gap-2 group">
                   <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity"></span>
                   {t('header.store')}
                </button>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Company</h3>
            <ul className="space-y-4">
              {showAbout && (
                <li>
                  <button onClick={() => onNavigate('about')} className="text-gray-400 hover:text-accent-purple transition-colors text-sm font-medium flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-purple opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {t('footer.about')}
                  </button>
                </li>
              )}
              {showHelp && (
                <li>
                  <button onClick={() => onNavigate('help')} className="text-gray-400 hover:text-accent-purple transition-colors text-sm font-medium flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-purple opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {t('footer.help')}
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Legal</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('footer.privacy')}</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('footer.terms')}</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs font-medium tracking-wide">
            {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-6">
             <span className="text-gray-700 text-xs">Sinemagic Studio v2.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
