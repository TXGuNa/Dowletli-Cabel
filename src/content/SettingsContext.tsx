import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  type SiteSettings, SETTINGS_EVENT, DEFAULT_SETTINGS,
  loadSettings, persistSettings,
} from './settingsStore';

interface SettingsContextValue {
  settings: SiteSettings;
  setSetting: (key: keyof SiteSettings, value: string) => void;
  setSettings: (next: SiteSettings) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettingsState] = useState<SiteSettings>(() => loadSettings());

  useEffect(() => {
    const refresh = () => setSettingsState(loadSettings());
    window.addEventListener(SETTINGS_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(SETTINGS_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      setSetting: (key, val) => {
        const next = { ...settings, [key]: val };
        setSettingsState(next);
        persistSettings(next);
      },
      setSettings: (next) => {
        setSettingsState(next);
        persistSettings(next);
      },
      resetSettings: () => {
        const def = { ...DEFAULT_SETTINGS };
        setSettingsState(def);
        persistSettings(def);
      },
    }),
    [settings],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
