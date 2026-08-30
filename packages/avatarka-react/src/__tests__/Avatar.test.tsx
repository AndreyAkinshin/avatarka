import { cleanup, render } from '@testing-library/react';
import { createAvatar } from 'avatarka';
import { createElement, type ComponentType } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, expectTypeOf, it } from 'vitest';
import { Avatar, type AvatarProps } from '../Avatar';
import {
  getBaseTypeCatalog,
  type BaseTypeCatalog,
} from '../index';

const UnsafeAvatar = Avatar as unknown as ComponentType<Record<string, unknown>>;

function renderUnsafeAvatar(props: Record<string, unknown>): string {
  return renderToString(createElement(UnsafeAvatar, props));
}

afterEach(cleanup);

function imageSource(container: HTMLElement): string {
  const image = container.querySelector('img');
  if (!image) throw new Error('Avatar image was not rendered');
  return image.getAttribute('src') ?? '';
}

describe('Avatar', () => {
  it('mirrors the correlated core base-type catalog API', () => {
    const catalog = getBaseTypeCatalog('critters');

    expect(catalog.param).toBe('species');
    expectTypeOf(catalog).toEqualTypeOf<BaseTypeCatalog<'critters'>>();
  });

  it('renders a deterministic seeded avatar as an isolated image', () => {
    const first = render(<Avatar theme="folks" seed="person-42" />);
    const firstSource = imageSource(first.container);
    first.unmount();

    const second = render(<Avatar theme="folks" seed="person-42" />);
    expect(imageSource(second.container)).toBe(firstSource);
    expect(firstSource).toMatch(/^data:image\/svg\+xml,/);
  });

  it('supports a complete recipe', () => {
    const generated = createAvatar('critters', 'profile-17', {
      namespace: 'community',
      palette: 'coast',
    });
    const { container } = render(<Avatar recipe={generated.recipe} size={72} />);
    const image = container.querySelector('img')!;

    expect(decodeURIComponent(image.src)).toContain(generated.svg);
    expect(image.width).toBe(72);
    expect(image.height).toBe(72);
  });

  it('supports complete typed params without changing them', () => {
    const generated = createAvatar('bots', 'bot-9');
    const { container } = render(
      <Avatar theme="bots" params={generated.params} />,
    );

    expect(decodeURIComponent(imageSource(container))).toContain(generated.svg);
  });

  it('uses an empty alt by default and forwards image attributes', () => {
    const { container } = render(
      <Avatar
        theme="oddlings"
        seed="decorative"
        className="identity"
        loading="lazy"
        data-owner="settings"
      />,
    );
    const image = container.querySelector('img')!;

    expect(image.alt).toBe('');
    expect(image.className).toBe('identity');
    expect(image.getAttribute('loading')).toBe('lazy');
    expect(image.dataset.owner).toBe('settings');
  });

  it('supports meaningful alternative text', () => {
    const { container } = render(
      <Avatar theme="adventurers" seed="andrey" alt="Andrey's avatar" />,
    );

    expect(container.querySelector('img')?.alt).toBe("Andrey's avatar");
  });

  it('keeps namespaces deterministic and independent', () => {
    const first = render(
      <Avatar theme="folks" seed="42" namespace="site-a" />,
    );
    const firstSource = imageSource(first.container);
    first.unmount();
    const second = render(
      <Avatar theme="folks" seed="42" namespace="site-b" />,
    );

    expect(imageSource(second.container)).not.toBe(firstSource);
  });

  it('renders during SSR without browser globals or implicit randomness', () => {
    const markup = renderToString(
      <Avatar theme="snacks" seed="server-stable" size={48} />,
    );

    expect(markup).toContain('<img');
    expect(markup).toContain('width="48"');
    expect(markup).toContain('data:image/svg+xml');
  });

  it('makes all three source modes mutually exclusive at compile time', () => {
    const valid: AvatarProps<'folks'> = {
      theme: 'folks',
      seed: 'required',
    };
    expect(valid.seed).toBe('required');

    // @ts-expect-error A theme without params or a seed would be random during render.
    const missingSource: AvatarProps<'folks'> = { theme: 'folks' };
    // @ts-expect-error Recipe and seed modes cannot be combined.
    const conflictingSources: AvatarProps<'folks'> = {
      recipe: createAvatar('folks', 'one').recipe,
      theme: 'folks',
      seed: 'two',
    };
    expect(missingSource).toBeTruthy();
    expect(conflictingSources).toBeTruthy();
  });

  it('reserves image source, dimensions, and void-element content', () => {
    if (false) {
      // @ts-expect-error Avatar owns every responsive image source.
      <Avatar theme="folks" seed="owned" srcSet="external.png 1x" />;
      // @ts-expect-error Avatar owns responsive-source sizing metadata.
      <Avatar theme="folks" seed="owned" sizes="64px" />;
      // @ts-expect-error An img is a void element and cannot contain children.
      <Avatar theme="folks" seed="owned">invalid</Avatar>;
      // @ts-expect-error An img cannot receive inner HTML.
      <Avatar theme="folks" seed="owned" dangerouslySetInnerHTML={{ __html: 'invalid' }} />;
    }

    const { container } = render(createElement(UnsafeAvatar, {
      theme: 'folks',
      seed: 'owned',
      src: 'external.png',
      srcSet: 'external@2x.png 2x',
      sizes: '64px',
      width: 1,
      height: 2,
      children: 'invalid',
      dangerouslySetInnerHTML: { __html: 'invalid' },
    }));
    const image = container.querySelector('img')!;

    expect(image.src).toContain('data:image/svg+xml');
    expect(image.hasAttribute('srcset')).toBe(false);
    expect(image.hasAttribute('sizes')).toBe(false);
    expect(image.width).toBe(100);
    expect(image.height).toBe(100);
    expect(image.innerHTML).toBe('');
  });

  it('rejects every conflicting recipe-mode input from untyped callers', () => {
    const generated = createAvatar('folks', 'recipe-conflict');
    const conflicts: Record<string, unknown>[] = [
      { theme: 'folks' },
      { params: generated.params },
      { seed: 'another-seed' },
      { namespace: 'another-namespace' },
      { palette: 'coast' },
      { backgroundShape: 'rounded' },
      { traits: {} },
    ];

    for (const conflict of conflicts) {
      expect(() => renderUnsafeAvatar({
        recipe: generated.recipe,
        ...conflict,
      })).toThrowError(
        'Avatar recipe mode cannot be combined with theme, params, seed, namespace, palette, backgroundShape, or traits',
      );
    }
  });

  it('rejects every conflicting params-mode input from untyped callers', () => {
    const generated = createAvatar('folks', 'params-conflict');
    const conflicts: Record<string, unknown>[] = [
      { seed: 'another-seed' },
      { namespace: 'another-namespace' },
      { palette: 'coast' },
      { backgroundShape: 'rounded' },
      { traits: {} },
    ];

    for (const conflict of conflicts) {
      expect(() => renderUnsafeAvatar({
        theme: 'folks',
        params: generated.params,
        ...conflict,
      })).toThrowError(
        'Avatar params mode cannot be combined with seed, namespace, palette, backgroundShape, or traits',
      );
    }
  });

  it('requires a complete runtime source from untyped callers', () => {
    const params = createAvatar('folks', 'missing-theme').params;

    expect(() => renderUnsafeAvatar({ params })).toThrowError(
      'Avatar params mode requires a theme',
    );
    expect(() => renderUnsafeAvatar({ seed: 'missing-theme' })).toThrowError(
      'Avatar seeded mode requires a theme',
    );
    expect(() => renderUnsafeAvatar({})).toThrowError(
      'Avatar requires one source mode: recipe, theme with params, or theme with seed',
    );
    expect(() => renderUnsafeAvatar({ theme: 'folks' })).toThrowError(
      'Avatar seeded mode requires an explicit seed',
    );
  });
});
