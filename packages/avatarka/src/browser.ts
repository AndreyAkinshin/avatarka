/** Options for PNG rendering in browser environments. */
export interface PngOptions {
  /** Square output size in pixels, from 1 through 8192. Defaults to 256. */
  size?: number;
}

const DEFAULT_PNG_SIZE = 256;
const MAX_PNG_SIZE = 8192;

function resolveSize(options?: PngOptions): number {
  const size = options?.size ?? DEFAULT_PNG_SIZE;

  if (!Number.isSafeInteger(size) || size <= 0 || size > MAX_PNG_SIZE) {
    throw new RangeError(`PNG size must be an integer between 1 and ${MAX_PNG_SIZE}`);
  }

  return size;
}

function assertPngEnvironment(): void {
  if (
    typeof document === 'undefined' ||
    typeof document.createElement !== 'function' ||
    typeof Image === 'undefined' ||
    typeof Blob === 'undefined' ||
    typeof URL === 'undefined' ||
    typeof URL.createObjectURL !== 'function' ||
    typeof URL.revokeObjectURL !== 'function'
  ) {
    throw new Error(
      'PNG rendering requires a browser environment with Canvas, Image, Blob, and object URL support',
    );
  }
}

function asError(error: unknown, fallbackMessage: string): Error {
  return error instanceof Error ? error : new Error(fallbackMessage);
}

/**
 * Render an SVG string to a PNG Blob using the browser Canvas API.
 *
 * @throws {RangeError} If `options.size` is not an integer from 1 through 8192.
 * @throws {Error} If the required browser APIs are unavailable.
 */
export async function svgToPng(svg: string, options?: PngOptions): Promise<Blob> {
  const size = resolveSize(options);
  assertPngEnvironment();

  return new Promise((resolve, reject) => {
    let objectUrl: string | undefined;

    const revokeObjectUrl = (): void => {
      if (objectUrl === undefined) return;

      const url = objectUrl;
      objectUrl = undefined;

      try {
        URL.revokeObjectURL(url);
      } catch {
        // Cleanup must not hide the rendering result or its original error.
      }
    };

    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        reject(new Error('PNG rendering failed: Canvas 2D context is unavailable'));
        return;
      }

      if (typeof canvas.toBlob !== 'function') {
        reject(new Error('PNG rendering failed: Canvas toBlob is unavailable'));
        return;
      }

      canvas.width = size;
      canvas.height = size;

      const image = new Image();

      image.onload = () => {
        revokeObjectUrl();

        try {
          context.drawImage(image, 0, 0, size, size);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('PNG rendering failed: Canvas returned an empty Blob'));
            }
          }, 'image/png');
        } catch (error) {
          reject(asError(error, 'PNG rendering failed'));
        }
      };

      image.onerror = () => {
        revokeObjectUrl();
        reject(new Error('PNG rendering failed: SVG image could not be loaded'));
      };

      const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      objectUrl = URL.createObjectURL(svgBlob);
      image.src = objectUrl;
    } catch (error) {
      revokeObjectUrl();
      reject(asError(error, 'PNG rendering failed'));
    }
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  if (typeof FileReader === 'undefined') {
    throw new Error(
      'PNG data URL generation requires a browser environment with FileReader support',
    );
  }

  return new Promise((resolve, reject) => {
    let reader: FileReader;

    try {
      reader = new FileReader();
    } catch (error) {
      reject(asError(error, 'PNG data URL generation failed'));
      return;
    }

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('PNG data URL generation failed: FileReader returned no data'));
      }
    };

    reader.onerror = () => {
      reject(reader.error ?? new Error('PNG data URL generation failed: Blob could not be read'));
    };

    reader.onabort = () => {
      reject(new Error('PNG data URL generation failed: Blob reading was aborted'));
    };

    try {
      reader.readAsDataURL(blob);
    } catch (error) {
      reject(asError(error, 'PNG data URL generation failed'));
    }
  });
}

/**
 * Render an SVG string to a PNG data URL using browser APIs.
 *
 * @throws {RangeError} If `options.size` is not an integer from 1 through 8192.
 * @throws {Error} If the required browser APIs are unavailable.
 */
export async function svgToPngDataUrl(
  svg: string,
  options?: PngOptions,
): Promise<string> {
  resolveSize(options);

  if (typeof FileReader === 'undefined') {
    throw new Error(
      'PNG data URL generation requires a browser environment with FileReader support',
    );
  }

  return blobToDataUrl(await svgToPng(svg, options));
}
