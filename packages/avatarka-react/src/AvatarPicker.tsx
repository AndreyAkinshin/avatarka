import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  generateAvatar,
  generateParams,
  getTheme,
  getThemeNames,
  type ThemeName,
  type ThemeParams,
  type ParamDefinition,
} from 'avatarka';

type DynamicParams = Record<string, string | number>;

interface GalleryItem {
  theme: ThemeName;
  params: DynamicParams;
  svg: string;
}

export type AvatarPickerLayout = 'default' | 'compact';

export interface AvatarPickerProps {
  /** Initial theme to use (default: 'people') */
  defaultTheme?: ThemeName;
  /** Additional class name for the container */
  className?: string;
  /** Additional inline styles for the container */
  style?: React.CSSProperties;
  /** Callback when avatar parameters change */
  onParamsChange?: (theme: ThemeName, params: ThemeParams<ThemeName>) => void;
  /** Grid size for gallery mode - creates an n×n grid (default: 5) */
  gridSize?: number;
  /** Background color for the picker (CSS color value) */
  backgroundColor?: string;
  /** Accent color for buttons and active elements (CSS color value) */
  accentColor?: string;
  /** Layout mode: 'default' (stacked) or 'compact' (side-by-side with reduced spacing) */
  layout?: AvatarPickerLayout;
}

