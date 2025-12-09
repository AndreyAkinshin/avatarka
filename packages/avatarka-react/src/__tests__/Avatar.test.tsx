import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar } from '../Avatar';
import { getDefaultParams } from 'avatarka';

// Helper to normalize clip IDs for comparison (now deterministic hashes based on content)
const normalizeClipIds = (str: string) =>
  str.replace(/clip-(?:circle|rounded|square)-[a-f0-9]+/g, 'clip-normalized');

describe('Avatar', () => {
  it('renders an image element', () => {
    render(<Avatar theme="geometric" seed="test" />);

    const img = screen.getByRole('img');
    expect(img).toBeDefined();
  });

  it('uses data URL as image source', () => {
    render(<Avatar theme="monsters" seed="test" />);

    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img.src).toMatch(/^data:image\/svg\+xml,/);
  });

  it('applies default alt text', () => {
    render(<Avatar theme="animals" seed="test" />);

    const img = screen.getByAltText('Avatar');
    expect(img).toBeDefined();
  });

  it('applies custom alt text', () => {
    render(<Avatar theme="robots" seed="test" alt="User avatar" />);

    const img = screen.getByAltText('User avatar');
    expect(img).toBeDefined();
  });

  it('applies default size', () => {
    render(<Avatar theme="geometric" seed="test" />);

    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img.width).toBe(100);
    expect(img.height).toBe(100);
  });

  it('applies custom size', () => {
    render(<Avatar theme="geometric" seed="test" size={200} />);

    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img.width).toBe(200);
    expect(img.height).toBe(200);
  });

  it('applies className', () => {
    render(<Avatar theme="people" seed="test" className="custom-avatar" />);

    const img = screen.getByRole('img');
    expect(img.className).toContain('custom-avatar');
  });

  it('applies inline style', () => {
    render(<Avatar theme="aliens" seed="test" style={{ border: '1px solid red' }} />);

    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img.style.border).toBe('1px solid red');
  });

  it('generates consistent avatar with same seed', () => {
    const { unmount } = render(<Avatar theme="geometric" seed="consistent-seed" />);
    const img1 = screen.getByRole('img') as HTMLImageElement;
    const src1 = img1.src;
    unmount();

    render(<Avatar theme="geometric" seed="consistent-seed" />);
    const img2 = screen.getByRole('img') as HTMLImageElement;
    const src2 = img2.src;

    expect(normalizeClipIds(src1)).toBe(normalizeClipIds(src2));
  });

  it('generates different avatar with different seed', () => {
    const { unmount } = render(<Avatar theme="geometric" seed="seed-a" />);
    const img1 = screen.getByRole('img') as HTMLImageElement;
    const src1 = img1.src;
    unmount();

    render(<Avatar theme="geometric" seed="seed-b" />);
    const img2 = screen.getByRole('img') as HTMLImageElement;
    const src2 = img2.src;

    expect(src1).not.toBe(src2);
  });

  it('uses provided params instead of generating', () => {
    const params = getDefaultParams('geometric');

    const { unmount } = render(<Avatar theme="geometric" params={params} />);
    const img1 = screen.getByRole('img') as HTMLImageElement;
    const src1 = img1.src;
    unmount();

    render(<Avatar theme="geometric" params={params} />);
    const img2 = screen.getByRole('img') as HTMLImageElement;
    const src2 = img2.src;

    expect(normalizeClipIds(src1)).toBe(normalizeClipIds(src2));
  });

  it('params take precedence over seed', () => {
    const params = getDefaultParams('monsters');

    const { unmount } = render(<Avatar theme="monsters" params={params} seed="different" />);
    const img1 = screen.getByRole('img') as HTMLImageElement;
    const src1 = img1.src;
    unmount();

    render(<Avatar theme="monsters" params={params} seed="another-seed" />);
    const img2 = screen.getByRole('img') as HTMLImageElement;
    const src2 = img2.src;

    // Same params should produce same result regardless of seed
    expect(normalizeClipIds(src1)).toBe(normalizeClipIds(src2));
  });

  it('renders different themes', () => {
    const themes = ['people', 'animals', 'monsters', 'robots', 'aliens', 'geometric'] as const;
    const sources: string[] = [];

    for (const theme of themes) {
      const { unmount } = render(<Avatar theme={theme} seed="same-seed" />);
      const img = screen.getByRole('img') as HTMLImageElement;
      sources.push(img.src);
      unmount();
    }

    // All themes should produce different results
    const uniqueSources = new Set(sources);
    expect(uniqueSources.size).toBe(themes.length);
  });

  it('applies display: inline-block style', () => {
    render(<Avatar theme="geometric" seed="test" />);

    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img.style.display).toBe('inline-block');
  });
});
