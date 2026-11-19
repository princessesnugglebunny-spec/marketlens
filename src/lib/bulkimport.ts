/**
 * Bulk listing import from CSV.
 */
export interface BulkRow {
  title: string;
  price: number;
  notes: string;
}

export function parseCsv(text: string): BulkRow[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const header = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const titleIdx = header.indexOf('title');
  const priceIdx = header.indexOf('price');
  const notesIdx = header.indexOf('notes');
  const rows: BulkRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    rows.push({
      title: titleIdx >= 0 ? cols[titleIdx]?.trim() ?? '' : '',
      price: priceIdx >= 0 ? Number(cols[priceIdx]) || 0 : 0,
      notes: notesIdx >= 0 ? cols[notesIdx]?.trim() ?? '' : '',
    });
  }
  return rows;
}
