
import React from 'react';

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Алексей Волков',
    role: 'Трэвел-блогер (120k+)',
    quote: 'Благодаря TikTok AI мой блог вырос с нуля до 100к подписчиков всего за месяц. Контент теперь создается буквально сам, а качество Kling просто поражает.',
    avatar: 'https://i.pravatar.cc/150?u=alexey'
  },
  {
    name: 'Марина Соколова',
    role: 'Digital Маркетолог',
    quote: 'Лучший инструмент для быстрого тестирования креативов. Мы экономим тысячи долларов на съемках и продакшене, получая при этом виральные охваты.',
    avatar: 'https://i.pravatar.cc/150?u=marina'
  },
  {
    name: 'Дмитрий Резнов',
    role: 'Основатель агентства',
    quote: 'Нейросети — это будущее контент-мейкинга. Липсинг работает идеально, теперь мы озвучиваем ролики для западного рынка за копейки.',
    avatar: 'https://i.pravatar.cc/150?u=dmitry'
  },
  {
    name: 'Елена Кравц',
    role: 'Контент-стратег',
    quote: 'Интерфейс настолько прост, что я собрала свой первый ролик за 5 минут. Поразительно, как далеко шагнули технологии генерации видео.',
    avatar: 'https://i.pravatar.cc/150?u=elena'
  }
];

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 bg-[#08080c] relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-accent-purple/10 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-pink/5 blur-[120px] rounded-full"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            Что говорят наши <span className="gradient-text">пользователи</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам креаторов, которые уже изменили свой подход к созданию контента.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div 
              key={i} 
              className="group p-8 rounded-[2rem] glass border-white/5 hover:border-accent-purple/30 transition-all duration-500 flex flex-col justify-between transform hover:-translate-y-1"
            >
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-accent-cyan" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed mb-8 italic">
                  "{t.quote}"
                </p>
              </div>
              
              <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                <img 
                  src={t.avatar} 
                  alt={t.name} 
                  className="w-12 h-12 rounded-full border-2 border-accent-purple/20 object-cover"
                />
                <div>
                  <h4 className="font-bold text-white group-hover:text-accent-purple transition-colors">{t.name}</h4>
                  <p className="text-xs text-gray-500 font-medium">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
