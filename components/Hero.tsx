
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { useSection } from '../ContentContext';

const HERO_VIDEOS = [
  "https://www.tiktok.com/player/v1/7583185534604840204?autoplay=1&muted=1&loop=1",
  "/videos/2.mp4",
  "/videos/3.mp4",
  "/videos/4.mp4",
  "/videos/5.mp4",
  "/videos/6.mp4"
];

const Hero: React.FC = () => {
  const { t } = useLanguage();
  const showMarquee = useSection('hero_marquee');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const marqueeText = t('hero.marquee_text') || "Kling AI, Google Veo, Runway Gen-3, Luma Dream, Hailuo, Sora";
  const logos = marqueeText.split(',').map(s => s.trim()).filter(Boolean);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % HERO_VIDEOS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;
    setIsGenerating(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsGenerating(false);
          setProgress(0);
          setCurrentIdx((currentIdx + 1) % HERO_VIDEOS.length);
        }, 500);
      }
    }, 50);
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Video Slider */}
      <div className="absolute inset-0 z-0">
        {HERO_VIDEOS.map((src, idx) => {
          const isTikTok = src.includes('tiktok.com');
          const commonClasses = `absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out filter brightness-[0.35] saturate-[1.2] ${idx === currentIdx ? 'opacity-100' : 'opacity-0'}`;
          
          const isNearby = Math.abs(currentIdx - idx) <= 1 || (currentIdx === 0 && idx === HERO_VIDEOS.length - 1) || (currentIdx === HERO_VIDEOS.length - 1 && idx === 0);

          if (!isNearby) return null;

          if (isTikTok) {
            return (
              <iframe
                key={src}
                src={src}
                className={`${commonClasses} pointer-events-none border-none`}
                allow="autoplay; encrypted-media"
                tabIndex={-1}
              />
            );
          }

          return (
            <video
              key={src}
              autoPlay
              muted
              loop
              playsInline
              className={commonClasses}
            >
              <source src={src} type="video/mp4" />
            </video>
          );
        })}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background z-[1]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(168,85,247,0.1)_0%,transparent_50%)]"></div>
      </div>

      <div className="container relative z-10 px-6 pt-32 pb-20 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] text-accent-cyan">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan"></span>
          </span>
          {t('hero.tag')}
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[0.95] tracking-tighter text-white">
          {t('hero.title_start')} <span className="gradient-text italic pr-4">{t('hero.title_end')}</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          {t('hero.subtitle')}
        </p>

        {/* AI Prompt Simulator */}
        <div className="relative max-w-2xl mx-auto mb-16 group">
          <form onSubmit={handleSimulate} className="relative z-10 flex flex-col md:flex-row gap-3 p-2 rounded-[2rem] glass border-white/10 focus-within:border-accent-purple/50 transition-all shadow-2xl">
            <input 
              type="text" 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t('hero.placeholder')}
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-gray-600 px-6 py-4 text-sm font-medium"
              disabled={isGenerating}
            />
            <button 
              type="submit"
              disabled={isGenerating}
              className={`px-8 py-4 bg-white text-black rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 ${isGenerating ? 'opacity-50' : 'hover:bg-accent-cyan hover:text-white active:scale-95'}`}
            >
              {isGenerating ? t('hero.generating') : t('hero.generate')}
              {!isGenerating && <i data-lucide="sparkles" className="w-4 h-4"></i>}
            </button>
          </form>

          {/* Progress Bar for simulation */}
          {isGenerating && (
            <div className="absolute -bottom-6 left-6 right-6 h-1.5 bg-white/5 rounded-full overflow-hidden backdrop-blur-md border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-accent-purple via-accent-pink to-accent-cyan transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
          
          <div className="absolute -inset-4 bg-accent-purple/20 blur-[60px] rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        
        {/* Trusted By / Technologies Marquee */}
        {showMarquee && (
        <div className="relative py-8 overflow-hidden w-full">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {/* First Set */}
            <div className="flex items-center gap-12 px-6">
              {logos.map((logo, i) => (
                <span key={`a-${i}`} className="text-sm font-black uppercase tracking-[0.3em] opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">{logo}</span>
              ))}
              {logos.map((logo, i) => (
                <span key={`b-${i}`} className="text-sm font-black uppercase tracking-[0.3em] opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">{logo}</span>
              ))}
              {logos.map((logo, i) => (
                <span key={`e-${i}`} className="text-sm font-black uppercase tracking-[0.3em] opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">{logo}</span>
              ))}
            </div>
            {/* Second Set (Duplicate for seamless loop) */}
            <div className="flex items-center gap-12 px-6">
              {logos.map((logo, i) => (
                <span key={`c-${i}`} className="text-sm font-black uppercase tracking-[0.3em] opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">{logo}</span>
              ))}
              {logos.map((logo, i) => (
                <span key={`d-${i}`} className="text-sm font-black uppercase tracking-[0.3em] opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">{logo}</span>
              ))}
              {logos.map((logo, i) => (
                <span key={`f-${i}`} className="text-sm font-black uppercase tracking-[0.3em] opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">{logo}</span>
              ))}
            </div>
          </div>
        </div>
        )}
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 animate-float opacity-30">
        <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent"></div>
      </div>
    </section>
  );
};

export default Hero;
