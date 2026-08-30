import { useMemo, type ImgHTMLAttributes } from 'react';
import {
  createAvatar,
  generateAvatar,
  type AvatarOptions,
  type AvatarRecipe,
  type AvatarRenderInput,
  type BackgroundShape,
  type PaletteName,
  type Seed,
  type ThemeName,
  type ThemeParams,
  type ThemeTraits,
} from 'avatarka';
import { svgDataUrl } from './svg';

interface AvatarImageProps
  extends Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    | 'src'
    | 'srcSet'
    | 'sizes'
    | 'width'
    | 'height'
    | 'children'
    | 'dangerouslySetInnerHTML'
  > {
  /** Rendered width and height in CSS pixels. */
  size?: number;
}

type RecipeAvatarProps<T extends ThemeName> = {
  /** A complete, serializable identity recipe. */
  recipe: AvatarRecipe<T>;
  theme?: never;
  params?: never;
  seed?: never;
  namespace?: never;
  palette?: never;
  backgroundShape?: never;
  traits?: never;
};

type ParamsAvatarProps<T extends ThemeName> = {
  /** Theme whose schema matches `params`. */
  theme: T;
  /** Complete parameters for an already generated avatar. */
  params: ThemeParams<T>;
  recipe?: never;
  seed?: never;
  namespace?: never;
  palette?: never;
  backgroundShape?: never;
  traits?: never;
};

type SeededAvatarProps<T extends ThemeName> = {
  /** Theme used to generate the identity. */
  theme: T;
  /** Required stable seed. Avatars are never randomized implicitly during render. */
  seed: Seed;
  /** Optional scope for using the same seed independently in different products. */
  namespace?: string;
  /** Optional curated color palette. */
  palette?: PaletteName;
  /** Optional avatar frame. */
  backgroundShape?: BackgroundShape;
  /** Optional semantic trait overrides. */
  traits?: Partial<ThemeTraits<T>>;
  recipe?: never;
  params?: never;
};

export type AvatarProps<T extends ThemeName = ThemeName> = T extends ThemeName
  ? AvatarImageProps & (
      | RecipeAvatarProps<T>
      | ParamsAvatarProps<T>
      | SeededAvatarProps<T>
    )
  : never;

function hasDefinedValue(values: readonly unknown[]): boolean {
  return values.some((value) => value !== undefined);
}

/**
 * Render a deterministic Avatarka identity as an isolated image.
 *
 * Pass a recipe, complete params, or a theme with a required seed. These modes
 * are mutually exclusive so an avatar can never become random because a prop
 * was accidentally omitted during SSR.
 */
export function Avatar<T extends ThemeName>(props: AvatarProps<T>) {
  const {
    recipe,
    theme,
    params,
    seed,
    namespace,
    palette,
    backgroundShape,
    traits,
    size = 100,
    alt = '',
    ...imageProps
  } = props;

  // Types prevent these attributes in TypeScript; strip them as well for
  // JavaScript callers because they can replace the owned image source or make
  // React reject the void <img> element before it renders.
  for (const key of [
    'src',
    'srcSet',
    'sizes',
    'width',
    'height',
    'children',
    'dangerouslySetInnerHTML',
  ]) {
    delete (imageProps as Record<string, unknown>)[key];
  }

  const svg = useMemo(() => {
    if (recipe !== undefined) {
      if (hasDefinedValue([
        theme,
        params,
        seed,
        namespace,
        palette,
        backgroundShape,
        traits,
      ])) {
        throw new TypeError(
          'Avatar recipe mode cannot be combined with theme, params, seed, namespace, palette, backgroundShape, or traits',
        );
      }
      return createAvatar(recipe).svg;
    }

    if (params !== undefined) {
      if (theme === undefined) {
        throw new TypeError('Avatar params mode requires a theme');
      }
      if (hasDefinedValue([seed, namespace, palette, backgroundShape, traits])) {
        throw new TypeError(
          'Avatar params mode cannot be combined with seed, namespace, palette, backgroundShape, or traits',
        );
      }
      return generateAvatar({ theme, params } as AvatarRenderInput<T>);
    }

    if (theme === undefined) {
      if (seed !== undefined) {
        throw new TypeError('Avatar seeded mode requires a theme');
      }
      throw new TypeError(
        'Avatar requires one source mode: recipe, theme with params, or theme with seed',
      );
    }
    if (seed === undefined) {
      throw new TypeError('Avatar seeded mode requires an explicit seed');
    }

    const options = {
      namespace,
      palette,
      backgroundShape,
      traits,
    } as AvatarOptions<T>;
    return createAvatar(theme, seed, options).svg;
  }, [backgroundShape, namespace, palette, params, recipe, seed, theme, traits]);

  const src = useMemo(
    () => svgDataUrl(svg),
    [svg],
  );

  return (
    <img
      {...imageProps}
      src={src}
      alt={alt}
      width={size}
      height={size}
    />
  );
}

export default Avatar;
