import React from 'react';
import { useLanguage } from '../LanguageContext';
import { useText } from '../ContentContext';
import { Play } from 'lucide-react';

const VideoSection: React.FC = () => {
  const { t } = useLanguage();
  const videoUrl = useText('video.url', 'https://www.youtube.com/embed/dQw4w9WgXcQ');
  
  return (
    <section id="video" className="py-24 bg-[#050508] relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-background/90 z-10 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-purple/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-6">
            {t('video.title')}
          </h2>
          <p className="text-xl text-gray-400">
            {t('video.subtitle')}
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-500/20 group">
          <div className="absolute inset-0 bg-black/50 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
          
          {videoUrl.startsWith('/') || videoUrl.endsWith('.mp4') ? (
            <video 
              src={videoUrl}
              className="w-full h-full object-cover"
              controls
              playsInline
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <iframe 
              src={videoUrl} 
              title="Video Player"
              className="w-full h-full object-cover"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
