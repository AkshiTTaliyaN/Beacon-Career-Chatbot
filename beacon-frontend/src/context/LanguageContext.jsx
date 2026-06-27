import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  // Default language is 'km' (Khmer) as requested
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('beaconLanguage');
    return saved !== null ? saved : 'km';
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('beaconLanguage', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
