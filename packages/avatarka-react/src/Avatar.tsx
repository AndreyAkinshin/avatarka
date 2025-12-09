import { useMemo } from 'react';
import {
  generateAvatar,
  generateParams,
  type ThemeName,
  type ThemeParams,
} from 'avatarka';

export interface AvatarProps<T extends ThemeName = ThemeName> {
  /** The theme to use for the avatar */
  theme: T;
  /** Parameters for the avatar. If not provided, will be generated from seed or randomly */
  params?: ThemeParams<T>;
  /** Seed for deterministic parameter generation (only used if params not provided) */
  seed?: string | number;
  /** Width of the avatar in pixels */
  size?: number;
  /** Additional class name */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Alt text for accessibility */
  alt?: string;
}

/**
 * Simple avatar renderer component with type-safe parameters.
 *
 * @example
 * ```tsx
 * // With explicit params (fully typed!)
 * <Avatar
 *   theme="monsters"
 *   params={{ bodyColor: '#9b59b6', eyeCount: 3, ... }}
 * />
 *
 * // With seed (deterministic)
 * <Avatar theme="animals" seed="user@email.com" />
 *
 * // Random
 * <Avatar theme="geometric" />
 * ```
 */
export function Avatar<T extends ThemeName>({
  theme,
  params,
  seed,
  size = 100,
  className,
  style,
  alt = 'Avatar',
}: AvatarProps<T>) {
  const finalParams = useMemo(() => {
    if (params) {
      return params;
    }
    return generateParams(theme, seed);
  }, [theme, params, seed]);

  const svg = useMemo(() => {
    return generateAvatar(theme, finalParams);
  }, [theme, finalParams]);

  const dataUrl = useMemo(() => {
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }, [svg]);

  return (
    <img
      src={dataUrl}
      alt={alt}
      width={size}
      height={size}
      className={className}
      style={{
        display: 'inline-block',
        ...style,
      }}
    />
  );
}

export default Avatar;
