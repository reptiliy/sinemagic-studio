
import React from 'react';

const BENEFITS = [
  { icon: 'credit-card', title: 'Экономия', text: 'Одно видео стоит меньше доллара. Это в 100 раз выгоднее съемок.' },
  { icon: 'zap', title: 'Скорость', text: 'Генерация занимает 2-5 минут. Делай пачку контента за час.' },
  { icon: 'layout', title: 'Простота', text: 'Никакого After Effects. Интуитивно понятный интерфейс для каждого.' },
  { icon: 'ghost', title: 'Анонимность', text: 'Создавай популярные каналы, не показывая себя в кадре.' },
];

const Benefits: React.FC = () => {
  return (
    <section className="py-24 bg-background border-y border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {BENEFITS.map((b, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-accent-cyan/5 border border-accent-cyan/10 flex items-center justify-center mb-6 group-hover:bg-accent-cyan/20 group-hover:scale-110 transition-all duration-500">
                <i data-lucide={b.icon} className="w-7 h-7 text-accent-cyan"></i>
              </div>
              <h3 className="text-xl font-black mb-4 tracking-tight uppercase">
                {b.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[250px]">{b.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
