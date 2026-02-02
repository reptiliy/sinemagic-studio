
import React from 'react';
import { useLanguage } from '../LanguageContext';
import { useSection } from '../ContentContext';
import { Facebook, Instagram } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'home' | 'about' | 'help' | 'price' | 'store' | 'custom') => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const showAbout = useSection('about');
  const showHelp = useSection('help');

  return (
    <footer className="bg-background pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-12">
          <div>
            <button onClick={() => onNavigate('home')} className="group flex items-center gap-2 text-2xl font-black tracking-tighter mb-4 focus:outline-none">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-purple to-accent-cyan flex items-center justify-center text-white font-black text-sm rotate-12 group-hover:rotate-0 transition-transform shadow-[0_0_20px_rgba(168,85,247,0.4)]">SS</div>
              <span className="text-lg md:text-2xl">Sinemagic <span className="gradient-text italic">Studio</span></span>
            </button>
            <p className="text-gray-500 max-w-sm text-sm">
              {t('footer.desc')}
            </p>
          </div>
          
          <nav className="flex flex-wrap gap-10">
            <button onClick={() => onNavigate('home')} className="text-sm font-bold text-gray-400 hover:text-white transition-colors">{t('footer.home')}</button>
            {showAbout && (
              <button onClick={() => onNavigate('about')} className="text-sm font-bold text-gray-400 hover:text-white transition-colors">{t('footer.about')}</button>
            )}
            {showHelp && (
              <button onClick={() => onNavigate('help')} className="text-sm font-bold text-gray-400 hover:text-white transition-colors">{t('footer.help')}</button>
            )}
            {/* Telegram link in nav removed as requested by context (icons focus), or kept? 
                User asked for icons. I'll keep the text link if it was there, but maybe redundant. 
                I'll leave it as it was in the code, just fixed translation.
            */}
            <a href="https://t.me/Sinemagic" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">{t('footer.telegram')}</a>
          </nav>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-white/5">
          <p className="text-xs text-gray-600 font-medium tracking-widest uppercase">
            {t('footer.copyright')}
          </p>
          <div className="flex gap-4">
            {/* Telegram */}
            <a href="https://t.me/Sinemagic" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#229ED9]/20 hover:text-[#229ED9] transition-all cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-8.609 3.33c-2.068.8-4.133 1.598-5.724 2.21a405.15 405.15 0 0 1-2.849 1.09c-.42.147-.99.332-1.473.901-.728.968.193 1.798.919 2.286 1.61.516 3.275 1.009 4.654 1.472.509 1.793.997 3.592 1.48 5.388.16.36.506.494.864.498l-.002.018s.281 .028.555-.038a2.1 2.1 0 0 0 .933-.517c.345-.324 1.28-1.244 1.811-1.764l3.999 2.952.032.018s.442.311 1.09.355c.324.022.75-.04 1.116-.308.37-.27.613-.702.728-1.196.342-1.492 2.61-12.285 2.997-14.072l-.01.042c.27-1.006.17-1.928-.455-2.381a2.06 2.06 0 0 0-1.022-.215z"/>
              </svg>
            </a>

            {/* TikTok */}
            <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#ff0050]/20 hover:text-[#ff0050] transition-all cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </svg>
            </a>

            {/* Instagram */}
            <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#E1306C]/20 hover:text-[#E1306C] transition-all cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>

            {/* Facebook */}
            <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#1877F2]/20 hover:text-[#1877F2] transition-all cursor-pointer">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
