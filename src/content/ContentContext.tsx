import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  type AllContent,
  CONTENT_EVENT,
  applyToI18n,
  clearStoredContent,
  getDefaults,
  loadContent,
  persistContent,
} from './contentStore';

interface ContentContextValue {
  content: AllContent;
  defaults: AllContent;
  saveContent: (next: AllContent) => void;
  resetContent: () => AllContent;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<AllContent>(() => loadContent());

  // Apply any stored overrides to i18next on first mount
  useEffect(() => {
    applyToI18n(content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Newly published content arrived after the first render -> apply it live.
  useEffect(() => {
    const refresh = () => {
      const next = loadContent();
      setContent(next);
      applyToI18n(next);
    };
    window.addEventListener(CONTENT_EVENT, refresh);
    return () => window.removeEventListener(CONTENT_EVENT, refresh);
  }, []);

  const value = useMemo<ContentContextValue>(
    () => ({
      content,
      defaults: getDefaults(),
      saveContent: (next: AllContent) => {
        setContent(next);
        persistContent(next);
        applyToI18n(next);
      },
      resetContent: () => {
        const defaults = getDefaults();
        setContent(defaults);
        clearStoredContent();
        applyToI18n(defaults);
        return defaults;
      },
    }),
    [content],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useContentStore() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContentStore must be used within ContentProvider');
  return ctx;
}
