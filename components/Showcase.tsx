
import React, { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { useContent } from '../ContentContext';

interface VideoItem {
  id: string;
  label: string;
  video: string;
  gradient: string;
}

const VideoCard: React.FC<{ item: VideoItem }> = ({ item }) => {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Sync Lucide icons whenever state changes
  // REMOVED: Expensive DOM scan causing lag
  // useEffect(() => {
  //   if ((window as any).lucide) {
  //     (window as any).lucide.createIcons();
  //   }
  // }, [isPlaying, isMuted, isHovered]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickedProgress = x / rect.width;
    videoRef.current.currentTime = clickedProgress * videoRef.current.duration;
    setProgress(clickedProgress * 100);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!isPlaying) {
      videoRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Optional: pause on leave, or keep playing. For TikTok feel, pausing is common.
    videoRef.current?.pause();
    setIsPlaying(false);
  };

  return (
    <div 
      className="group relative rounded-2xl md:rounded-3xl overflow-hidden bg-card border-2 md:border-4 border-white/10 hover:border-accent-purple/50 transition-all duration-500 cursor-pointer shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 max-w-[280px] mx-auto"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="aspect-[9/16] relative bg-black overflow-hidden">
        <video
          ref={videoRef}
          key={item.video} // Force re-render on video change
          muted={isMuted}
          loop
          playsInline
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-100' : 'scale-105'}`}
        >
          <source src={item.video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Overlay Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-t ${item.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>
        
        {/* Play Center Indicator (Only visible when not playing or briefly on hover) */}
        {!isPlaying && !isHovered && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full glass flex items-center justify-center border border-white/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white translate-x-0.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </div>
          </div>
        )}

        {/* Custom Controls Bar */}
        <div className={`absolute bottom-0 left-0 w-full p-2 md:p-4 z-30 transition-all duration-300 transform ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="glass rounded-2xl p-3 border border-white/10 flex flex-col gap-3">
            
            {/* Progress Bar Container */}
            <div 
              className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer relative overflow-hidden group/progress"
              onClick={handleSeek}
            >
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent-purple to-accent-pink transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              ></div>
              {/* Knob indicator */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity"
                style={{ left: `calc(${progress}% - 6px)` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={togglePlay}
                  className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors text-white"
                >
                  {isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  )}
                </button>
                
                <button 
                  onClick={toggleMute}
                  className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors text-white"
                >
                  {isMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                  )}
                </button>
              </div>

              <div className="px-3 py-1 rounded-lg bg-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-white/5">
                {t('showcase.preview')}
              </div>
            </div>
          </div>
        </div>

        {/* Static Title Label (Hidden when controls are up to reduce clutter) */}
        <div className={`absolute top-4 left-4 z-20 transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
           <div className="glass px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter border-white/10">
             {item.label}
           </div>
        </div>
      </div>
    </div>
  );
};

const Showcase: React.FC = () => {
  const { t } = useLanguage();
  const { sections } = useContent();

  const videoItems = [1, 2, 3, 4, 5, 6].map(id => {
    const gradientMap = [
      'from-blue-600/20',
      'from-pink-600/20',
      'from-purple-600/20',
      'from-cyan-600/20',
      'from-orange-600/20',
      'from-indigo-600/20'
    ];
    return {
      id: String(id),
      label: t(`showcase.video_${id}_label` as any),
      video: t(`showcase.video_${id}_url` as any),
      gradient: gradientMap[id - 1],
      isVisible: sections[`showcase_video_${id}`] !== false
    };
  }).filter(item => item.isVisible);

  return (
    <section id="showcase" className="py-24 bg-background relative">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-accent-purple/20 to-transparent"></div>
      
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <div className="inline-block px-3 py-1 mb-4 rounded-full border border-accent-purple/20 bg-accent-purple/5 text-[10px] font-black uppercase tracking-widest text-accent-purple">
            {t('showcase.tag')}
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">{t('showcase.title_start')} <span className="gradient-text italic">{t('showcase.title_end')}</span></h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            {t('showcase.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 max-w-5xl mx-auto">
          {videoItems.map(item => (
            <VideoCard key={item.id} item={item} />
          ))}
        </div>
        
        <div className="mt-16 flex justify-center">
           <a 
            href="https://kie.ai?ref=5a872d0ae7dd674867d4b3975d4a7204"
            className="group px-8 py-4 glass rounded-2xl border-white/10 hover:border-accent-cyan/50 transition-all flex items-center gap-3 text-sm font-bold"
           >
             {t('showcase.view_all')}
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
           </a>
        </div>
      </div>
    </section>
  );
};

export default Showcase;
