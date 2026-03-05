import { useParams, useNavigate } from 'react-router-dom';
import { useCategoriesContext } from '@/contexts/CategoriesContext';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Pencil, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function CategoryViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories, getParent, getChildren, deleteCategory } = useCategoriesContext();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const category = categories.find((c) => c.id === id) ?? null;
  const parent = category ? getParent(category.parentId) : null;
  const children = category ? getChildren(category.id) : [];

  if (!category) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10 text-center text-muted-foreground">
        <p>Categoria no trobada.</p>
        <Button variant="link" onClick={() => navigate('/categories')} className="mt-2">
          Tornar a la llista
        </Button>
      </div>
    );
  }

  const handleDeleteConfirm = () => {
    deleteCategory(category.id);
    setDeleteDialogOpen(false);
    navigate('/categories');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Top header bar ── */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex items-center justify-between px-6 py-2.5">
          {/* Left: back + breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => navigate('/categories')} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 min-w-0 text-sm">
              <span className="text-muted-foreground shrink-0">Categories /</span>
              <span className="text-muted-foreground shrink-0 font-mono text-xs">{category.id.slice(0, 8)}</span>
              <span className="text-primary font-semibold truncate">{category.name}</span>
            </div>
          </div>

          {/* Center: status badges */}
          <div className="hidden md:flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs font-medium">Estat</span>
              <Badge
                variant="outline"
                className={cn(
                  'text-[10px] font-bold uppercase tracking-wide border-0 px-2.5 py-0.5',
                  category.isActive
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {category.isActive ? 'Activa' : 'Inactiva'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs font-medium">Visible</span>
              <Badge
                variant="outline"
                className={cn(
                  'text-[10px] font-bold uppercase tracking-wide border-0 px-2.5 py-0.5',
                  category.isVisibleOnPublication
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {category.isVisibleOnPublication ? 'Visible' : 'Oculta'}
              </Badge>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button size="sm" className="gap-1.5 font-semibold" onClick={() => navigate(`/categories/${category.id}/edit`)}>
              <Pencil className="h-3.5 w-3.5" />
              Edita
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/categories')} className="text-muted-foreground">
              Surt
            </Button>
          </div>
        </div>
      </header>

      {/* ── Detail body ── */}
      <div className="mx-auto w-full max-w-3xl px-6 py-8 space-y-8">
        {/* Text ID / URL */}
        <div className="space-y-1">
          <Label>Identificador textual</Label>
          <ReadonlyField className="font-mono text-sm uppercase">{category.textId}</ReadonlyField>
          <p className="text-xs text-muted-foreground pt-1">
            La URL friendly serà visible quan aquest ítem estigui en estat de publicació
          </p>
        </div>

        {/* Name */}
        <div className="space-y-1">
          <Label>Nom</Label>
          <ReadonlyField className="text-base font-medium">{category.name}</ReadonlyField>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <Label>Descripció</Label>
          <ReadonlyField>{category.description || <span className="text-muted-foreground italic">Sense descripció</span>}</ReadonlyField>
        </div>

        {/* Parent */}
        <div className="space-y-1">
          <Label>Categoria pare</Label>
          <ReadonlyField>
            {parent ? (
              <button
                onClick={() => navigate(`/categories/${parent.id}`)}
                className="text-primary hover:underline"
              >
                {parent.name}
              </button>
            ) : (
              <span className="text-muted-foreground">— (arrel)</span>
            )}
          </ReadonlyField>
        </div>

        {/* Children */}
        {children.length > 0 && (
          <div className="space-y-1">
            <Label>Subcategories ({children.length})</Label>
            <div className="border-b pb-3 pt-1">
              <div className="flex flex-wrap gap-1.5">
                {children.slice(0, 20).map((child) => (
                  <Badge
                    key={child.id}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80 text-xs"
                    onClick={() => navigate(`/categories/${child.id}`)}
                  >
                    {child.name}
                  </Badge>
                ))}
                {children.length > 20 && (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    +{children.length - 20} més
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile status */}
        <div className="md:hidden space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <span className="text-sm font-medium">Estat</span>
            <Badge
              variant="outline"
              className={cn(
                'text-[10px] font-bold uppercase tracking-wide border-0 px-2.5 py-0.5',
                category.isActive
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {category.isActive ? 'Activa' : 'Inactiva'}
            </Badge>
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <span className="text-sm font-medium">Visibilitat</span>
            <Badge
              variant="outline"
              className={cn(
                'text-[10px] font-bold uppercase tracking-wide border-0 px-2.5 py-0.5',
                category.isVisibleOnPublication
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {category.isVisibleOnPublication ? 'Visible' : 'Oculta'}
            </Badge>
          </div>
        </div>

        {/* Dates */}
        <div className="border-t pt-6 mt-8">
          <div className="grid grid-cols-2 gap-6 text-xs text-muted-foreground">
            <div className="space-y-1">
              <span className="uppercase text-[10px] tracking-wider font-semibold block">Creat</span>
              <span>{new Date(category.createdAt).toLocaleString('ca-ES')}</span>
            </div>
            <div className="space-y-1">
              <span className="uppercase text-[10px] tracking-wider font-semibold block">Actualitzat</span>
              <span>{new Date(category.updatedAt).toLocaleString('ca-ES')}</span>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar categoria</AlertDialogTitle>
            <AlertDialogDescription>
              Estàs segur que vols eliminar <strong>{category.name}</strong>?
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

/* ── Helper components ── */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="uppercase text-[11px] tracking-wider font-semibold text-primary/70 block">
      {children}
    </span>
  );
}

function ReadonlyField({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('border-b py-2 text-sm text-foreground min-h-[2rem]', className)}>
      {children}
    </div>
  );
}
