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
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {category.name}
          </h2>
          <p className="mt-1 font-mono text-sm text-muted-foreground">
            {category.textId}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            Editar
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete} className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Eliminar
          </Button>
        </div>
      </div>

      <p className="text-foreground/80 leading-relaxed">{category.description}</p>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border bg-card p-4 space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Estat</span>
          <div>
            <Badge variant={category.isActive ? 'default' : 'secondary'} className={category.isActive ? 'bg-success hover:bg-success/90' : ''}>
              {category.isActive ? 'Activa' : 'Inactiva'}
            </Badge>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Visibilitat</span>
          <div className="flex items-center gap-1.5 text-sm">
            {category.isVisibleOnPublication ? (
              <>
                <Eye className="h-4 w-4 text-success" />
                <span>Visible a publicació</span>
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">No visible</span>
              </>
            )}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Categoria pare</span>
          <p className="text-sm">{parentName ?? '—  (arrel)'}</p>
        </div>
        <div className="rounded-lg border bg-card p-4 space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Dates</span>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Creada: {format(new Date(category.createdAt), "dd MMM yyyy", { locale: ca })}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Modificada: {format(new Date(category.updatedAt), "dd MMM yyyy", { locale: ca })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
