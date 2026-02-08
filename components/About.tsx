
import React, { useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

const About: React.FC = () => {
  const { t } = useLanguage();

const SKILLS = [
  { name: 'AI Video Synthesis', level: '98%', icon: 'video', desc: 'Kling, Veo, Luma' },
  { name: 'Neural Architectures', level: '92%', icon: 'cpu', desc: 'LLM & Custom Models' },
  { name: 'Viral Automation', level: '95%', icon: 'zap', desc: 'Content Multiplier' },
  { name: 'Bot Development', level: '99%', icon: 'bot', desc: 'Telegram & Web SDK' }
];

  const STATS = [
    { label: t('about.years'), value: '20+' },
    { label: t('about.projects'), value: '150+' },
    { label: t('about.reach'), value: '500M+' },
    { label: t('about.models'), value: '12' }
  ];

const About: React.FC = () => {
  useEffect(() => {
    if ((window as any).lucide) {
      (window as any).lucide.createIcons();
    }
  }, []);

  return (
    <section id="about" className="min-h-screen py-24 bg-background relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[10%] -right-20 w-[600px] h-[600px] bg-accent-purple/5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[10%] -left-20 w-[500px] h-[500px] bg-accent-cyan/5 blur-[120px] rounded-full"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            
            {/* Image Column */}
            <div className="lg:col-span-6">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-accent-purple via-transparent to-accent-cyan rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
                <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden border border-white/10 bg-card">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg" 
                    alt="Donald Trump" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
                  <div className="absolute bottom-10 left-10 right-10">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="h-px w-8 bg-accent-purple"></span>
                      <span className="text-accent-purple font-black uppercase tracking-[0.3em] text-[10px]">{t('about.role')}</span>
                    </div>
                    <h3 className="text-4xl font-black tracking-tight text-white">{t('about.name')}</h3>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {STATS.map((stat, i) => (
                  <div key={i} className="glass p-6 rounded-3xl border-white/5 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black gradient-text mb-1">{stat.value}</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-6 space-y-12">
              <div>
                 <h1 className="text-4xl md:text-7xl font-black mb-6 leading-[0.9] tracking-tighter">
                   {t('about.h1_1')} <br />
                   <span className="text-gray-500">{t('about.h1_2')}</span> <br />
                   <span className="gradient-text">{t('about.h1_3')}</span>
                 </h1>
                 
                 <div className="prose prose-invert max-w-none text-lg text-gray-400 space-y-4 leading-relaxed">
                   <p>{t('about.p1')}</p>
                   <p>{t('about.p2')}</p>
                   <p>{t('about.p3')}</p>
                   <p>{t('about.p4')}</p>
                   <p>{t('about.p5')}</p>
                 </div>
              </div>
            </div>

          </div>

          {/* Full Width Stack & Quote Section */}
          <div className="mt-24 space-y-12">
              <div className="space-y-6">
                <h4 className="text-sm font-black uppercase tracking-[0.3em] text-white flex items-center gap-4">
                  {t('about.stack')}
                  <span className="h-px flex-grow bg-white/5"></span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {SKILLS.map((skill, i) => (
                    <div key={i} className="group p-8 rounded-3xl glass border-white/5 hover:border-accent-purple/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(168,85,247,0.15)] cursor-default relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-accent-purple group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-none group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                            <i data-lucide={skill.icon} className="w-6 h-6 text-accent-purple group-hover:text-white transition-colors duration-500"></i>
                          </div>
                          <div>
                            <div className="font-bold text-white group-hover:text-accent-purple transition-colors duration-300">{skill.name}</div>
                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider group-hover:text-gray-300 transition-colors duration-300">{skill.desc}</div>
                          </div>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-accent-purple to-accent-cyan group-hover:brightness-125 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all duration-500" 
                            style={{ width: skill.level }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-10 rounded-[3rem] glass border-accent-purple/20 bg-accent-purple/5 relative overflow-hidden group max-w-4xl mx-auto">
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-0 transition-transform">
                  <i data-lucide="quote" className="w-20 h-20 text-accent-purple"></i>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-medium text-gray-300 italic relative z-10 leading-snug mb-8">
                    "{t('about.quote')}"
                    </p>
                    <div className="flex flex-wrap gap-4 relative z-10 justify-center">
                    <a href="https://t.me/Sinemagic" className="px-8 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-accent-cyan hover:text-white transition-all">
                        {t('about.discuss')}
                    </a>
                    <a href="#" className="px-8 py-4 glass rounded-2xl border-white/10 hover:border-white/30 text-xs font-black uppercase tracking-widest transition-all">
                        {t('about.download_cv')}
                    </a>
                    </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
