import { useState, useCallback, useMemo } from 'react';
import { Category, CategoryFormData } from '@/types/category';
import { realCategories } from '@/data/parseCategories';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(realCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.textId.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }, [categories, searchQuery]);

  const rootCategories = useMemo(() => {
    const idSet = new Set(categories.map((c) => c.id));
    return categories.filter((c) => c.parentId === null || !idSet.has(c.parentId!));
  }, [categories]);

  const getChildren = useCallback(
    (parentId: string) => categories.filter((c) => c.parentId === parentId),
    [categories]
  );

  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === selectedId) ?? null,
    [categories, selectedId]
  );

  const getParent = useCallback(
    (parentId: string | null) =>
      parentId ? categories.find((c) => c.id === parentId) ?? null : null,
    [categories]
  );

  const createCategory = useCallback((data: CategoryFormData) => {
    const now = new Date().toISOString();
    const newCat: Category = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    setCategories((prev) => [...prev, newCat]);
    setSelectedId(newCat.id);
  }, []);

  const updateCategory = useCallback((id: string, data: Partial<CategoryFormData>) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c
      )
    );
  }, []);

  const deleteCategory = useCallback(
    (id: string) => {
      // Also delete children
      const toDelete = new Set<string>();
      const collect = (parentId: string) => {
        toDelete.add(parentId);
        categories
          .filter((c) => c.parentId === parentId)
          .forEach((c) => collect(c.id));
      };
      collect(id);
      setCategories((prev) => prev.filter((c) => !toDelete.has(c.id)));
      if (selectedId && toDelete.has(selectedId)) setSelectedId(null);
    },
    [categories, selectedId]
  );

  return {
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
  };
}
