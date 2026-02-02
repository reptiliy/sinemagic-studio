import React, { useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

const Price: React.FC = () => {
  const { t } = useLanguage();

  useEffect(() => {
    if ((window as any).lucide) {
      (window as any).lucide.createIcons();
    }
  }, []);

  const PLANS = [
    {
      title: t('price.plan_basic_title'),
      price: t('price.plan_basic_price'),
      desc: t('price.plan_basic_desc'),
      features: ['Feature 1', 'Feature 2', 'Feature 3'],
      color: 'from-blue-400 to-blue-600'
    },
    {
      title: t('price.plan_pro_title'),
      price: t('price.plan_pro_price'),
      desc: t('price.plan_pro_desc'),
      features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
      color: 'from-purple-400 to-purple-600',
      popular: true
    },
    {
      title: t('price.plan_corp_title'),
      price: t('price.plan_corp_price'),
      desc: t('price.plan_corp_desc'),
      features: ['All Features', 'Priority Support', 'Custom Solutions'],
      color: 'from-orange-400 to-red-600'
    },
    {
      title: t('price.plan_business_title'),
      price: t('price.plan_business_price'),
      desc: t('price.plan_business_desc'),
      features: ['Dedicated Manager', 'API Access', 'Analytics', 'SLA'],
      color: 'from-emerald-400 to-emerald-600'
    },
    {
      title: t('price.plan_premium_title'),
      price: t('price.plan_premium_price'),
      desc: t('price.plan_premium_desc'),
      features: ['Unlimited Generations', 'Custom Models', '24/7 Support', 'Training'],
      color: 'from-pink-400 to-rose-600'
    },
    {
      title: t('price.plan_exclusive_title'),
      price: t('price.plan_exclusive_price'),
      desc: t('price.plan_exclusive_desc'),
      features: ['Full Whitelabel', 'Source Code', 'On-premise', 'Partnership'],
      color: 'from-amber-400 to-yellow-600'
    }
  ];

  return (
    <section id="price" className="min-h-screen py-24 bg-background relative overflow-hidden flex items-center">
      {/* Background Decorative Elements */}
      <div className="absolute top-[20%] -left-20 w-[600px] h-[600px] bg-accent-purple/5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[20%] -right-20 w-[500px] h-[500px] bg-accent-cyan/5 blur-[120px] rounded-full"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-6">
            {t('price.title')}
          </h2>
          <p className="text-xl text-gray-400">
            {t('price.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {PLANS.map((plan, i) => (
            <div key={i} className={`relative group p-4 md:p-8 rounded-[2rem] glass border-white/5 flex flex-col ${plan.popular ? 'border-accent-purple/50 shadow-[0_0_30px_rgba(168,85,247,0.2)]' : ''} hover:-translate-y-2 transition-all duration-500`}>
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-accent-purple text-white text-xs font-bold px-4 py-1 rounded-bl-xl rounded-tr-[2rem]">
                  POPULAR
                </div>
              )}
              
              <div className="mb-4 md:mb-8">
                <h3 className="text-lg md:text-2xl font-bold text-white mb-2">{plan.title}</h3>
                <div className={`text-2xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r ${plan.color}`}>
                  {plan.price}
                </div>
                <p className="text-sm md:text-base text-gray-400 mt-2">{plan.desc}</p>
              </div>

              <div className="flex-grow space-y-2 md:space-y-4 mb-4 md:mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 md:gap-3 text-gray-300">
                    <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center text-white text-[10px] md:text-xs`}>✓</div>
                    <span className="text-sm md:text-base">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-3 md:py-4 rounded-xl font-bold text-sm md:text-base transition-all ${plan.popular ? 'bg-white text-black hover:bg-gray-200' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Price;
