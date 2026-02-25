import { useParams, useNavigate } from 'react-router-dom';
import { useCategoriesContext } from '@/contexts/CategoriesContext';
import { CategoryDetail } from '@/components/categories/CategoryDetail';
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
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function CategoryViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories, getParent, deleteCategory } = useCategoriesContext();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const category = categories.find((c) => c.id === id) ?? null;
  const parentName = category ? getParent(category.parentId)?.name ?? null : null;

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
    <div className="mx-auto max-w-3xl px-6 py-6">
      <Button variant="ghost" size="sm" onClick={() => navigate('/categories')} className="mb-4 -ml-2">
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        Tornar a categories
      </Button>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <CategoryDetail
          category={category}
          parentName={parentName}
          onEdit={() => navigate(`/categories/${category.id}/edit`)}
          onDelete={() => setDeleteDialogOpen(true)}
        />
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
