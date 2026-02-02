
import React from 'react';

const BentoGrid: React.FC = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter">Технологии <span className="gradient-text italic">будущего</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-auto md:auto-rows-[240px]">
          {/* Big Card 1 */}
          <div className="md:col-span-3 lg:col-span-8 row-span-2 group relative overflow-hidden rounded-[2.5rem] glass border-white/5 p-10 flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:opacity-40 transition-opacity">
              <i data-lucide="cpu" className="w-32 h-32 text-accent-cyan"></i>
            </div>

            <div className="relative z-10 flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-accent-purple to-accent-cyan flex items-center justify-center text-white font-black text-3xl rotate-12 group-hover:rotate-0 transition-transform shadow-[0_0_30px_rgba(168,85,247,0.5)]">SS</div>
                <span className="text-4xl font-black tracking-tighter text-white">Sinemagic <span className="gradient-text italic pr-2">Studio</span></span>
             </div>

            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-4">Ультра-быстрый рендеринг</h3>
              <p className="text-gray-400 max-w-md text-lg leading-relaxed">Наши сервера на базе H100 обрабатывают видео в 10 раз быстрее конкурентов. Ваше видео готово, пока вы пьете кофе.</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>

          {/* Small Card 1 */}
          <div className="md:col-span-3 lg:col-span-4 group relative overflow-hidden rounded-[2.5rem] glass border-white/5 p-8 hover:border-accent-purple/30 transition-all">
            <div className="w-10 h-10 rounded-lg bg-accent-purple/10 flex items-center justify-center mb-4">
              <i data-lucide="shield-check" className="w-5 h-5 text-accent-purple"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">Безопасность</h3>
            <p className="text-gray-500 text-sm">Ваши промпты и данные защищены сквозным шифрованием.</p>
          </div>

          {/* Small Card 2 */}
          <div className="md:col-span-3 lg:col-span-4 group relative overflow-hidden rounded-[2.5rem] glass border-white/5 p-8 hover:border-accent-pink/30 transition-all">
            <div className="w-10 h-10 rounded-lg bg-accent-pink/10 flex items-center justify-center mb-4">
              <i data-lucide="globe" className="w-5 h-5 text-accent-pink"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">Мультиязычность</h3>
            <p className="text-gray-500 text-sm">Поддержка более 50 языков для озвучки и липсинга.</p>
          </div>

          {/* Big Card 2 (Bottom) */}
          <div className="md:col-span-6 lg:col-span-12 group relative overflow-hidden rounded-[2.5rem] glass border-white/5 p-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <h3 className="text-3xl font-black mb-4">Интеграция с <span className="text-accent-cyan">TikTok API</span></h3>
              <p className="text-gray-400 text-lg leading-relaxed">Публикуйте свои шедевры напрямую в социальные сети в один клик. Система автоматически подберет трендовые хештеги.</p>
            </div>
            <div className="w-full md:w-1/3 aspect-video rounded-3xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
               <i data-lucide="share-2" className="w-16 h-16 text-white/20"></i>
            </div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent-cyan/10 blur-[100px] rounded-full group-hover:bg-accent-cyan/20 transition-colors"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
