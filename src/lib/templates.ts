/**
 * Quick-start profile templates for resellers.
 */
import { DEFAULT_PROFILE, type Profile } from './profile';

export interface Template {
  id: string;
  name: string;
  description: string;
  profile: Profile;
}

export const TEMPLATES: Template[] = [
  { id: 'general', name: 'General Reseller', description: 'Friendly, medium responses for general items', profile: { ...DEFAULT_PROFILE, businessName: 'My Resale Shop', tone: 'friendly', greeting: 'Hi! Thanks for your interest in this item.', responseLength: 'medium', policies: 'No returns on used items. Cash or PayPal accepted.' } },
  { id: 'electronics', name: 'Electronics Seller', description: 'Professional tone for electronics', profile: { ...DEFAULT_PROFILE, businessName: 'Tech Resale', tone: 'professional', greeting: 'Hello! Thank you for your inquiry about this device.', responseLength: 'long', policies: 'All electronics tested and working. 7-day return policy. Original packaging included when available.' } },
  { id: 'furniture', name: 'Furniture Flipper', description: 'Casual tone for furniture', profile: { ...DEFAULT_PROFILE, businessName: 'Furniture Finds', tone: 'casual', greeting: 'Hey! Great choice — this piece is in excellent condition.', responseLength: 'medium', policies: 'Buyer arranges pickup. No delivery. Cash only.' } },
  { id: 'clothing', name: 'Clothing Reseller', description: 'Friendly tone for apparel', profile: { ...DEFAULT_PROFILE, businessName: 'Style Resale', tone: 'friendly', greeting: 'Hi there! Thanks for checking out this item.', responseLength: 'short', policies: 'No returns unless item not as described. Shipping via USPS.' } },
  { id: 'auto', name: 'Auto Parts', description: 'Professional tone for auto parts', profile: { ...DEFAULT_PROFILE, businessName: 'Auto Parts Pro', tone: 'professional', greeting: 'Thank you for your interest in this part.', responseLength: 'long', policies: 'Parts sold as-is. Buyer verifies fitment. No warranty on used parts.' } },
  { id: 'collectibles', name: 'Collectibles Dealer', description: 'Professional tone for collectibles', profile: { ...DEFAULT_PROFILE, businessName: 'Collectibles Corner', tone: 'professional', greeting: 'Hello! Thank you for your interest in this collectible.', responseLength: 'long', policies: 'Items as described. Returns accepted within 14 days if not as described. Shipping insured.' } },
  { id: 'books', name: 'Book Seller', description: 'Casual tone for books', profile: { ...DEFAULT_PROFILE, businessName: 'Book Nook', tone: 'casual', greeting: 'Hi! Thanks for looking at this book.', responseLength: 'short', policies: 'Books as described. Media mail shipping. No returns on reading copies.' } },
  { id: 'toys', name: 'Toy Reseller', description: 'Friendly tone for toys', profile: { ...DEFAULT_PROFILE, businessName: 'Toy Box Resale', tone: 'friendly', greeting: 'Hi! Great pick — this toy is in great shape.', responseLength: 'medium', policies: 'Toys cleaned and sanitized. No returns on opened items.' } },
];

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
