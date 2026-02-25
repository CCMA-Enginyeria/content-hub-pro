import { Category } from '@/types/category';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryListProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  allCategories: Category[];
}

export function CategoryList({ categories, selectedId, onSelect, allCategories }: CategoryListProps) {
  const getParentName = (parentId: string | null) =>
    parentId ? allCategories.find((c) => c.id === parentId)?.name ?? '—' : '—';

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-sm">No s'han trobat categories.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-primary/5">
            <th className="px-4 py-2.5 text-left font-semibold text-foreground uppercase text-xs tracking-wider">Nom</th>
            <th className="px-4 py-2.5 text-left font-semibold text-foreground uppercase text-xs tracking-wider hidden md:table-cell">ID textual</th>
            <th className="px-4 py-2.5 text-left font-semibold text-foreground uppercase text-xs tracking-wider hidden lg:table-cell">Pare</th>
            <th className="px-4 py-2.5 text-center font-semibold text-foreground uppercase text-xs tracking-wider">Estat</th>
            <th className="px-4 py-2.5 text-center font-semibold text-foreground uppercase text-xs tracking-wider hidden sm:table-cell">Visible</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat, i) => (
            <tr
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={cn(
                'cursor-pointer border-b transition-colors last:border-0',
                selectedId === cat.id
                  ? 'bg-accent/15'
                  : i % 2 === 0
                    ? 'bg-card'
                    : 'bg-muted/30',
                'hover:bg-accent/10'
              )}
            >
              <td className="px-4 py-3 font-medium">{cat.name}</td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground hidden md:table-cell">{cat.textId}</td>
              <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{getParentName(cat.parentId)}</td>
              <td className="px-4 py-3 text-center">
                <Badge
                  variant={cat.isActive ? 'default' : 'secondary'}
                  className={cn(
                    'text-[11px] font-semibold uppercase',
                    cat.isActive
                      ? 'bg-success hover:bg-success/90'
                      : ''
                  )}
                >
                  {cat.isActive ? 'Activa' : 'Inactiva'}
                </Badge>
              </td>
              <td className="px-4 py-3 text-center hidden sm:table-cell">
                {cat.isVisibleOnPublication ? (
                  <Eye className="h-4 w-4 mx-auto text-success" />
                ) : (
                  <EyeOff className="h-4 w-4 mx-auto text-muted-foreground/50" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
