import { useState, useEffect, useCallback } from 'react';
import { AvatarPicker } from 'avatarka-react';
import { generateAvatar, svgToPng, type ThemeName, type ThemeParams } from 'avatarka';

type ColorMode = 'system' | 'light' | 'dark';

type DynamicParams = Record<string, string | number>;

function App() {
  const [colorMode, setColorMode] = useState<ColorMode>(() => {
    const stored = localStorage.getItem('avatarka-color-mode');
    return (stored as ColorMode) || 'system';
  });

  const [currentTheme, setCurrentTheme] = useState<ThemeName>('people');
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

  return (
    <div className="app">
      <header className="header">
        <div className="header-top">
          <div className="header-spacer" />
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
        <AvatarPicker onParamsChange={handleParamsChange} />
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
    </div>
  );
}

export default App;
