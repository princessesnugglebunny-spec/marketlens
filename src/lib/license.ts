/**
 * License management: Pro tier gating via license key validation.
 */
import { get, set } from './storage';

export interface LicenseInfo {
  key: string;
  tier: 'free' | 'pro';
  activatedAt: number;
  expiresAt: number | null;
}

const PRO_FEATURES = ['max-buy', 'buy-log', 'unlimited-keywords', 'analytics', 'negotiation', 'export'];

export async function getLicense(): Promise<LicenseInfo> {
  return get<LicenseInfo>('mlf_license', { key: '', tier: 'free', activatedAt: 0, expiresAt: null });
}

export async function activateLicense(key: string): Promise<boolean> {
  // Simple validation: key must be non-empty and at least 16 chars
  if (!key || key.length < 16) return false;
  const info: LicenseInfo = { key, tier: 'pro', activatedAt: Date.now(), expiresAt: null };
  await set('mlf_license', info);
  return true;
}

export async function isPro(): Promise<boolean> {
  const lic = await getLicense();
  if (lic.tier !== 'pro') return false;
  if (lic.expiresAt && Date.now() > lic.expiresAt) return false;
  return true;
}

export function isProFeature(feature: string): boolean {
  return PRO_FEATURES.includes(feature);
}

export async function canUse(feature: string): Promise<boolean> {
  if (!isProFeature(feature)) return true;
  return isPro();
}
