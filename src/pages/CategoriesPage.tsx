import { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { CategoryTree } from '@/components/categories/CategoryTree';
import { CategoryList } from '@/components/categories/CategoryList';
import { CategoryDetail } from '@/components/categories/CategoryDetail';
import { CategoryForm } from '@/components/categories/CategoryForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Search, Plus, LayoutList, TreePine, Tags } from 'lucide-react';

type View = 'tree' | 'list';
type Panel = 'detail' | 'create' | 'edit' | null;

export default function CategoriesPage() {
  const {
    categories,
    filteredCategories,
    rootCategories,
    getChildren,
    selectedCategory,
    selectedId,
    setSelectedId,
    getParent,
    searchQuery,
    setSearchQuery,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  const [view, setView] = useState<View>('tree');
  const [panel, setPanel] = useState<Panel>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setPanel('detail');
  };

  const handleCreate = () => {
    setSelectedId(null);
    setPanel('create');
  };

  const handleEdit = () => setPanel('edit');

  const handleDeleteConfirm = () => {
    if (selectedId) {
      deleteCategory(selectedId);
      setPanel(null);
    }
    setDeleteDialogOpen(false);
  };

  const parentName = selectedCategory ? getParent(selectedCategory.parentId)?.name ?? null : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Tags className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Gestió de categories</h1>
              <p className="text-xs text-muted-foreground">{categories.length} categories</p>
            </div>
          </div>
          <Button onClick={handleCreate} size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            Nova categoria
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* Toolbar */}
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
            <Button
              variant={view === 'tree' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setView('tree')}
              className="h-8 px-3"
            >
              <TreePine className="mr-1.5 h-3.5 w-3.5" />
              Arbre
            </Button>
            <Button
              variant={view === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setView('list')}
              className="h-8 px-3"
            >
              <LayoutList className="mr-1.5 h-3.5 w-3.5" />
              Llista
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
          {/* Left: Tree or List */}
          <div className="rounded-xl border bg-card p-4">
            {view === 'tree' ? (
              searchQuery ? (
                <CategoryList
                  categories={filteredCategories}
                  selectedId={selectedId}
                  onSelect={handleSelect}
                  allCategories={categories}
                />
              ) : (
                <CategoryTree
                  rootCategories={rootCategories}
                  getChildren={getChildren}
                  selectedId={selectedId}
                  onSelect={handleSelect}
                />
              )
            ) : (
              <CategoryList
                categories={filteredCategories}
                selectedId={selectedId}
                onSelect={handleSelect}
                allCategories={categories}
              />
            )}
          </div>

          {/* Right: Detail / Form */}
          <div className="rounded-xl border bg-card p-5">
            {panel === 'detail' && selectedCategory ? (
              <CategoryDetail
                category={selectedCategory}
                parentName={parentName}
                onEdit={handleEdit}
                onDelete={() => setDeleteDialogOpen(true)}
              />
            ) : panel === 'create' ? (
              <CategoryForm
                allCategories={categories}
                onSave={(data) => {
                  createCategory(data);
                  setPanel('detail');
                }}
                onCancel={() => setPanel(null)}
              />
            ) : panel === 'edit' && selectedCategory ? (
              <CategoryForm
                category={selectedCategory}
                allCategories={categories}
                onSave={() => {}}
                onUpdate={(id, data) => {
                  updateCategory(id, data);
                  setPanel('detail');
                }}
                onCancel={() => setPanel('detail')}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                <Tags className="mb-3 h-10 w-10 opacity-30" />
                <p className="text-sm">Selecciona una categoria per veure els detalls</p>
                <p className="mt-1 text-xs">o crea'n una de nova</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar categoria</AlertDialogTitle>
            <AlertDialogDescription>
              Estàs segur que vols eliminar <strong>{selectedCategory?.name}</strong>?
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
