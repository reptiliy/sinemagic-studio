import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { useSection } from '../ContentContext';
import { useAuth } from '../AuthContext';
import { Language } from '../translations';
import { Menu, X, User, LogOut, Settings, Shield } from 'lucide-react';

interface HeaderProps {
  onNavigate: (view: 'home' | 'about' | 'help' | 'price' | 'store' | 'custom') => void;
  currentView: 'home' | 'about' | 'help' | 'price' | 'store' | 'custom';
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const showAbout = useSection('about');
  const showHelp = useSection('help');
  const showHeader = useSection('header');
  const showPrice = useSection('price');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const handleNavigate = (view: 'home' | 'about' | 'help' | 'price' | 'store' | 'custom') => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    setUserMenuOpen(false);
  };

  const languages: { code: Language; label: string }[] = [
    { code: 'ru', label: 'RU' },
    { code: 'en', label: 'EN' },
    { code: 'de', label: 'DE' },
    { code: 'uk', label: 'UK' },
  ];

  const userAvatar = profile?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const userName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  if (!showHeader) return null;

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'py-4 glass border-b border-white/5' : 'py-8 bg-transparent'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center relative">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button - Left before logo */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-white bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors relative z-10"
            >
              <Menu className="w-6 h-6" />
            </button>

            <button 
              onClick={() => onNavigate('home')} 
              className="group flex items-center gap-2 text-2xl font-black tracking-tighter focus:outline-none z-50 md:relative absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:left-auto md:top-auto md:translate-x-0 md:translate-y-0"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-accent-purple to-accent-cyan flex items-center justify-center text-white font-black text-xs md:text-sm rotate-12 group-hover:rotate-0 transition-transform shadow-[0_0_20px_rgba(168,85,247,0.4)]">SS</div>
              <span className="text-lg md:text-2xl whitespace-nowrap">Sinemagic <span className="hidden sm:inline-block inline-block pr-1 gradient-text italic">Studio</span></span>
            </button>
          </div>
          
          {currentView !== 'custom' && (
            <nav className="hidden md:flex items-center bg-white/5 backdrop-blur-md rounded-full px-2 py-1 border border-white/5">
              <button 
                onClick={() => onNavigate('home')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${currentView === 'home' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                {t('header.home')}
              </button>
              {showAbout && (
                <button 
                  onClick={() => onNavigate('about')}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${currentView === 'about' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  {t('header.about')}
                </button>
              )}
              {showPrice && (
                <button 
                  onClick={() => onNavigate('price')}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${currentView === 'price' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  {t('header.price')}
                </button>
              )}
              <button 
                onClick={() => onNavigate('store')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${currentView === 'store' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                {t('header.store')}
              </button>
              {showHelp && (
                <button 
                  onClick={() => onNavigate('help')}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${currentView === 'help' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  {t('header.help')}
                </button>
              )}
            </nav>
          )}

          <div className="flex items-center gap-4">
             {/* Language Selector Dropdown */}
             <div className="relative group hidden md:block">
               <button className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white/5 border border-white/5 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all min-w-[80px] justify-between">
                 {language}
                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:rotate-180 text-gray-400">
                   <path d="m6 9 6 6 6-6"/>
                 </svg>
               </button>
               
               <div className="absolute top-full left-0 pt-2 w-full hidden group-hover:block z-50">
                 <div className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
                   <div className="flex flex-col p-1 gap-1">
                     {languages.map((lang) => (
                       <button
                         key={lang.code}
                         onClick={() => setLanguage(lang.code)}
                         className={`w-full text-center px-2 py-2 rounded-xl text-xs font-bold transition-all ${
                           language === lang.code 
                             ? 'bg-white text-black shadow-lg' 
                             : 'text-gray-400 hover:text-white hover:bg-white/10'
                         }`}
                       >
                         {lang.label}
                       </button>
                     ))}
                   </div>
                 </div>
               </div>
             </div>

            {user ? (
              <div className="relative hidden md:block">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-purple to-accent-cyan p-[1px] overflow-hidden">
                    {userAvatar ? (
                      <img src={userAvatar} alt={userName} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <div className="w-full h-full bg-[#1a1a2e] flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-bold max-w-[100px] truncate">{userName}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute top-full right-0 pt-2 w-48 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 p-1">
                      {isAdmin && (
                        <button
                          onClick={() => {
                            navigate('/admin/dashboard');
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all mb-1"
                        >
                          <Shield className="w-4 h-4" />
                          Админ-панель
                        </button>
                      )}
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                      >
                        <Settings className="w-4 h-4" />
                        Личный кабинет
                      </button>
                      <div className="h-px bg-white/10 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Выйти
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Overlay to close menu when clicking outside */}
                {userMenuOpen && (
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="hidden md:flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all shadow-lg active:scale-95"
              >
                <User className="w-4 h-4" />
                Войти
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl transition-all duration-500 md:hidden overflow-y-auto ${mobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full pointer-events-none'}`}>
        <div className="flex flex-col min-h-full p-6">
          <div className="flex justify-center items-center mb-12 relative shrink-0">
            <button 
              onClick={() => handleNavigate('home')} 
              className="flex items-center gap-2 text-xl font-black tracking-tighter focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-purple to-accent-cyan flex items-center justify-center text-white font-black text-sm rotate-12">SS</div>
              <span className="text-base sm:text-lg whitespace-nowrap">Sinemagic <span className="inline-block pr-1 gradient-text italic">Studio</span></span>
            </button>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="absolute right-0 p-2 text-white bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-4 mb-8">
            <button 
              onClick={() => handleNavigate('home')}
              className={`p-4 rounded-2xl text-lg font-bold text-left transition-all ${currentView === 'home' ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              {t('header.home')}
            </button>
            {showAbout && (
              <button 
                onClick={() => handleNavigate('about')}
                className={`p-4 rounded-2xl text-lg font-bold text-left transition-all ${currentView === 'about' ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                {t('header.about')}
              </button>
            )}
            {showPrice && (
              <button 
                onClick={() => handleNavigate('price')}
                className={`p-4 rounded-2xl text-lg font-bold text-left transition-all ${currentView === 'price' ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                {t('header.price')}
              </button>
            )}
            <button 
              onClick={() => handleNavigate('store')}
              className={`p-4 rounded-2xl text-lg font-bold text-left transition-all ${currentView === 'store' ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              {t('header.store')}
            </button>
            {showHelp && (
              <button 
                onClick={() => handleNavigate('help')}
                className={`p-4 rounded-2xl text-lg font-bold text-left transition-all ${currentView === 'help' ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                {t('header.help')}
              </button>
            )}
          </nav>

          <div className="mt-auto flex flex-col gap-6 pb-6 shrink-0">
            <div className="bg-white/5 p-1.5 rounded-2xl border border-white/10 flex">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    language === lang.code 
                      ? 'bg-white text-black shadow-lg' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            
            <a 
              href="https://kie.ai?ref=5a872d0ae7dd674867d4b3975d4a7204" 
              className="w-full text-center px-6 py-4 rounded-2xl bg-gradient-to-r from-accent-purple to-accent-pink text-white font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-accent-purple/20 active:scale-95"
              target="_blank"
              rel="noopener"
            >
              {t('header.try')}
            </a>

            {/* Mobile Auth Button */}
            {user ? (
              <a 
                href="/profile"
                className="w-full text-center px-6 py-4 rounded-2xl bg-white/10 border border-white/10 text-white font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                <User className="w-5 h-5" />
                Мой Профиль
              </a>
            ) : (
              <a 
                href="/login"
                className="w-full text-center px-6 py-4 rounded-2xl bg-white/10 border border-white/10 text-white font-black uppercase tracking-widest hover:bg-white/20 transition-all"
              >
                Войти
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
