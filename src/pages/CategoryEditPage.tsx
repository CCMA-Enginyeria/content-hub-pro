import { useParams, useNavigate } from 'react-router-dom';
import { useCategoriesContext } from '@/contexts/CategoriesContext';
import { CategoryForm } from '@/components/categories/CategoryForm';
import { Button } from '@/components/ui/button';

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
    <div className="min-h-screen bg-background">
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
  );
}
