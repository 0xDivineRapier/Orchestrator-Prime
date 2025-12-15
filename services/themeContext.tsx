
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WhiteLabelConfig } from '../types';

interface ThemeContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  branding: WhiteLabelConfig;
  updateBranding: (config: Partial<WhiteLabelConfig>) => void;
}

const DEFAULT_BRANDING: WhiteLabelConfig = {
  portalName: 'Orchestrator Prime',
  brandColor: '#2563eb', // blue-600
  supportEmail: 'support@orchestrator.com'
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [branding, setBranding] = useState<WhiteLabelConfig>(DEFAULT_BRANDING);

  useEffect(() => {
    // Check local storage for theme
    const storedTheme = localStorage.getItem('orchestrator_theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme);
    } else {
       setTheme('dark');
    }

    // Check local storage for branding
    const storedBranding = localStorage.getItem('orchestrator_branding');
    if (storedBranding) {
      setBranding(JSON.parse(storedBranding));
    }
  }, []);

  useEffect(() => {
    // Apply class to html element
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('orchestrator_theme', theme);
  }, [theme]);

  // Apply Brand Color via CSS Variable
  useEffect(() => {
    document.documentElement.style.setProperty('--brand-color', branding.brandColor);
  }, [branding.brandColor]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const updateBranding = (config: Partial<WhiteLabelConfig>) => {
    setBranding(prev => {
      const updated = { ...prev, ...config };
      localStorage.setItem('orchestrator_branding', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, branding, updateBranding }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
