
import React from 'react';

const TIPS = [
  "Делай короткие видео 6–9 секунд для удержания",
  "Добавляй яркий текстовый хук в первые 2 секунды",
  "Используй только трендовые звуки из библиотеки",
  "Выкладывай минимум 1 ролик каждый день",
  "Тестируй разные AI-голоса для разной аудитории"
];

const Tips: React.FC = () => {
  return (
    // Fixed: replaced 'class' with 'className'
    <section id="tips" className="py-24 bg-gradient-to-b from-background to-[#0f0f1a]">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black mb-12 text-center">Стратегия <span className="gradient-text">роста</span></h2>
          
          <div className="space-y-4">
            {TIPS.map((tip, i) => (
              <div 
                key={i} 
                className="group flex items-center gap-6 p-6 rounded-2xl glass border-white/5 hover:border-accent-pink/40 hover:translate-x-3 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-accent-pink/10 border border-accent-pink/30 flex items-center justify-center text-accent-pink font-bold flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg md:text-xl font-medium text-gray-200 group-hover:text-white transition-colors">{tip}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-20 text-center">
            <h3 className="text-4xl md:text-6xl font-black mb-10">Готов покорить ленту?</h3>
            <a 
              href="https://kie.ai?ref=5a872d0ae7dd674867d4b3975d4a7204" 
              className="inline-block px-12 py-6 bg-white text-black rounded-full font-black text-xl hover:bg-accent-cyan hover:text-white transition-all shadow-2xl hover:shadow-accent-cyan/20"
              target="_blank"
              rel="noopener"
            >
              Создать видео сейчас
            </a>
            <p className="mt-6 text-gray-500 font-medium">Регистрация через Google за 10 секунд</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tips;
