/**
 * Local lead CRM: store buyer leads from Marketplace conversations (manual entry).
 */
import { get, set } from './storage';

export interface Lead {
  id: string;
  buyerName: string;
  itemId: string;
  itemTitle: string;
  offer: number;
  status: 'new' | 'contacted' | 'won' | 'lost';
  notes: string;
  createdAt: number;
}

export async function addLead(lead: Omit<Lead, 'id' | 'createdAt'>): Promise<Lead> {
  const leads = await get<Lead[]>('mlf_leads', []);
  const full: Lead = { ...lead, id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, createdAt: Date.now() };
  leads.push(full);
  await set('mlf_leads', leads);
  return full;
}

export async function listLeads(): Promise<Lead[]> {
  return get<Lead[]>('mlf_leads', []);
}

export async function updateLead(id: string, patch: Partial<Lead>): Promise<void> {
  const leads = await get<Lead[]>('mlf_leads', []);
  const idx = leads.findIndex((l) => l.id === id);
  if (idx >= 0) Object.assign(leads[idx], patch);
  await set('mlf_leads', leads);
}
