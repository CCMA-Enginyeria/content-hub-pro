import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCategoriesContext } from '@/contexts/CategoriesContext';
import { CategoryList } from '@/components/categories/CategoryList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, ArrowLeft, X } from 'lucide-react';

export default function CategoriesPage() {
  const {
    categories,
    filteredCategories,
    searchQuery,
    setSearchQuery,
    getChildren,
  } = useCategoriesContext();

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const parentId = searchParams.get('parent');

  const parentCategory = useMemo(
    () => (parentId ? categories.find((c) => c.id === parentId) ?? null : null),
    [categories, parentId]
  );

  const displayedCategories = useMemo(() => {
    if (parentId) {
      const descendants: typeof categories = [];
      const collect = (pid: string) => {
        const children = getChildren(pid);
        children.forEach((c) => {
          descendants.push(c);
          collect(c.id);
        });
      };
      collect(parentId);
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return descendants.filter(
          (c) => c.name.toLowerCase().includes(q) || c.textId.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
        );
      }
      return descendants;
    }
    return filteredCategories;
  }, [parentId, filteredCategories, categories, getChildren, searchQuery]);

  const handleSelect = (id: string) => navigate(`/categories/${id}`);

  const clearParentFilter = () => {
    setSearchParams({});
  };

  // Build breadcrumb title
  const headerTitle = parentCategory
    ? `Categories / ${parentCategory.name}`
    : 'Categories';

  return (
    <div className="min-h-screen bg-background">
      {/* Header bar */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            {parentCategory && (
              <button
                onClick={clearParentFilter}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div className="flex items-baseline gap-2">
              <h1 className="text-base font-semibold text-foreground">{headerTitle}:</h1>
              <span className="text-base text-primary font-medium">
                {displayedCategories.length} registres
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative max-w-[240px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cercar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <Button
              onClick={() => navigate('/categories/new')}
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-4"
            >
              Crea nou
            </Button>
          </div>
        </div>
      </header>

      {/* List */}
      <div className="px-0">
        <CategoryList
          categories={displayedCategories}
          selectedId={null}
          onSelect={handleSelect}
          allCategories={categories}
        />
      </div>
    </div>
  );
}
