import { Category } from '@/types/category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Eye, EyeOff, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';

interface CategoryDetailProps {
  category: Category;
  parentName: string | null;
  onEdit: () => void;
  onDelete: () => void;
}

export function CategoryDetail({ category, parentName, onEdit, onDelete }: CategoryDetailProps) {
  return (
    <div className="animate-slide-in space-y-6">
      <div className="flex items-start justify-between gap-4 border-b pb-4">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {category.name}
          </h2>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {category.textId}
          </p>
        </div>
        <div className="flex gap-1.5 shrink-0">
          <Button variant="ghost" size="icon" onClick={onEdit} title="Editar">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete} title="Eliminar" className="text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <p className="text-foreground/80 text-sm leading-relaxed">{category.description}</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border bg-muted/30 p-3.5 space-y-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Estat</span>
          <div>
            <Badge variant={category.isActive ? 'default' : 'secondary'} className={category.isActive ? 'bg-success hover:bg-success/90' : ''}>
              {category.isActive ? 'Activa' : 'Inactiva'}
            </Badge>
          </div>
        </div>
        <div className="rounded-lg border bg-muted/30 p-3.5 space-y-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Visibilitat</span>
          <div className="flex items-center gap-1.5 text-sm">
            {category.isVisibleOnPublication ? (
              <>
                <Eye className="h-4 w-4 text-success" />
                <span>Visible</span>
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">No visible</span>
              </>
            )}
          </div>
        </div>
        <div className="rounded-lg border bg-muted/30 p-3.5 space-y-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Categoria pare</span>
          <p className="text-sm">{parentName ?? '— (arrel)'}</p>
        </div>
        <div className="rounded-lg border bg-muted/30 p-3.5 space-y-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Dates</span>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              {format(new Date(category.createdAt), "dd MMM yyyy", { locale: ca })}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              {format(new Date(category.updatedAt), "dd MMM yyyy", { locale: ca })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
