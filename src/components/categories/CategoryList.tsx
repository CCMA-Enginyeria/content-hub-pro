import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Category } from '@/types/category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PAGE_SIZES = [10, 20, 50, 100];

interface CategoryListProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  allCategories: Category[];
}

export function CategoryList({ categories, selectedId, onSelect, allCategories }: CategoryListProps) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
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

  const totalPages = Math.ceil(categories.length / pageSize);
  const safePage = Math.min(page, totalPages - 1);
  const paged = categories.slice(safePage * pageSize, (safePage + 1) * pageSize);

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setPage(0);
  };

  // Build page number buttons
  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      pages.push(0);
      if (safePage > 2) pages.push('...');
      const start = Math.max(1, safePage - 1);
      const end = Math.min(totalPages - 2, safePage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (safePage < totalPages - 3) pages.push('...');
      pages.push(totalPages - 1);
    }
    return pages;
  };

  return (
    <div className="space-y-0">
      {/* Table */}
      <div className="overflow-hidden border-b">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3 text-left font-semibold text-foreground uppercase text-xs tracking-wider">Nom</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground uppercase text-xs tracking-wider w-[100px] hidden md:table-cell">ID</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground uppercase text-xs tracking-wider w-[90px]">Estat</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground uppercase text-xs tracking-wider hidden lg:table-cell">Pare</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground uppercase text-xs tracking-wider hidden xl:table-cell w-[170px]">Actualitzat</th>
              <th className="px-4 py-3 text-right font-semibold text-foreground uppercase text-xs tracking-wider w-[120px]">Accions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((cat) => (
              <tr
                key={cat.id}
                onClick={() => onSelect(cat.id)}
                className="cursor-pointer border-b transition-colors last:border-0 hover:bg-muted/40"
              >
                <td className="px-4 py-3 font-medium text-foreground">{cat.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground hidden md:table-cell">{cat.textId}</td>
                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-[10px] font-bold uppercase tracking-wide border-0 px-2.5 py-0.5',
                      cat.isActive
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {cat.isActive ? 'Activa' : 'Inactiva'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{getParentName(cat.parentId)}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs hidden xl:table-cell">
                  {new Date(cat.updatedAt).toLocaleDateString('ca-ES', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-0.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => navigate(`/categories/${cat.id}`)}
                      title="Veure"
                    >
                      {cat.isVisibleOnPublication ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4 opacity-40" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => navigate(`/categories/${cat.id}/edit`)}
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleteTarget(cat)}
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 py-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={safePage === 0}
            onClick={() => setPage(0)}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={safePage === 0}
            onClick={() => setPage(safePage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {getPageNumbers().map((p, i) =>
            p === '...' ? (
              <span key={`dots-${i}`} className="px-1 text-muted-foreground text-sm">
                …
              </span>
            ) : (
              <Button
                key={p}
                variant={p === safePage ? 'default' : 'ghost'}
                size="icon"
                className={cn(
                  'h-8 w-8 text-sm font-medium',
                  p === safePage && 'bg-primary text-primary-foreground pointer-events-none'
                )}
                onClick={() => setPage(p)}
              >
                {p + 1}
              </Button>
            )
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={safePage >= totalPages - 1}
            onClick={() => setPage(safePage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={safePage >= totalPages - 1}
            onClick={() => setPage(totalPages - 1)}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
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
