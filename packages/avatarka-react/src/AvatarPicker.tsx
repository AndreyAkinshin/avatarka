import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  generateAvatar,
  generateGallery,
  generateParams,
  getTheme,
  getThemeNames,
  type GalleryItem,
  type ThemeName,
  type ThemeParams,
  type ParamDefinition,
} from 'avatarka';

function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function UnlockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  );
}

function DiceIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="3" ry="3" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="16" cy="8" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="8" cy="16" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

type DynamicParams = Record<string, string | number>;

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
  /** Grid size for gallery mode - creates an n×n grid (default: 5). Used as fallback for gridWidth/gridHeight. */
  gridSize?: number;
  /** Number of columns in the gallery grid (defaults to gridSize) */
  gridWidth?: number;
  /** Number of rows in the gallery grid (defaults to gridSize) */
  gridHeight?: number;
  /** Background color for the picker (CSS color value) */
  backgroundColor?: string;
  /** Accent color for buttons and active elements (CSS color value) */
  accentColor?: string;
  /** Layout mode: 'default' (stacked) or 'compact' (side-by-side with reduced spacing) */
  layout?: AvatarPickerLayout;
  /** When true, avatar background is always transparent and the background color control is hidden */
  alwaysTransparentBackground?: boolean;
  /** Callback for SVG save action. When provided, an "SVG" button appears in the header. */
  onSaveSvg?: () => void;
  /** Callback for PNG save action. When provided, a "PNG" button appears in the header. */
  onSavePng?: () => void;
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
  gridWidth,
  gridHeight,
  backgroundColor,
  accentColor,
  layout = 'default',
  alwaysTransparentBackground = false,
  onSaveSvg,
  onSavePng,
}: AvatarPickerProps) {
  const effectiveGridWidth = gridWidth ?? gridSize;
  const effectiveGridHeight = gridHeight ?? gridSize;
  const galleryCount = effectiveGridWidth * effectiveGridHeight;
  const themeNames = getThemeNames();
  const [theme, setTheme] = useState<ThemeName>(defaultTheme);
  const [params, setParams] = useState<DynamicParams>(() => ({
    ...generateParams(defaultTheme),
    backgroundShape: 'circle',
  }));
  const [mode, setMode] = useState<'editor' | 'gallery'>('editor');
  const [galleryVersion, setGalleryVersion] = useState(0);
  const [diceSpinning, setDiceSpinning] = useState(false);
  const [lockedParams, setLockedParams] = useState<Set<string>>(new Set());

  const handleToggleLock = useCallback((name: string) => {
    setLockedParams((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  const themeData = useMemo(() => getTheme(theme), [theme]);

  // Notify parent of initial params on mount
  useEffect(() => {
    onParamsChange?.(theme, params as ThemeParams<ThemeName>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const effectiveParams = useMemo(() => {
    if (alwaysTransparentBackground) {
      return { ...params, backgroundColor: 'none' };
    }
    return params;
  }, [params, alwaysTransparentBackground]);

  const svg = useMemo(() => {
    return generateAvatar(theme, effectiveParams as Parameters<typeof generateAvatar<typeof theme>>[1]);
  }, [theme, effectiveParams]);

  const handleThemeChange = useCallback(
    (newTheme: ThemeName) => {
      const newThemeData = getTheme(newTheme);
      const newParams: DynamicParams = { ...generateParams(newTheme), backgroundShape: 'circle' };
      // A manual theme switch must NOT clear locks (it only affects the dice/random
      // button). Keep the theme lock, and for locked fields that also exist in the
      // new theme (e.g. primaryColor) keep both their lock and their current value —
      // mirroring how handleRandomize treats locks.
      for (const name of lockedParams) {
        if (name !== 'theme' && name in newThemeData.schema && name in params) {
          newParams[name] = params[name]!;
        }
      }
      setTheme(newTheme);
      setParams(newParams);
      onParamsChange?.(newTheme, newParams as ThemeParams<ThemeName>);
    },
    [onParamsChange, lockedParams, params]
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
    const isThemeLocked = lockedParams.has('theme');
    const newTheme = isThemeLocked ? theme : themeNames[Math.floor(Math.random() * themeNames.length)]!;
    const newParams: DynamicParams = { ...generateParams(newTheme), backgroundShape: 'circle' };
    const newThemeData = getTheme(newTheme);
    for (const name of lockedParams) {
      if (name in newThemeData.schema && name in params) {
        newParams[name] = params[name]!;
      }
    }
    setTheme(newTheme);
    setParams(newParams);
    onParamsChange?.(newTheme, newParams as ThemeParams<ThemeName>);
  }, [themeNames, onParamsChange, lockedParams, params, theme]);

  // Filter out backgroundShape (and backgroundColor when always transparent) and sort: colors first, then others
  const sortedSchemaEntries = useMemo(() => {
    const hiddenParams = new Set(['backgroundShape']);
    if (alwaysTransparentBackground) hiddenParams.add('backgroundColor');
    const entries = Object.entries(themeData.schema).filter(([name]) => !hiddenParams.has(name));
    const colorEntries = entries.filter(([, def]) => def.type === 'color');
    const otherEntries = entries.filter(([, def]) => def.type !== 'color');
    return [...colorEntries, ...otherEntries];
  }, [themeData.schema, alwaysTransparentBackground]);

  // Gallery items — diverse selection with unique shapes
  const galleryItems = useMemo(() => {
    const seed = `gallery-v${galleryVersion}-${Date.now()}`;
    return generateGallery(galleryCount, seed, {
      backgroundShape: 'circle',
      transparentBackground: alwaysTransparentBackground,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [galleryCount, galleryVersion, alwaysTransparentBackground]);

  const handleGallerySelect = useCallback(
    (item: GalleryItem) => {
      const newThemeData = getTheme(item.theme);
      const newParams: DynamicParams = { ...item.params };
      // Keep locked field values that also exist in the picked avatar's theme,
      // consistent with handleThemeChange / handleRandomize.
      for (const name of lockedParams) {
        if (name !== 'theme' && name in newThemeData.schema && name in params) {
          newParams[name] = params[name]!;
        }
      }
      setTheme(item.theme);
      setParams(newParams);
      setMode('editor');
      onParamsChange?.(item.theme, newParams as ThemeParams<ThemeName>);
    },
    [onParamsChange, lockedParams, params]
  );

  const handleGalleryRandomize = useCallback(() => {
    setGalleryVersion((v) => v + 1);
  }, []);

  const renderControl = (name: string, definition: ParamDefinition) => {
    const value = params[name] ?? definition.default;
    const isLocked = lockedParams.has(name);

    const lockButton = (
      <button
        className={`avatarka-lock-btn ${isLocked ? 'locked' : ''}`}
        onClick={() => handleToggleLock(name)}
        title={isLocked ? 'Unlock' : 'Lock'}
        aria-label={isLocked ? `Unlock ${formatLabel(name)}` : `Lock ${formatLabel(name)}`}
      >
        {isLocked ? <LockIcon /> : <UnlockIcon />}
      </button>
    );

    switch (definition.type) {
      case 'color':
        return (
          <div key={name} className="avatarka-control-group">
            <label>{formatLabel(name)}</label>
            <div className="avatarka-control-row">
              <input
                type="color"
                value={String(value)}
                onChange={(e) => handleParamChange(name, e.target.value)}
              />
              {lockButton}
            </div>
          </div>
        );
      case 'number':
        return (
          <div key={name} className="avatarka-control-group">
            <label>
              {formatLabel(name)}: {value}
            </label>
            <div className="avatarka-control-row">
              <input
                type="range"
                min={definition.min}
                max={definition.max}
                step={definition.step ?? 1}
                value={Number(value)}
                onChange={(e) => handleParamChange(name, Number(e.target.value))}
              />
              {lockButton}
            </div>
          </div>
        );
      case 'select':
        return (
          <div key={name} className="avatarka-control-group">
            <label>{formatLabel(name)}</label>
            <div className="avatarka-control-row">
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
              {lockButton}
            </div>
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
    '--avatarka-grid-width': effectiveGridWidth,
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
        <div className="avatarka-tabs-actions">
          {onSaveSvg && (
            <button className="avatarka-action-btn" onClick={onSaveSvg} title="Save as SVG">
              SVG
            </button>
          )}
          {onSavePng && (
            <button className="avatarka-action-btn" onClick={onSavePng} title="Save as PNG">
              PNG
            </button>
          )}
          <button
            className={`avatarka-dice-btn ${diceSpinning ? 'spinning' : ''}`}
            onClick={() => {
              setDiceSpinning(true);
              (mode === 'editor' ? handleRandomize : handleGalleryRandomize)();
            }}
            onAnimationEnd={() => setDiceSpinning(false)}
            title="Randomize"
            aria-label="Randomize"
          >
            <DiceIcon />
          </button>
        </div>
      </div>

      {/* Content area */}
      {mode === 'editor' ? (
        <div className="avatarka-editor">
          {layout === 'compact' ? (
            <>
              <div className="avatarka-editor-left">
                <div className="avatarka-preview" dangerouslySetInnerHTML={{ __html: svg }} />
              </div>
              <div className="avatarka-editor-right">
                <div className="avatarka-control-row">
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
                  <button
                    className={`avatarka-lock-btn ${lockedParams.has('theme') ? 'locked' : ''}`}
                    onClick={() => handleToggleLock('theme')}
                    title={lockedParams.has('theme') ? 'Unlock' : 'Lock'}
                    aria-label={lockedParams.has('theme') ? 'Unlock Theme' : 'Lock Theme'}
                  >
                    {lockedParams.has('theme') ? <LockIcon /> : <UnlockIcon />}
                  </button>
                </div>
                <div className="avatarka-controls-grid">
                  {sortedSchemaEntries.map(([name, def]) => renderControl(name, def))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="avatarka-control-row">
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
                <button
                  className={`avatarka-lock-btn ${lockedParams.has('theme') ? 'locked' : ''}`}
                  onClick={() => handleToggleLock('theme')}
                  title={lockedParams.has('theme') ? 'Unlock' : 'Lock'}
                  aria-label={lockedParams.has('theme') ? 'Unlock Theme' : 'Lock Theme'}
                >
                  {lockedParams.has('theme') ? <LockIcon /> : <UnlockIcon />}
                </button>
              </div>

              <div className="avatarka-preview" dangerouslySetInnerHTML={{ __html: svg }} />

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
        </div>
      )}
    </div>
  );
}

export default AvatarPicker;
