import React, { createContext, useState, useContext, ReactNode } from 'react';
import { translations as staticTranslations, Language, TranslationKey } from './translations';
import { useContent } from './ContentContext';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ru');
  const { translations: dbTranslations } = useContent();

  const t = (key: TranslationKey): string => {
    // 1. Try DB first
    if (dbTranslations[key] && dbTranslations[key][language]) {
        return dbTranslations[key][language];
    }

    // 2. Fallback to static file logic
    const keys = key.split('.');
    let value: any = staticTranslations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to RU if key missing in static
        let fallback: any = staticTranslations['ru'];
        for (const fk of keys) {
            if (fallback && typeof fallback === 'object' && fk in fallback) {
                fallback = fallback[fk];
            } else {
                return key;
            }
        }
        return fallback as string;
      }
    }
    
    return value as string;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
