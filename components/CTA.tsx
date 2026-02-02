
import React from 'react';

const CTA: React.FC = () => {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Central Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-purple/10 blur-[120px] rounded-full"></div>
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white">
          Начни делать AI-видео прямо сейчас
        </h2>
        <p className="text-gray-400 text-lg md:text-xl mb-12 font-medium">
          Регистрация занимает меньше минуты.
        </p>
        
        <div className="flex justify-center">
          <a 
            href="https://kie.ai?ref=5a872d0ae7dd674867d4b3975d4a7204"
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#a855f7] to-[#ec4899] rounded-2xl font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(168,85,247,0.3)] hover:shadow-[0_0_60px_rgba(168,85,247,0.5)]"
          >
            <span>Перейти к генерации видео</span>
            <i data-lucide="arrow-right" className="w-5 h-5 group-hover:translate-x-1 transition-transform"></i>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTA;
