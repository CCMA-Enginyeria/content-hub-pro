import { useState } from 'react';
import { Category } from '@/types/category';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const PAGE_SIZE = 20;

interface CategoryListProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  allCategories: Category[];
}

export function CategoryList({ categories, selectedId, onSelect, allCategories }: CategoryListProps) {
  const [page, setPage] = useState(0);

  const getParentName = (parentId: string | null) =>
    parentId ? allCategories.find((c) => c.id === parentId)?.name ?? '—' : '—';

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-sm">No s'han trobat categories.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(categories.length / PAGE_SIZE);
  const safeePage = Math.min(page, totalPages - 1);
  const paged = categories.slice(safeePage * PAGE_SIZE, (safeePage + 1) * PAGE_SIZE);

  return (
    <div className="space-y-3">
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
            {paged.map((cat, i) => (
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
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground hidden md:table-cell uppercase">{cat.textId}</td>
                <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{getParentName(cat.parentId)}</td>
                <td className="px-4 py-3 text-center">
                  <Badge
                    variant={cat.isActive ? 'default' : 'secondary'}
                    className={cn(
                      'text-[11px] font-semibold uppercase',
                      cat.isActive ? 'bg-success hover:bg-success/90' : ''
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {safeePage * PAGE_SIZE + 1}–{Math.min((safeePage + 1) * PAGE_SIZE, categories.length)} de {categories.length}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={safeePage === 0}
              onClick={() => setPage(safeePage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2 tabular-nums">
              {safeePage + 1} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={safeePage >= totalPages - 1}
              onClick={() => setPage(safeePage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
