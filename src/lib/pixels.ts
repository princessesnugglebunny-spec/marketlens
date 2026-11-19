/**
 * Pixel-level image checks for listing main images.
 */
export interface PixelCheckResult {
  ok: boolean;
  whiteBorderPercent: number;
  fillPercent: number;
  minDimension: number;
  issues: string[];
}

export function checkImagePixels(
  data: Uint8ClampedArray,
  width: number,
  height: number,
): PixelCheckResult {
  const issues: string[] = [];
  let whiteBorder = 0;
  const borderPixels = width * 2 + (height - 2) * 2;
  // count white pixels on border
  for (let x = 0; x < width; x++) {
    const i = x * 4;
    if (data[i] > 250 && data[i + 1] > 250 && data[i + 2] > 250) whiteBorder++;
    const j = ((height - 1) * width + x) * 4;
    if (data[j] > 250 && data[j + 1] > 250 && data[j + 2] > 250) whiteBorder++;
  }
  for (let y = 1; y < height - 1; y++) {
    const left = (y * width) * 4;
    if (data[left] > 250 && data[left + 1] > 250 && data[left + 2] > 250) whiteBorder++;
    const right = (y * width + (width - 1)) * 4;
    if (data[right] > 250 && data[right + 1] > 250 && data[right + 2] > 250) whiteBorder++;
  }
  const whiteBorderPercent = borderPixels > 0 ? whiteBorder / borderPixels : 0;
  if (whiteBorderPercent < 0.95) issues.push('border not pure white');

  // fill: non-white pixels
  let nonWhite = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (!(data[i] > 250 && data[i + 1] > 250 && data[i + 2] > 250)) nonWhite++;
  }
  const fillPercent = nonWhite / (width * height);
  if (fillPercent < 0.7 || fillPercent > 0.95) issues.push(`fill ${Math.round(fillPercent * 100)}% outside 70-95%`);

  const minDimension = Math.min(width, height);
  if (minDimension < 1000) issues.push(`min dimension ${minDimension} < 1000`);

  return { ok: issues.length === 0, whiteBorderPercent, fillPercent, minDimension, issues };
}
