import { afterEach, describe, expect, it, vi } from 'vitest';
import { svgToPng, svgToPngDataUrl } from '../browser';

const SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1" />';

type ImageBehavior = 'load' | 'error' | 'throw';

function installPngEnvironment(
  imageBehavior: ImageBehavior = 'load',
  outputBlob: Blob | null = new Blob(['png'], { type: 'image/png' }),
) {
  const drawImage = vi.fn();
  const context = { drawImage } as unknown as CanvasRenderingContext2D;
  const toBlob = vi.fn((callback: BlobCallback, type?: string) => {
    expect(type).toBe('image/png');
    callback(outputBlob);
  });
  const canvas = {
    width: 0,
    height: 0,
    getContext: vi.fn(() => context),
    toBlob,
  } as unknown as HTMLCanvasElement;
  const createElement = vi.fn(() => canvas);
  const createObjectURL = vi.fn(() => 'blob:avatarka-test');
  const revokeObjectURL = vi.fn();

  class TestImage {
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    private value = '';

    get src(): string {
      return this.value;
    }

    set src(value: string) {
      this.value = value;

      if (imageBehavior === 'throw') {
        throw new Error('Image src assignment failed');
      }

      if (imageBehavior === 'error') {
        this.onerror?.();
      } else {
        this.onload?.();
      }
    }
  }

  vi.stubGlobal('document', { createElement });
  vi.stubGlobal('Image', TestImage);
  vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });

  return {
    canvas,
    createElement,
    createObjectURL,
    drawImage,
    revokeObjectURL,
    toBlob,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('svgToPng', () => {
  it('renders a 256px PNG by default and releases the object URL', async () => {
    const environment = installPngEnvironment();

    const png = await svgToPng(SVG);

    expect(png.type).toBe('image/png');
    expect(environment.canvas.width).toBe(256);
    expect(environment.canvas.height).toBe(256);
    expect(environment.drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, 256, 256);
    expect(environment.createObjectURL).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'image/svg+xml;charset=utf-8' }),
    );
    expect(environment.revokeObjectURL).toHaveBeenCalledOnce();
    expect(environment.revokeObjectURL).toHaveBeenCalledWith('blob:avatarka-test');
  });

  it('uses the requested output size', async () => {
    const environment = installPngEnvironment();

    await svgToPng(SVG, { size: 512 });

    expect(environment.canvas.width).toBe(512);
    expect(environment.canvas.height).toBe(512);
    expect(environment.drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, 512, 512);
  });

  it('accepts the documented maximum output size', async () => {
    const environment = installPngEnvironment();

    await svgToPng(SVG, { size: 8192 });

    expect(environment.canvas.width).toBe(8192);
    expect(environment.canvas.height).toBe(8192);
  });

  it.each([0, -1, 1.5, 8193, Number.NaN, Number.POSITIVE_INFINITY, Number.MAX_SAFE_INTEGER + 1])(
    'rejects invalid size %s before touching Canvas',
    async (size) => {
      const createElement = vi.fn();
      vi.stubGlobal('document', { createElement });

      await expect(svgToPng(SVG, { size })).rejects.toThrow(RangeError);
      expect(createElement).not.toHaveBeenCalled();
    },
  );

  it('reports a clear rejected promise outside a browser environment', async () => {
    vi.stubGlobal('document', undefined);

    await expect(svgToPng(SVG)).rejects.toThrow(/requires a browser environment/i);
  });

  it('releases the object URL when the SVG image fails to load', async () => {
    const environment = installPngEnvironment('error');

    await expect(svgToPng(SVG)).rejects.toThrow('SVG image could not be loaded');

    expect(environment.revokeObjectURL).toHaveBeenCalledOnce();
    expect(environment.toBlob).not.toHaveBeenCalled();
  });

  it('releases the object URL when assigning the image source throws', async () => {
    const environment = installPngEnvironment('throw');

    await expect(svgToPng(SVG)).rejects.toThrow('Image src assignment failed');

    expect(environment.revokeObjectURL).toHaveBeenCalledOnce();
    expect(environment.toBlob).not.toHaveBeenCalled();
  });

  it('rejects when Canvas cannot produce a Blob after releasing the object URL', async () => {
    const environment = installPngEnvironment('load', null);

    await expect(svgToPng(SVG)).rejects.toThrow('Canvas returned an empty Blob');

    expect(environment.revokeObjectURL).toHaveBeenCalledOnce();
  });
});

describe('svgToPngDataUrl', () => {
  it('converts the rendered PNG Blob to a data URL', async () => {
    installPngEnvironment();
    let receivedBlob: Blob | undefined;

    class SuccessfulFileReader {
      result: string | ArrayBuffer | null = null;
      error: DOMException | null = null;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      onabort: (() => void) | null = null;

      readAsDataURL(blob: Blob): void {
        receivedBlob = blob;
        this.result = 'data:image/png;base64,cG5n';
        this.onload?.();
      }
    }

    vi.stubGlobal('FileReader', SuccessfulFileReader);

    await expect(svgToPngDataUrl(SVG)).resolves.toBe('data:image/png;base64,cG5n');
    expect(receivedBlob?.type).toBe('image/png');
  });

  it('rejects when FileReader returns a non-string result', async () => {
    installPngEnvironment();

    class EmptyFileReader {
      result: string | ArrayBuffer | null = new ArrayBuffer(0);
      error: DOMException | null = null;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      onabort: (() => void) | null = null;

      readAsDataURL(): void {
        this.onload?.();
      }
    }

    vi.stubGlobal('FileReader', EmptyFileReader);

    await expect(svgToPngDataUrl(SVG)).rejects.toThrow('FileReader returned no data');
  });

  it('preserves FileReader errors', async () => {
    installPngEnvironment();

    class FailingFileReader {
      result: string | ArrayBuffer | null = null;
      error: DOMException | null = new DOMException('Blob read failed');
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      onabort: (() => void) | null = null;

      readAsDataURL(): void {
        this.onerror?.();
      }
    }

    vi.stubGlobal('FileReader', FailingFileReader);

    await expect(svgToPngDataUrl(SVG)).rejects.toThrow('Blob read failed');
  });

  it('reports missing FileReader before rendering', async () => {
    const environment = installPngEnvironment();
    vi.stubGlobal('FileReader', undefined);

    await expect(svgToPngDataUrl(SVG)).rejects.toThrow(/FileReader support/);
    expect(environment.createElement).not.toHaveBeenCalled();
  });

  it('validates size before checking browser APIs', async () => {
    const environment = installPngEnvironment();
    vi.stubGlobal('FileReader', undefined);

    await expect(svgToPngDataUrl(SVG, { size: 0 })).rejects.toThrow(RangeError);
    expect(environment.createElement).not.toHaveBeenCalled();
  });
});
