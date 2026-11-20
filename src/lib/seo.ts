/**
 * Listing SEO optimizer: suggest keywords and improvements.
 */
export interface SeoSuggestion {
  type: 'keyword' | 'title' | 'description';
  suggestion: string;
  impact: 'high' | 'medium' | 'low';
}

export function analyzeSeo(title: string, description: string, tags: string[]): SeoSuggestion[] {
  const suggestions: SeoSuggestion[] = [];
  if (title.length < 30) suggestions.push({ type: 'title', suggestion: 'Title is short — add more descriptive keywords', impact: 'high' });
  if (title.length > 75) suggestions.push({ type: 'title', suggestion: 'Title exceeds 75 chars — trim for compliance', impact: 'high' });
  if (description.length < 50) suggestions.push({ type: 'description', suggestion: 'Description is thin — add more detail', impact: 'medium' });
  if (tags.length < 5) suggestions.push({ type: 'keyword', suggestion: 'Add more search tags (aim for 5-10)', impact: 'medium' });
  // Check for common high-value keywords
  const highValue = ['new', 'sealed', 'original', 'authentic', 'rare', 'vintage', 'limited'];
  const titleLower = title.toLowerCase();
  const missing = highValue.filter((k) => titleLower.includes(k) === false);
  if (missing.length > 0 && missing.length < highValue.length) {
    suggestions.push({ type: 'keyword', suggestion: `Consider adding: ${missing.slice(0, 3).join(', ')}`, impact: 'low' });
  }
  return suggestions;
}