function formatLabel(name: string): string {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * Self-contained avatar picker component with theme selector, editor controls,
 * and gallery mode. Manages its own internal state.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <AvatarPicker />
 *
 * // With initial theme
 * <AvatarPicker defaultTheme="monsters" />
 *
 * // With change callback
 * <AvatarPicker onParamsChange={(theme, params) => console.log(theme, params)} />
 * ```
 */
export function AvatarPicker({
  defaultTheme = 'people',
  className,
  style,
  onParamsChange,
  gridSize = 5,
  backgroundColor,
  accentColor,
  layout = 'default',
}: AvatarPickerProps) {
  const galleryCount = gridSize * gridSize;
  const themeNames = getThemeNames();
  const [theme, setTheme] = useState<ThemeName>(defaultTheme);
  const [params, setParams] = useState<DynamicParams>(() => ({
    ...generateParams(defaultTheme),
    backgroundShape: 'circle',
  }));
  const [mode, setMode] = useState<'editor' | 'gallery'>('editor');
  const [galleryVersion, setGalleryVersion] = useState(0);

  const themeData = useMemo(() => getTheme(theme), [theme]);

  // Notify parent of initial params on mount
  useEffect(() => {
    onParamsChange?.(theme, params as ThemeParams<ThemeName>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const svg = useMemo(() => {
    return generateAvatar(theme, params as Parameters<typeof generateAvatar<typeof theme>>[1]);
  }, [theme, params]);

  const handleThemeChange = useCallback(
    (newTheme: ThemeName) => {
      setTheme(newTheme);
      const newParams = { ...generateParams(newTheme), backgroundShape: 'circle' };
      setParams(newParams);
      onParamsChange?.(newTheme, newParams as ThemeParams<ThemeName>);
    },
    [onParamsChange]
  );

  const handleParamChange = useCallback(
    (name: string, value: string | number) => {
      setParams((prev) => {
        const newParams = { ...prev, [name]: value };
        onParamsChange?.(theme, newParams as ThemeParams<ThemeName>);
        return newParams;
      });
    },
    [theme, onParamsChange]
  );

  const handleRandomize = useCallback(() => {
    const newParams = { ...generateParams(theme), backgroundShape: 'circle' };
    setParams(newParams);
    onParamsChange?.(theme, newParams as ThemeParams<ThemeName>);
  }, [theme, onParamsChange]);

  // Filter out backgroundShape and sort: colors first, then others
  const sortedSchemaEntries = useMemo(() => {
    const entries = Object.entries(themeData.schema).filter(([name]) => name !== 'backgroundShape');
    const colorEntries = entries.filter(([, def]) => def.type === 'color');
    const otherEntries = entries.filter(([, def]) => def.type !== 'color');
    return [...colorEntries, ...otherEntries];
  }, [themeData.schema]);

  // Gallery items
  const galleryItems = useMemo(() => {
    return Array.from({ length: galleryCount }, (_, i) => {
      const seed = `gallery-v${galleryVersion}-${i}-${Date.now()}`;
      // Pick random theme based on seed
      let hash = 0;
      for (let j = 0; j < seed.length; j++) {
        hash = (hash << 5) - hash + seed.charCodeAt(j);
        hash = hash & hash;
      }
      const themeIndex = Math.abs(hash) % themeNames.length;
      const t = themeNames[themeIndex] as ThemeName;
      const itemParams = { ...generateParams(t, seed), backgroundShape: 'circle' } as DynamicParams;
      return {
        theme: t,
        params: itemParams,
        svg: generateAvatar(t, itemParams as Parameters<typeof generateAvatar<typeof t>>[1]),
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeNames, galleryCount, galleryVersion]);

  const handleGallerySelect = useCallback(
    (item: GalleryItem) => {
      setTheme(item.theme);
      setParams(item.params);
      setMode('editor');
      onParamsChange?.(item.theme, item.params as ThemeParams<ThemeName>);
    },
    [onParamsChange]
  );

  const handleGalleryRandomize = useCallback(() => {
    setGalleryVersion((v) => v + 1);
  }, []);

  const renderControl = (name: string, definition: ParamDefinition) => {
    const value = params[name] ?? definition.default;

    switch (definition.type) {
      case 'color':
        return (
          <div key={name} className="avatarka-control-group">
            <label>{formatLabel(name)}</label>
            <input
              type="color"
              value={String(value)}
              onChange={(e) => handleParamChange(name, e.target.value)}
            />
          </div>
        );
      case 'number':
        return (
          <div key={name} className="avatarka-control-group">
            <label>
              {formatLabel(name)}: {value}
            </label>
            <input
              type="range"
              min={definition.min}
              max={definition.max}
              step={definition.step ?? 1}
              value={Number(value)}
              onChange={(e) => handleParamChange(name, Number(e.target.value))}
            />
          </div>
        );
      case 'select':
        return (
          <div key={name} className="avatarka-control-group">
            <label>{formatLabel(name)}</label>
            <select
              value={String(value)}
              onChange={(e) => handleParamChange(name, e.target.value)}
            >
              {definition.options.map((option) => (
                <option key={option} value={option}>
                  {formatLabel(option)}
                </option>
              ))}
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  const containerStyle: React.CSSProperties = {
    ...style,
    ...(backgroundColor && { '--avatarka-bg': backgroundColor }),
    ...(accentColor && { '--avatarka-accent': accentColor }),
    '--avatarka-grid-size': gridSize,
  } as React.CSSProperties;

  const layoutClass = layout === 'compact' ? 'avatarka-picker--compact' : '';

  return (
    <div className={`avatarka-picker ${layoutClass} ${className || ''}`.trim()} style={containerStyle}>
      {/* Tab bar */}
      <div className="avatarka-tabs">
        <button
          className={`avatarka-tab ${mode === 'editor' ? 'active' : ''}`}
          onClick={() => setMode('editor')}
        >
          Editor
        </button>
        <button
          className={`avatarka-tab ${mode === 'gallery' ? 'active' : ''}`}
          onClick={() => setMode('gallery')}
        >
          Gallery
        </button>
      </div>

      {/* Content area */}
      {mode === 'editor' ? (
        <div className="avatarka-editor">
          {layout === 'compact' ? (
            <>
              <div className="avatarka-editor-left">
                <div className="avatarka-preview" dangerouslySetInnerHTML={{ __html: svg }} />
                <button className="avatarka-btn avatarka-btn-primary" onClick={handleRandomize}>
                  Randomize
                </button>
              </div>
              <div className="avatarka-editor-right">
                <select
                  className="avatarka-theme-dropdown"
                  value={theme}
                  onChange={(e) => handleThemeChange(e.target.value as ThemeName)}
                >
                  {themeNames.map((t) => (
                    <option key={t} value={t}>
                      {getTheme(t).name}
                    </option>
                  ))}
                </select>
                <div className="avatarka-controls-grid">
                  {sortedSchemaEntries.map(([name, def]) => renderControl(name, def))}
                </div>
              </div>
            </>
          ) : (
            <>
              <select
                className="avatarka-theme-dropdown"
                value={theme}
                onChange={(e) => handleThemeChange(e.target.value as ThemeName)}
              >
                {themeNames.map((t) => (
                  <option key={t} value={t}>
                    {getTheme(t).name}
                  </option>
                ))}
              </select>

              <div className="avatarka-preview" dangerouslySetInnerHTML={{ __html: svg }} />

              <button className="avatarka-btn avatarka-btn-primary" onClick={handleRandomize}>
                Randomize
              </button>

              <div className="avatarka-controls-grid">
                {sortedSchemaEntries.map(([name, def]) => renderControl(name, def))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="avatarka-gallery">
          <div className="avatarka-gallery-grid">
            {galleryItems.map((item, i) => (
              <div
                key={i}
                className="avatarka-gallery-item"
                dangerouslySetInnerHTML={{ __html: item.svg }}
                onClick={() => handleGallerySelect(item)}
                title={`${getTheme(item.theme).name} - Click to edit`}
              />
            ))}
          </div>
          <button className="avatarka-btn avatarka-btn-primary" onClick={handleGalleryRandomize}>
            Randomize
          </button>
        </div>
      )}
    </div>
  );
}

export default AvatarPicker;
