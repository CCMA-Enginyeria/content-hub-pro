import { ChevronRight, ChevronDown, Folder, FolderOpen, Eye, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Category } from '@/types/category';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
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

interface CategoryTreeItemProps {
  category: Category;
  getChildren: (parentId: string) => Category[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (cat: Category) => void;
  level?: number;
}

function CategoryTreeItem({ category, getChildren, selectedId, onSelect, onDelete, level = 0 }: CategoryTreeItemProps) {
  const [expanded, setExpanded] = useState(level === 0);
  const navigate = useNavigate();
  const children = getChildren(category.id);
  const hasChildren = children.length > 0;
  const isSelected = selectedId === category.id;

  return (
    <div>
      <div
        className={cn(
          'group flex w-full items-center gap-1.5 rounded-md px-2 py-2 text-sm transition-colors',
          isSelected
            ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary'
            : 'text-foreground hover:bg-muted'
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="shrink-0 p-0.5 rounded hover:bg-muted"
          >
            {expanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>
        ) : (
          <span className="w-[18px]" />
        )}
        {expanded && hasChildren ? (
          <FolderOpen className="h-4 w-4 shrink-0 text-accent" />
        ) : (
          <Folder className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
        <span className="truncate flex-1">{category.name}</span>
        {!category.isActive && (
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium">
            Inactiva
          </span>
        )}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onSelect(category.id)} title="Veure">
            <Eye className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => navigate(`/categories/${category.id}/edit`)} title="Editar">
            <Pencil className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => onDelete(category)} title="Eliminar">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      {expanded && hasChildren && (
        <div>
          {children.map((child) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              getChildren={getChildren}
              selectedId={selectedId}
              onSelect={onSelect}
              onDelete={onDelete}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CategoryTreeProps {
  rootCategories: Category[];
  getChildren: (parentId: string) => Category[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function CategoryTree({ rootCategories, getChildren, selectedId, onSelect }: CategoryTreeProps) {
  const { deleteCategory } = useCategoriesContext();
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <nav className="space-y-0.5 py-1">
        {rootCategories.map((cat) => (
          <CategoryTreeItem
            key={cat.id}
            category={cat}
            getChildren={getChildren}
            selectedId={selectedId}
            onSelect={onSelect}
            onDelete={setDeleteTarget}
          />
        ))}
      </nav>

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
    </>
  );
}
