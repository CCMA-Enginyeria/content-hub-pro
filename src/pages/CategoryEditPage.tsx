import { useParams, useNavigate } from 'react-router-dom';
import { useCategoriesContext } from '@/contexts/CategoriesContext';
import { CategoryForm } from '@/components/categories/CategoryForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CategoryEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories, updateCategory } = useCategoriesContext();

  const category = id ? categories.find((c) => c.id === id) ?? null : null;

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

  return (
    <div className="mx-auto max-w-3xl px-6 py-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(`/categories/${id}`)} className="mb-4 -ml-2">
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        Tornar
      </Button>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <CategoryForm
          category={category}
          allCategories={categories}
          onSave={() => {}}
          onUpdate={(catId, data) => {
            updateCategory(catId, data);
            navigate(`/categories/${catId}`);
          }}
          onCancel={() => navigate(`/categories/${id}`)}
        />
      </div>
    </div>
  );
}
