import {
  createAvatar,
  getBaseTypeCatalog,
  paletteNames,
  type BaseTypeCatalog,
  type GeneratedAvatar,
  type PaletteName,
  type ThemeName,
  type ThemeTraits,
} from 'avatarka';
import type { AvatarGalleryRequest } from 'avatarka-react';
import { Rng } from 'pragmastat';

export const DEV_CATALOG_REVIEW_SENTINEL = 'AVATARKA_DEV_CATALOG_REVIEW_ONLY';

const PALETTE_SCHEDULE_STREAM = 'catalog-review:balanced-palette-schedule:v1';

function paletteScheduleSeed(
  request: AvatarGalleryRequest,
  stream: 'remainder' | 'assignment',
): string {
  return JSON.stringify([
    PALETTE_SCHEDULE_STREAM,
    request.namespace,
    request.theme,
    typeof request.seed,
    String(request.seed),
    stream,
  ]);
}

function balancedPaletteSchedule(
  request: AvatarGalleryRequest,
  count: number,
): readonly PaletteName[] {
  const slots: PaletteName[] = [];
  const completeCycles = Math.floor(count / paletteNames.length);
  for (let cycle = 0; cycle < completeCycles; cycle++) {
    slots.push(...paletteNames);
  }

  const remainder = count % paletteNames.length;
  if (remainder > 0) {
    const remainderOrder = new Rng(
      paletteScheduleSeed(request, 'remainder'),
    ).shuffle([...paletteNames]);
    slots.push(...remainderOrder.slice(0, remainder));
  }

  return Object.freeze(new Rng(
    paletteScheduleSeed(request, 'assignment'),
  ).shuffle(slots));
}

function createCatalogItem<T extends ThemeName>(
  request: AvatarGalleryRequest & { readonly theme: T },
  catalog: BaseTypeCatalog<T>,
  value: BaseTypeCatalog<T>['values'][number],
  index: number,
  palette: PaletteName,
): GeneratedAvatar<T> {
  const traits = {
    [catalog.param]: value,
  } as Partial<ThemeTraits<T>>;

  return createAvatar(request.theme, request.seed, {
    namespace: `${request.namespace}:gallery-item:${index}`,
    palette,
    backgroundShape: request.backgroundShape,
    traits,
  });
}

/** Development review corpus: one avatar per schema-ordered base type. */
export function generateCatalogReview<T extends ThemeName>(
  request: AvatarGalleryRequest & { readonly theme: T },
): readonly GeneratedAvatar<T>[] {
  const catalog = getBaseTypeCatalog(request.theme);
  if (request.count !== catalog.values.length) {
    throw new RangeError(
      `${DEV_CATALOG_REVIEW_SENTINEL}: expected ${catalog.values.length} ${request.theme} base types, got ${request.count}`,
    );
  }

  const palettes = balancedPaletteSchedule(request, catalog.values.length);
  return Object.freeze(catalog.values.map((value, index) => (
    createCatalogItem(request, catalog, value, index, palettes[index]!)
  )));
}
