
import React from 'react';

const FEATURE_LIST = [
  { icon: 'video', title: 'Генерация из текста', desc: 'Просто опиши сцену словами' },
  { icon: 'image', title: 'Оживление фото', desc: 'Преврати статичное фото в видео' },
  { icon: 'mic', title: 'AI-озвучка', desc: 'Сотни реалистичных голосов' },
  { icon: 'smile', title: 'Анимация губ', desc: 'Идеальный липсинг под любой звук' },
  { icon: 'camera', title: 'Фото-реализм', desc: 'Генерация лиц и пейзажей' },
  { icon: 'maximize', title: 'Улучшение качества', desc: 'Upscale до 4K разрешения' },
  { icon: 'smartphone', title: 'TikTok форматы', desc: 'Сразу в 9:16 с нужным битрейтом' },
  { icon: 'pen-tool', title: 'Авто-сценарии', desc: 'Идеи для видео от нейросети' },
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-[#08080c] relative">
      <div className="container mx-auto px-6">
        <div className="mb-20 text-center">
          <div className="inline-block px-3 py-1 mb-4 rounded-full border border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500">
            Возможности
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">Безграничный <span className="gradient-text">функционал</span></h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURE_LIST.map((feature, i) => (
            <div 
              key={i} 
              className="group p-10 rounded-[2.5rem] glass border-white/5 hover:border-accent-purple/30 hover:bg-accent-purple/5 transition-all duration-500 flex flex-col items-start text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-accent-purple/20 transition-all duration-500 shadow-xl">
                <i data-lucide={feature.icon} className="w-7 h-7 text-accent-purple"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
