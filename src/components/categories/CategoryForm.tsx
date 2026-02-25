import { useState, useEffect } from 'react';
import { Category, CategoryFormData } from '@/types/category';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface CategoryFormProps {
  category?: Category | null;
  allCategories: Category[];
  onSave: (data: CategoryFormData) => void;
  onUpdate?: (id: string, data: Partial<CategoryFormData>) => void;
  onCancel: () => void;
}

export function CategoryForm({ category, allCategories, onSave, onUpdate, onCancel }: CategoryFormProps) {
  const isEditing = !!category;

  const [name, setName] = useState(category?.name ?? '');
  const [textId, setTextId] = useState(category?.textId ?? '');
  const [description, setDescription] = useState(category?.description ?? '');
  const [parentId, setParentId] = useState<string | null>(category?.parentId ?? null);
  const [isActive, setIsActive] = useState(category?.isActive ?? true);
  const [isVisibleOnPublication, setIsVisibleOnPublication] = useState(category?.isVisibleOnPublication ?? true);

  useEffect(() => {
    if (!isEditing && name) {
      setTextId(
        name
          .toUpperCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^A-Z0-9]+/g, '_')
          .replace(/^_|_$/g, '')
      );
    }
  }, [name, isEditing]);

  const getDescendantIds = (id: string): string[] => {
    const children = allCategories.filter((c) => c.parentId === id);
    return [id, ...children.flatMap((c) => getDescendantIds(c.id))];
  };
  const excludedIds = category ? getDescendantIds(category.id) : [];
  const parentOptions = allCategories.filter((c) => !excludedIds.includes(c.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: CategoryFormData = { name, textId, description, parentId, isActive, isVisibleOnPublication };
    if (isEditing && onUpdate) {
      onUpdate(category.id, data);
    } else {
      onSave(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-slide-in space-y-5">
      <div className="flex items-center justify-between border-b pb-3">
        <h2 className="text-lg font-semibold tracking-tight text-foreground uppercase">
          {isEditing ? 'Editar categoria' : 'Nova categoria'}
        </h2>
        <Button type="button" variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="uppercase text-xs tracking-wider font-semibold">Nom *</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom de la categoria" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="textId" className="uppercase text-xs tracking-wider font-semibold">Identificador textual *</Label>
          <Input id="textId" value={textId} onChange={(e) => setTextId(e.target.value.toUpperCase())} placeholder="IDENTIFICADOR-UNIC" className="font-mono text-sm uppercase" required />
          <p className="text-xs text-muted-foreground">Identificador únic per a ús intern i URLs.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="uppercase text-xs tracking-wider font-semibold">Descripció</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripció de la categoria..." rows={3} />
        </div>

        <div className="space-y-2">
          <Label className="uppercase text-xs tracking-wider font-semibold">Categoria pare</Label>
          <Select value={parentId ?? '__none__'} onValueChange={(v) => setParentId(v === '__none__' ? null : v)}>
            <SelectTrigger>
              <SelectValue placeholder="Cap (arrel)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Cap (arrel)</SelectItem>
              {parentOptions.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
          <div>
            <Label htmlFor="isActive" className="text-sm font-medium">Activa</Label>
            <p className="text-xs text-muted-foreground">La categoria es pot fer servir per etiquetar continguts.</p>
          </div>
          <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
        </div>

        <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
          <div>
            <Label htmlFor="isVisible" className="text-sm font-medium">Visible a publicació</Label>
            <p className="text-xs text-muted-foreground">La categoria apareix al web públic.</p>
          </div>
          <Switch id="isVisible" checked={isVisibleOnPublication} onCheckedChange={setIsVisibleOnPublication} />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
          {isEditing ? 'Desa canvis' : 'Crear categoria'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel·lar
        </Button>
      </div>
    </form>
  );
}
