export interface Category {
  id: string;
  textId: string;
  name: string;
  description: string;
  parentId: string | null;
  isActive: boolean;
  isVisibleOnPublication: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CategoryFormData = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;
