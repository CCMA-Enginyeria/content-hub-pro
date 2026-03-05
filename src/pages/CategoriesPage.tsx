import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCategoriesContext } from '@/contexts/CategoriesContext';
import { CategoryList } from '@/components/categories/CategoryList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Tags, X } from 'lucide-react';

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
      // Collect all descendants recursively
      const descendants: typeof categories = [];
      const collect = (pid: string) => {
        const children = getChildren(pid);
        children.forEach((c) => {
          descendants.push(c);
          collect(c.id);
        });
      };
      collect(parentId);
      // Apply search filter on top if active
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

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-primary text-primary-foreground shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Tags className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Gestió de categories</h1>
              <p className="text-xs text-primary-foreground/70">{categories.length} categories</p>
            </div>
          </div>
          <Button onClick={() => navigate('/categories/new')} size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
            <Plus className="mr-1.5 h-4 w-4" />
            Crea nou
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="mb-5 flex items-center gap-3">
          {parentCategory && (
            <div className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
              <span>Subcategories de: {parentCategory.name}</span>
              <button onClick={clearParentFilter} className="ml-1 rounded-full p-0.5 hover:bg-primary/20">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cercar categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <CategoryList
            categories={displayedCategories}
            selectedId={null}
            onSelect={handleSelect}
            allCategories={categories}
          />
        </div>
      </div>
    </div>
  );
}
