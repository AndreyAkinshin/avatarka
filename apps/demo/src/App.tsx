import { useState, useEffect, useCallback } from 'react';
import { AvatarPicker, type AvatarPickerLayout } from 'avatarka-react';
import { generateAvatar, svgToPng, getThemeNames, type ThemeName, type ThemeParams } from 'avatarka';

const allThemes = getThemeNames();
const randomTheme = allThemes[Math.floor(Math.random() * allThemes.length)]!;

type ColorMode = 'system' | 'light' | 'dark';

type DynamicParams = Record<string, string | number>;

function App() {
  const [colorMode, setColorMode] = useState<ColorMode>(() => {
    const stored = localStorage.getItem('avatarka-color-mode');
    return (stored as ColorMode) || 'system';
  });

  const [layout, setLayout] = useState<AvatarPickerLayout>(() => {
    const stored = localStorage.getItem('avatarka-layout');
    return (stored as AvatarPickerLayout) || 'default';
  });

  const [transparentBg, setTransparentBg] = useState<boolean>(() => {
    return localStorage.getItem('avatarka-transparent-bg') === 'true';
  });

  const [currentTheme, setCurrentTheme] = useState<ThemeName>(randomTheme);
  const [currentParams, setCurrentParams] = useState<DynamicParams | null>(null);

  const handleParamsChange = useCallback((theme: ThemeName, params: ThemeParams<ThemeName>) => {
    setCurrentTheme(theme);
    setCurrentParams(params as DynamicParams);
  }, []);

  const getCurrentSvg = useCallback(() => {
    if (!currentParams) return null;
    return generateAvatar(currentTheme, currentParams as Parameters<typeof generateAvatar<typeof currentTheme>>[1]);
  }, [currentTheme, currentParams]);

  const handleSaveToSvg = useCallback(() => {
    const svg = getCurrentSvg();
    if (!svg) return;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `avatar-${currentTheme}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [getCurrentSvg, currentTheme]);

  const handleSaveToPng = useCallback(async () => {
    const svg = getCurrentSvg();
    if (!svg) return;

    const blob = await svgToPng(svg, { size: 512 });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `avatar-${currentTheme}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [getCurrentSvg, currentTheme]);

  // Apply color mode to document
  useEffect(() => {
    const applyColorMode = (mode: ColorMode) => {
      const root = document.documentElement;
      if (mode === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      } else {
        root.setAttribute('data-theme', mode);
      }
    };

    applyColorMode(colorMode);
    localStorage.setItem('avatarka-color-mode', colorMode);

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (colorMode === 'system') {
        applyColorMode('system');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [colorMode]);

  // Persist layout preference
  useEffect(() => {
    localStorage.setItem('avatarka-layout', layout);
  }, [layout]);

  // Persist transparent background preference
  useEffect(() => {
    localStorage.setItem('avatarka-transparent-bg', String(transparentBg));
  }, [transparentBg]);

  return (
    <div className="app">
      <header className="header">
        <div className="header-top">
          <div className="layout-switcher">
            <button
              className={`layout-btn ${layout === 'default' ? 'active' : ''}`}
              onClick={() => setLayout('default')}
              title="Default Layout"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M3 3h18v2H3V3zm0 8h18v2H3v-2zm0 8h18v2H3v-2z"/>
              </svg>
            </button>
            <button
              className={`layout-btn ${layout === 'compact' ? 'active' : ''}`}
              onClick={() => setLayout('compact')}
              title="Compact Layout"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z"/>
              </svg>
            </button>
            <button
              className={`layout-btn ${transparentBg ? 'active' : ''}`}
              onClick={() => setTransparentBg((v) => !v)}
              title="Transparent Background"
            >
              <svg viewBox="0 0 18 18" width="18" height="18" fill="currentColor">
                <rect x="1" y="1" width="4" height="4"/><rect x="9" y="1" width="4" height="4"/>
                <rect x="5" y="5" width="4" height="4"/><rect x="13" y="5" width="4" height="4"/>
                <rect x="1" y="9" width="4" height="4"/><rect x="9" y="9" width="4" height="4"/>
                <rect x="5" y="13" width="4" height="4"/><rect x="13" y="13" width="4" height="4"/>
              </svg>
            </button>
          </div>
          <div className="header-title">
            <h1>Avatarka</h1>
          </div>
          <div className="color-mode-switcher">
            <button
              className={`color-mode-btn ${colorMode === 'system' ? 'active' : ''}`}
              onClick={() => setColorMode('system')}
              title="System"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M20 3H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h6v2H8v2h8v-2h-2v-2h6c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12H4V5h16v10z"/>
              </svg>
            </button>
            <button
              className={`color-mode-btn ${colorMode === 'light' ? 'active' : ''}`}
              onClick={() => setColorMode('light')}
              title="Light"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
              </svg>
            </button>
            <button
              className={`color-mode-btn ${colorMode === 'dark' ? 'active' : ''}`}
              onClick={() => setColorMode('dark')}
              title="Dark"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="main-card">
        <AvatarPicker defaultTheme={randomTheme} layout={layout} alwaysTransparentBackground={transparentBg} onParamsChange={handleParamsChange} />
        <div className="save-buttons">
          <button className="save-btn" onClick={handleSaveToSvg}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            Save to SVG
          </button>
          <button className="save-btn" onClick={handleSaveToPng}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            Save to PNG
          </button>
        </div>
      </main>

      <footer className="footer-links">
        <a href="https://github.com/AndreyAkinshin/avatarka" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
          GitHub
        </a>
        <a href="https://www.npmjs.com/package/avatarka" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z"/>
          </svg>
          avatarka
        </a>
        <a href="https://www.npmjs.com/package/avatarka-react" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z"/>
          </svg>
          avatarka-react
        </a>
      </footer>
    </div>
  );
}

export default App;
