/** Encode SVG markup for rendering in the browser's isolated image context. */
export function svgDataUrl(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
