import { useNavigate } from 'react-router-dom';
import { useCategoriesContext } from '@/contexts/CategoriesContext';
import { CategoryForm } from '@/components/categories/CategoryForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CategoryCreatePage() {
  const navigate = useNavigate();
  const { categories, createCategory } = useCategoriesContext();

  return (
    <div className="mx-auto max-w-3xl px-6 py-6">
      <Button variant="ghost" size="sm" onClick={() => navigate('/categories')} className="mb-4 -ml-2">
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        Tornar a categories
      </Button>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <CategoryForm
          allCategories={categories}
          onSave={(data) => {
            createCategory(data);
            navigate('/categories');
          }}
          onCancel={() => navigate('/categories')}
        />
      </div>
    </div>
  );
}
