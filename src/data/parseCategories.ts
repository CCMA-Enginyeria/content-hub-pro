import { Category } from '@/types/category';
import csvText from './categoriestags.csv?raw';

function parseCSV(raw: string): Category[] {
  const lines = raw.trim().split('\n');
  // Skip header: id;id_textual;nom;activat;visible_publicacio;id_pare
  const categories: Category[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(';');
    if (cols.length < 6) continue;

    const [id, textId, name, activat, visiblePub, idPare] = cols.map((c) => c.trim());
    if (!textId || !name) continue;

    categories.push({
      id: id || `gen-${i}`,
      textId,
      name,
      description: '',
      parentId: idPare || null,
      isActive: activat === '0',
      isVisibleOnPublication: visiblePub === '1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    });
  }

  return categories;
}

export const realCategories = parseCSV(csvText);
