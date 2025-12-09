import { useState, useMemo, useCallback } from 'react';
import {
  generateAvatar,
  generateParams,
  getTheme,
  getThemeNames,
  type ThemeName,
  type ThemeParams,
  type ParamDefinition,
} from 'avatarka';

interface GalleryItem {
  theme: ThemeName;
  params: ThemeParams<ThemeName>;
  svg: string;
}

export interface AvatarEditorProps<T extends ThemeName = ThemeName> {
  /** The theme to use for the avatar */
  theme: T;
  /** Current parameter values */
  params: ThemeParams<T>;
  /** Callback when parameters change */
  onChange: (params: ThemeParams<T>) => void;
  /** Callback when theme changes */
  onThemeChange?: (theme: ThemeName) => void;
  /** Size of the avatar preview */
  previewSize?: number;
  /** Additional class name for the container */
  className?: string;
  /** Additional inline styles for the container */
  style?: React.CSSProperties;
  /** Whether to show the avatar preview */
  showPreview?: boolean;
  /** Whether to show the gallery toggle button */
  showGalleryButton?: boolean;
  /** Callback when an avatar is selected from gallery (theme may change) */
  onGallerySelect?: (theme: ThemeName, params: ThemeParams<ThemeName>) => void;
  /** Number of avatars to show in gallery mode */
  galleryCount?: number;
  /** Size of each avatar in the gallery grid */
  galleryAvatarSize?: number;
}

interface ControlProps {
  name: string;
  definition: ParamDefinition;
  value: string | number;
  onChange: (value: string | number) => void;
}

function ColorControl({ name, value, onChange }: ControlProps) {
  return (
    <div style={styles.control}>
      <label style={styles.label}>{formatLabel(name)}</label>
      <input
        type="color"
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        style={styles.colorInput}
      />
    </div>
  );
}

