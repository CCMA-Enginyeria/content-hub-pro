import { createContext, useContext, ReactNode } from 'react';
import { useCategories } from '@/hooks/useCategories';

type CategoriesContextType = ReturnType<typeof useCategories>;

const CategoriesContext = createContext<CategoriesContextType | null>(null);

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const value = useCategories();
  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
}

export function useCategoriesContext() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) throw new Error('useCategoriesContext must be used within CategoriesProvider');
  return ctx;
}
