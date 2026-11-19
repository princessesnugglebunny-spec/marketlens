/**
 * Profile builder: business name, tone, greeting, response length, policies.
 */
import { get, set } from './storage';

export interface Profile {
  businessName: string;
  tone: 'professional' | 'friendly' | 'casual';
  greeting: string;
  responseLength: 'short' | 'medium' | 'long';
  policies: string;
  replyLanguage: string;
}

export const DEFAULT_PROFILE: Profile = {
  businessName: '',
  tone: 'friendly',
  greeting: 'Hi! Thanks for your interest.',
  responseLength: 'medium',
  policies: '',
  replyLanguage: 'en',
};

export async function getProfile(): Promise<Profile> {
  return get<Profile>('mlf_profile', DEFAULT_PROFILE);
}

export async function saveProfile(p: Profile): Promise<void> {
  await set('mlf_profile', p);
}
