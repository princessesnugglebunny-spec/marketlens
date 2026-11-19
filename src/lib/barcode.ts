/**
 * Barcode scanner using the browser BarcodeDetector API (where available).
 */
export interface BarcodeResult {
  rawValue: string;
  format: string;
}

export async function detectBarcodes(image: ImageBitmapSource): Promise<BarcodeResult[]> {
  const BD = (globalThis as unknown as { BarcodeDetector?: new (opts?: { formats?: string[] }) => { detect: (img: ImageBitmapSource) => Promise<{ rawValue: string; format: string }[]> } }).BarcodeDetector;
  if (!BD) return [];
  try {
    const detector = new BD({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'qr_code'] });
    const results = await detector.detect(image);
    return results.map((r) => ({ rawValue: r.rawValue, format: r.format }));
  } catch {
    return [];
  }
}

export function isBarcodeSupported(): boolean {
  return typeof (globalThis as unknown as { BarcodeDetector?: unknown }).BarcodeDetector !== 'undefined';
}
