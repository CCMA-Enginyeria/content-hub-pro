import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Category } from '@/types/category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Pencil, Trash2, Search } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useCategoriesContext } from '@/contexts/CategoriesContext';

const PAGE_SIZE = 20;

interface CategoryListProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  allCategories: Category[];
}

export function CategoryList({ categories, selectedId, onSelect, allCategories }: CategoryListProps) {
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const { deleteCategory } = useCategoriesContext();
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const getParentName = (parentId: string | null) =>
    parentId ? allCategories.find((c) => c.id === parentId)?.name ?? '—' : '—';

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Search className="mb-3 h-8 w-8 opacity-30" />
        <p className="text-sm">No s'han trobat categories.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(categories.length / PAGE_SIZE);
  const safePage = Math.min(page, totalPages - 1);
  const paged = categories.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

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
              <th className="px-4 py-2.5 text-right font-semibold text-foreground uppercase text-xs tracking-wider">Accions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((cat, i) => (
              <tr
                key={cat.id}
                onClick={() => onSelect(cat.id)}
                className={cn(
                  'cursor-pointer border-b transition-colors last:border-0',
                  i % 2 === 0 ? 'bg-card' : 'bg-muted/30',
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
                <td className="px-4 py-3 text-center hidden sm:table-cell" onClick={(e) => e.stopPropagation()}>
                  <Checkbox checked={cat.isVisibleOnPublication} disabled className="mx-auto" />
                </td>
                <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigate(`/categories/${cat.id}/edit`)} title="Editar">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => setDeleteTarget(cat)} title="Eliminar">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {safePage * PAGE_SIZE + 1}–{Math.min((safePage + 1) * PAGE_SIZE, categories.length)} de {categories.length}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={safePage === 0} onClick={() => setPage(safePage - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2 tabular-nums">{safePage + 1} / {totalPages}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={safePage >= totalPages - 1} onClick={() => setPage(safePage + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar categoria</AlertDialogTitle>
            <AlertDialogDescription>
              Estàs segur que vols eliminar <strong>{deleteTarget?.name}</strong>?
              Això també eliminarà totes les subcategories. Aquesta acció no es pot desfer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel·lar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
