
import React from 'react';

const STEPS = [
  { n: '1', text: 'Быстрая регистрация', desc: 'Занимает меньше минуты через Google.' },
  { n: '2', text: 'Загрузка контента', desc: 'Вставь текст или загрузи картинку для основы.' },
  { n: '3', text: 'Выбор модели', desc: 'Kling, Veo 3 или Hailuo для лучшего результата.' },
  { n: '4', text: 'Готовый шедевр', desc: 'Скачай видео и заливай в соцсети.' },
];

const HowTo: React.FC = () => {
  return (
    // Fixed: replaced 'class' with 'className'
    <section id="howto" className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-purple/10 blur-[120px] rounded-full -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-pink/10 blur-[120px] rounded-full -z-10"></div>

        <h2 className="text-3xl md:text-5xl font-black text-center mb-20">Как это работает</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, i) => (
            <div key={i} className="relative p-10 rounded-[2.5rem] bg-card/50 border border-white/5 group hover:border-white/20 transition-all duration-500">
              <div className="absolute -top-6 -left-2 text-[8rem] font-black text-white/5 select-none pointer-events-none group-hover:text-accent-purple/10 transition-colors">
                {step.n}
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-2xl font-bold mb-6 shadow-xl shadow-accent-purple/20">
                {step.n}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.text}</h3>
              <p className="text-gray-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-20 p-8 rounded-3xl glass border-accent-purple/20 max-w-3xl mx-auto text-center">
           <p className="text-lg text-gray-300 italic">"Раньше для такого контента нужен был продакшн за $10,000. Теперь достаточно воображения и пары кликов."</p>
        </div>
      </div>
    </section>
  );
};

export default HowTo;
