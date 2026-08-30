import { describe, expectTypeOf, it } from 'vitest';
import {
  createAvatar,
  createRecipe,
  generateAvatar,
  generateGallery,
  generateParams,
  getBaseTypeCatalog,
  getDefaultParams,
  getPalette,
  getTheme,
  parseRecipe,
  type AvatarRecipe,
  type AvatarOptions,
  type AvatarRenderInput,
  type BaseTypeCatalog,
  type CrittersParams,
  type GalleryOptions,
  type GeneratedAvatar,
  type FolksParams,
  type ThemeName,
  type ThemeParams,
  type ThemeTraits,
} from '../index';

describe('v4 TypeScript API', () => {
  it('infers one-theme galleries without losing params correlation', () => {
    const folksGallery = generateGallery(2, 'types', { themes: ['folks'] });
    const folksOptions = { themes: ['folks'] } satisfies GalleryOptions;
    const folksFromOptions = generateGallery(2, 'types', folksOptions);
    const mixed = generateGallery(2, 'types');

    expectTypeOf(folksGallery).toEqualTypeOf<GeneratedAvatar<'folks'>[]>();
    expectTypeOf(folksFromOptions)
      .toEqualTypeOf<GeneratedAvatar<'folks'>[]>();
    expectTypeOf(mixed).toEqualTypeOf<GeneratedAvatar[]>();
    expectTypeOf(folksGallery[0]!.params).toEqualTypeOf<Readonly<FolksParams>>();
    expectTypeOf(generateAvatar(folksGallery[0]!)).toEqualTypeOf<string>();

    if (false) {
      // @ts-expect-error A mixed gallery cannot be narrowed by a type argument.
      generateGallery<'folks'>(2, 'types');
      // @ts-expect-error Contextual return types cannot pretend a mixed gallery is Folks-only.
      const folksOnly: GeneratedAvatar<'folks'>[] = generateGallery(2, 'types');
      void folksOnly;
    }
  });

  it('keeps recipes and generated avatars correlated', () => {
    const recipe = createRecipe('folks', 'types', {
      palette: 'coast',
      traits: { hairStyle: 'wave' },
    });
    const avatar = createAvatar(recipe);

    expectTypeOf(recipe).toEqualTypeOf<AvatarRecipe<'folks'>>();
    expectTypeOf(parseRecipe(recipe)).toEqualTypeOf<AvatarRecipe<'folks'>>();
    expectTypeOf(avatar).toEqualTypeOf<GeneratedAvatar<'folks'>>();
    expectTypeOf(avatar.params.hairStyle).toEqualTypeOf<FolksParams['hairStyle']>();

    const editable = generateParams('folks', 'editable');
    editable.hairStyle = 'wave';
    const editableDefaults = getDefaultParams('folks');
    editableDefaults.hairStyle = 'crop';
    if (false) {
      // @ts-expect-error Generated identities expose frozen parameter snapshots.
      avatar.params.hairStyle = 'crop';
    }
  });

  it('supports type-safe presentation changes on union recipes', () => {
    const gallery = generateGallery(2, 'types');
    const recolored = createAvatar({ ...gallery[0]!.recipe, palette: 'mono' });

    expectTypeOf(recolored).toMatchTypeOf<GeneratedAvatar>();
  });

  it('rejects cross-theme and presentation fields in semantic traits', () => {
    if (false) {
      // @ts-expect-error Critters traits do not belong to Folks.
      createRecipe('folks', 'types', { traits: { species: 'fox' } });
      // @ts-expect-error Palette is presentation, not a semantic trait.
      createRecipe('folks', 'types', { traits: { palette: 'coast' } });
      // @ts-expect-error Classic v3 ids are intentionally absent.
      createAvatar('people', 'types');
      // @ts-expect-error The pre-release v4 category was renamed without an alias.
      createAvatar('portrait', 'types');
      // @ts-expect-error The pre-release singular category was renamed without an alias.
      createAvatar('orb', 'types');
    }
  });

  it('anchors correlated arguments to the selected theme', () => {
    const critterOptions: AvatarOptions<'critters'> = {
      traits: { species: 'fox' },
    };
    const broadOptions: AvatarOptions = critterOptions;
    const critterParams = {} as CrittersParams;

    if (false) {
      // @ts-expect-error Pretyped Critters options cannot widen Folks to a union.
      createAvatar('folks', 'types', critterOptions);
      // @ts-expect-error A broad options union cannot bypass the selected theme.
      createAvatar('folks', 'types', broadOptions);
      // @ts-expect-error Recipe traits must belong to the selected theme.
      createRecipe('folks', 'types', critterOptions);
      // @ts-expect-error Generated params must belong to the selected theme.
      generateParams('folks', 'types', critterOptions);
      // @ts-expect-error Low-level parameter generation must never lose its seed.
      generateParams('folks');
      // @ts-expect-error An options object is not a reproducible seed.
      generateParams('folks', { palette: 'coast' });
      // @ts-expect-error Exact renderer params must match the selected theme.
      generateAvatar('folks', critterParams);
      // @ts-expect-error Object render input keeps theme and params correlated.
      generateAvatar({ theme: 'folks', params: critterParams });
    }

    expectTypeOf(createAvatar('folks', 'types', {
      traits: { hairStyle: 'wave' },
    })).toEqualTypeOf<GeneratedAvatar<'folks'>>();

    const renderGeneric = <T extends ThemeName>(
      theme: T,
      params: ThemeParams<T>,
    ) => [
      generateAvatar(theme, params),
      generateAvatar({ theme, params }),
    ];
    expectTypeOf(renderGeneric).returns.toEqualTypeOf<string[]>();
  });

  it('supports natural generic option and render-input wrappers', () => {
    const withTraits = <T extends ThemeName>(
      theme: T,
      traits: Partial<ThemeTraits<T>>,
    ) => {
      const options: AvatarOptions<T> = { traits };
      return {
        avatar: createAvatar(theme, 'generic', options),
        recipe: createRecipe(theme, 'generic', options),
        params: generateParams(theme, 'generic', options),
      };
    };
    const asRenderInput = <T extends ThemeName>(
      theme: T,
      params: ThemeParams<T>,
    ): AvatarRenderInput<T> => ({ theme, params });

    const folks = withTraits('folks', { hairStyle: 'wave' });
    expectTypeOf(folks.avatar).toEqualTypeOf<GeneratedAvatar<'folks'>>();
    expectTypeOf(folks.recipe).toEqualTypeOf<AvatarRecipe<'folks'>>();
    expectTypeOf(folks.params).toEqualTypeOf<FolksParams>();
    expectTypeOf(asRenderInput('folks', folks.params))
      .toEqualTypeOf<AvatarRenderInput<'folks'>>();
  });

  it('keeps union traits useful and metadata discriminated', () => {
    const critterTraits: Partial<ThemeTraits> = { species: 'fox' };
    expectTypeOf(critterTraits).toMatchTypeOf<Partial<ThemeTraits>>();

    if (false) {
      // @ts-expect-error Unknown fields are not accepted by any v4 theme.
      const unknownTraits: ThemeTraits = { totallyBogus: true };
      // @ts-expect-error A trait collection is always an object.
      const primitiveTraits: ThemeTraits = 42;
      void unknownTraits;
      void primitiveTraits;
    }

    expectTypeOf(getTheme('folks').id).toEqualTypeOf<'folks'>();
    expectTypeOf(getTheme('folks').baseTypeParam).toEqualTypeOf<'hairStyle'>();
    expectTypeOf(getPalette('coast').name).toEqualTypeOf<'Coast'>();
    const metadata = getTheme('folks' as ThemeName);
    if (metadata.id === 'folks') {
      expectTypeOf(metadata.schema.hairStyle.default).toEqualTypeOf<'sweep'>();
    }
  });

  it('keeps base-type catalog params and values correlated with their theme', () => {
    const critters = getBaseTypeCatalog('critters');
    expectTypeOf(critters).toEqualTypeOf<BaseTypeCatalog<'critters'>>();
    expectTypeOf(critters.param).toEqualTypeOf<'species'>();
    expectTypeOf<CrittersParams['species']>()
      .toEqualTypeOf<(typeof critters.values)[number]>();

    const catalog = getBaseTypeCatalog('critters' as ThemeName);
    if (catalog.param === 'species') {
      expectTypeOf(catalog.values)
        .toEqualTypeOf<BaseTypeCatalog<'critters'>['values']>();
    }
  });

  it('does not advertise unsupported custom-theme construction types', () => {
    if (false) {
      // @ts-expect-error The pre-release v4 type was renamed without an alias.
      expectTypeOf<import('../index').PortraitParams>();
      // @ts-expect-error The pre-release v4 type was renamed without an alias.
      expectTypeOf<import('../index').OrbParams>();
      // @ts-expect-error v4 has no public custom-theme registration API.
      expectTypeOf<import('../index').ColorParam>();
      // @ts-expect-error v4 has no public custom-theme registration API.
      expectTypeOf<import('../index').NumberParam>();
      // @ts-expect-error v4 has no public custom-theme registration API.
      expectTypeOf<import('../index').SelectParam>();
      // @ts-expect-error v4 has no public custom-theme registration API.
      expectTypeOf<import('../index').ParamDefinition>();
      // @ts-expect-error v4 has no public custom-theme registration API.
      expectTypeOf<import('../index').ParamSchema>();
      // @ts-expect-error v4 has no public custom-theme registration API.
      expectTypeOf<import('../index').ParamsFromSchema>();
    }
  });
});
