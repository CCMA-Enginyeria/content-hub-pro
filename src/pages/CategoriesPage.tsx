import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategoriesContext } from '@/contexts/CategoriesContext';
import { CategoryTree } from '@/components/categories/CategoryTree';
import { CategoryList } from '@/components/categories/CategoryList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, LayoutList, TreePine, Tags } from 'lucide-react';

type View = 'tree' | 'list';

export default function CategoriesPage() {
  const {
    categories,
    filteredCategories,
    rootCategories,
    getChildren,
    searchQuery,
    setSearchQuery,
  } = useCategoriesContext();

  const navigate = useNavigate();
  const [view, setView] = useState<View>('tree');

  const handleSelect = (id: string) => navigate(`/categories/${id}`);

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
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cercar categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex rounded-lg border p-0.5">
            <Button variant={view === 'tree' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('tree')} className="h-8 px-3">
              <TreePine className="mr-1.5 h-3.5 w-3.5" />
              Arbre
            </Button>
            <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('list')} className="h-8 px-3">
              <LayoutList className="mr-1.5 h-3.5 w-3.5" />
              Llista
            </Button>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm">
          {view === 'tree' ? (
            searchQuery ? (
              <CategoryList
                categories={filteredCategories}
                selectedId={null}
                onSelect={handleSelect}
                allCategories={categories}
              />
            ) : (
              <CategoryTree
                rootCategories={rootCategories}
                getChildren={getChildren}
                selectedId={null}
                onSelect={handleSelect}
              />
            )
          ) : (
            <CategoryList
              categories={filteredCategories}
              selectedId={null}
              onSelect={handleSelect}
              allCategories={categories}
            />
          )}
        </div>
      </div>
    </div>
  );
}
