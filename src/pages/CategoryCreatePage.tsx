import { useNavigate } from 'react-router-dom';
import { useCategoriesContext } from '@/contexts/CategoriesContext';
import { CategoryForm } from '@/components/categories/CategoryForm';

export default function CategoryCreatePage() {
  const navigate = useNavigate();
  const { categories, createCategory } = useCategoriesContext();

  return (
    <CategoryForm
      allCategories={categories}
      onSave={(data) => {
        createCategory(data);
        navigate('/categories');
      }}
      onCancel={() => navigate('/categories')}
    />
  );
}