function NumberControl({ name, definition, value, onChange }: ControlProps) {
  if (definition.type !== 'number') return null;

  return (
    <div style={styles.control}>
      <label style={styles.label}>
        {formatLabel(name)}: {value}
      </label>
      <input
        type="range"
        min={definition.min}
        max={definition.max}
        step={definition.step ?? 1}
        value={Number(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        style={styles.rangeInput}
      />
    </div>
  );
}

function SelectControl({ name, definition, value, onChange }: ControlProps) {
  if (definition.type !== 'select') return null;

  return (
    <div style={styles.control}>
      <label style={styles.label}>{formatLabel(name)}</label>
      <select
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        style={styles.selectInput}
      >
        {definition.options.map((option) => (
          <option key={option} value={option}>
            {formatLabel(option)}
          </option>
        ))}
      </select>
    </div>
  );
}

function formatLabel(name: string): string {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function generateGalleryItem(seed: string): GalleryItem {
  const themeNames = getThemeNames();
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash = hash & hash;
  }
  const themeIndex = Math.abs(hash) % themeNames.length;
  const theme = themeNames[themeIndex] as ThemeName;
  const params = generateParams(theme, seed);
  const svg = generateAvatar(theme, params);
  return { theme, params, svg };
}

/**
 * Interactive avatar editor with auto-generated controls from schema.
 * Type-safe: the params and onChange callback are typed to the theme.
 * 
 * Includes an optional Gallery mode to browse and select from random avatars.
 *
 * @example
 * ```tsx
 * function MyEditor() {
 *   const [theme, setTheme] = useState<ThemeName>('monsters');
 *   const [params, setParams] = useState(() => generateParams('monsters'));
 *
 *   return (
 *     <AvatarEditor
 *       theme={theme}
 *       params={params}
 *       onChange={setParams}
 *       showGalleryButton
 *       onGallerySelect={(newTheme, newParams) => {
 *         setTheme(newTheme);
 *         setParams(newParams);
 *       }}
 *     />
 *   );
 * }
 * ```
 */
export function AvatarEditor<T extends ThemeName>({
  theme,
  params,
  onChange,
  onThemeChange,
  previewSize = 100,
  className,
  style,
  showPreview = true,
  showGalleryButton = false,
  onGallerySelect,
  galleryCount = 16,
  galleryAvatarSize = 48,
}: AvatarEditorProps<T>) {
  const [mode, setMode] = useState<'editor' | 'gallery'>('editor');
  const [galleryVersion, setGalleryVersion] = useState(0);

  const themeData = useMemo(() => getTheme(theme), [theme]);

  const svg = useMemo(() => {
    return generateAvatar(theme, params);
  }, [theme, params]);

  const dataUrl = useMemo(() => {
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }, [svg]);

  const galleryItems = useMemo(() => {
    return Array.from({ length: galleryCount }, (_, i) => {
      const seed = `gallery-v${galleryVersion}-${i}-${Date.now()}`;
      return generateGalleryItem(seed);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [galleryCount, galleryVersion]);

  const handleParamChange = useCallback(
    (name: string, value: string | number) => {
      onChange({ ...params, [name]: value } as ThemeParams<T>);
    },
    [params, onChange]
  );

  const handleGallerySelect = useCallback(
    (item: GalleryItem) => {
      setMode('editor');
      if (onGallerySelect) {
        onGallerySelect(item.theme, item.params);
      }
    },
    [onGallerySelect]
  );

  const handleRandomizeGallery = useCallback(() => {
    setGalleryVersion((v) => v + 1);
  }, []);

  const renderControl = (name: string, definition: ParamDefinition) => {
    const value = (params as Record<string, string | number>)[name] ?? definition.default;
    const controlProps: ControlProps = {
      name,
      definition,
      value,
      onChange: (v) => handleParamChange(name, v),
    };

    switch (definition.type) {
      case 'color':
        return <ColorControl key={name} {...controlProps} />;
      case 'number':
        return <NumberControl key={name} {...controlProps} />;
      case 'select':
        return <SelectControl key={name} {...controlProps} />;
      default:
        return null;
    }
  };

  // Gallery mode
  if (mode === 'gallery') {
    return (
      <div className={className} style={style}>
        <div style={styles.galleryHeader}>
          <button onClick={() => setMode('editor')} style={styles.headerButton}>
            ← Editor
          </button>
          <span style={styles.galleryTitle}>Choose an Avatar</span>
          <button onClick={handleRandomizeGallery} style={styles.headerButton}>
            Randomize
          </button>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, ${galleryAvatarSize}px)`,
            gap: '8px',
            justifyContent: 'center',
            marginTop: '12px',
          }}
        >
          {galleryItems.map((item, index) => (
            <div
              key={index}
              onClick={() => handleGallerySelect(item)}
              title={`${getTheme(item.theme).name} - Click to select`}
              style={{
                ...styles.galleryItem,
                width: galleryAvatarSize,
                height: galleryAvatarSize,
              }}
            >
              <img
                src={`data:image/svg+xml,${encodeURIComponent(item.svg)}`}
                alt={`${item.theme} avatar`}
                width={galleryAvatarSize}
                height={galleryAvatarSize}
                style={styles.galleryImage}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Editor mode
  const themeNames = getThemeNames();
  const showTopRow = showGalleryButton || onThemeChange;

  return (
    <div className={className} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', ...style }}>
      {showPreview && (
        <div style={styles.previewContainer}>
          <img
            src={dataUrl}
            alt="Avatar preview"
            width={previewSize}
            height={previewSize}
            style={{ flexShrink: 0 }}
          />
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {showTopRow && (
          <div style={styles.topRow}>
            {showGalleryButton && (
              <button onClick={() => setMode('gallery')} style={styles.galleryButton}>
                Gallery
              </button>
            )}
            {onThemeChange && (
              <select
                value={theme}
                onChange={(e) => onThemeChange(e.target.value as ThemeName)}
                style={styles.themeSelect}
              >
                {themeNames.map((t) => (
                  <option key={t} value={t}>
                    {getTheme(t).name}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
        {Object.entries(themeData.schema).map(([name, definition]) =>
          renderControl(name, definition)
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  control: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  label: {
    fontSize: '12px',
    fontWeight: 500,
  },
  colorInput: {
    width: '100%',
    height: '28px',
    padding: '2px',
    cursor: 'pointer',
  },
  rangeInput: {
    width: '100%',
    cursor: 'pointer',
  },
  selectInput: {
    width: '100%',
    height: '28px',
    padding: '0 4px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  previewContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  },
  galleryButton: {
    padding: '6px 14px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    border: '1px solid #ccc',
    borderRadius: '6px',
    backgroundColor: '#fff',
    transition: 'background-color 0.2s',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
  },
  themeSelect: {
    height: '28px',
    padding: '0 8px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    border: '1px solid #ccc',
    borderRadius: '6px',
    backgroundColor: '#fff',
  },
  galleryHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  galleryTitle: {
    fontSize: '14px',
    fontWeight: 600,
    flex: 1,
    textAlign: 'center',
  },
  headerButton: {
    padding: '6px 12px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    border: '1px solid #ccc',
    borderRadius: '6px',
    backgroundColor: '#fff',
    transition: 'background-color 0.2s',
  },
  galleryItem: {
    cursor: 'pointer',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'transform 0.15s, box-shadow 0.15s',
    border: '2px solid transparent',
  },
  galleryImage: {
    display: 'block',
    width: '100%',
    height: '100%',
  },
};

export default AvatarEditor;
