export interface Category {
  id: string;
  textId: string;
  name: string;
  description: string;
  parentId: string | null;
  isActive: boolean;
  isVisibleOnPublication: boolean;
  keywords: string;
  comments: string;
  type: 'Node' | 'Fulla';
  order: number;
  weight: number;
  createdAt: string;
  updatedAt: string;
}

export type CategoryFormData = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;
