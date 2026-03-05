import { useState, useEffect } from 'react';
import { Category, CategoryFormData } from '@/types/category';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Eye, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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

  const parentName = parentId
    ? allCategories.find((c) => c.id === parentId)?.name ?? null
    : null;

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
    <form onSubmit={handleSubmit} className="flex flex-col min-h-screen">
      {/* ── Top header bar ── */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex items-center justify-between px-6 py-2.5">
          {/* Left: back + breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <button type="button" onClick={onCancel} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 min-w-0 text-sm">
              <span className="text-muted-foreground shrink-0">Categories /</span>
              {isEditing && (
                <span className="text-muted-foreground shrink-0 font-mono text-xs">{category.id.slice(0, 8)}</span>
              )}
              <span className="text-primary font-semibold truncate">
                {name || (isEditing ? category.name : 'Nova categoria')}
              </span>
            </div>
          </div>

          {/* Center: status controls inline */}
          <div className="hidden md:flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs font-medium">Estat</span>
              <Badge
                variant="outline"
                className={cn(
                  'text-[10px] font-bold uppercase tracking-wide border-0 px-2.5 py-0.5 cursor-pointer',
                  isActive
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                    : 'bg-muted text-muted-foreground'
                )}
                onClick={() => setIsActive(!isActive)}
              >
                {isActive ? 'Activa' : 'Inactiva'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs font-medium">Visible</span>
              <Badge
                variant="outline"
                className={cn(
                  'text-[10px] font-bold uppercase tracking-wide border-0 px-2.5 py-0.5 cursor-pointer',
                  isVisibleOnPublication
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                    : 'bg-muted text-muted-foreground'
                )}
                onClick={() => setIsVisibleOnPublication(!isVisibleOnPublication)}
              >
                {isVisibleOnPublication ? 'Visible' : 'Oculta'}
              </Badge>
            </div>
          </div>

          {/* Right: action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Button type="submit" size="sm" className="gap-1.5 font-semibold">
              <Save className="h-3.5 w-3.5" />
              Desa
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="text-muted-foreground">
              Surt
              <X className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* ── Form body ── */}
      <div className="flex-1 mx-auto w-full max-w-3xl px-6 py-8 space-y-8">
        {/* Name */}
        <div className="space-y-1">
          <Label htmlFor="name" className="uppercase text-[11px] tracking-wider font-semibold text-muted-foreground">
            Nom *
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom de la categoria"
            required
            className="border-0 border-b rounded-none bg-transparent px-0 text-base font-medium focus-visible:ring-0 focus-visible:border-primary"
          />
        </div>

        {/* Text ID */}
        <div className="space-y-1">
          <Label htmlFor="textId" className="uppercase text-[11px] tracking-wider font-semibold text-muted-foreground">
            Identificador textual *
          </Label>
          <Input
            id="textId"
            value={textId}
            onChange={(e) => setTextId(e.target.value.toUpperCase())}
            placeholder="IDENTIFICADOR_UNIC"
            required
            className="border-0 border-b rounded-none bg-transparent px-0 font-mono text-sm uppercase focus-visible:ring-0 focus-visible:border-primary"
          />
          <p className="text-xs text-muted-foreground pt-1">
            La URL friendly serà visible quan aquest ítem estigui en estat de publicació
          </p>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <Label htmlFor="description" className="uppercase text-[11px] tracking-wider font-semibold text-muted-foreground">
            Descripció
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripció de la categoria..."
            rows={3}
            className="border-0 border-b rounded-none bg-transparent px-0 resize-none focus-visible:ring-0 focus-visible:border-primary"
          />
        </div>

        {/* Parent category */}
        <div className="space-y-1">
          <Label className="uppercase text-[11px] tracking-wider font-semibold text-muted-foreground">
            Categoria pare
          </Label>
          <div className="border-b pb-2">
            <Select value={parentId ?? '__none__'} onValueChange={(v) => setParentId(v === '__none__' ? null : v)}>
              <SelectTrigger className="border-0 bg-transparent px-0 shadow-none focus:ring-0 h-9">
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
        </div>

        {/* Mobile toggles (visible on small screens) */}
        <div className="md:hidden space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <Label htmlFor="isActive-mobile" className="text-sm font-medium">Activa</Label>
              <p className="text-xs text-muted-foreground">La categoria es pot fer servir per etiquetar continguts.</p>
            </div>
            <Switch id="isActive-mobile" checked={isActive} onCheckedChange={setIsActive} />
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <Label htmlFor="isVisible-mobile" className="text-sm font-medium">Visible a publicació</Label>
              <p className="text-xs text-muted-foreground">La categoria apareix al web públic.</p>
            </div>
            <Switch id="isVisible-mobile" checked={isVisibleOnPublication} onCheckedChange={setIsVisibleOnPublication} />
          </div>
        </div>

        {/* Dates (read-only info when editing) */}
        {isEditing && (
          <div className="border-t pt-6 mt-8">
            <div className="grid grid-cols-2 gap-6 text-xs text-muted-foreground">
              <div className="space-y-1">
                <span className="uppercase text-[10px] tracking-wider font-semibold block">Creat</span>
                <span>{new Date(category.createdAt).toLocaleString('ca-ES')}</span>
              </div>
              <div className="space-y-1">
                <span className="uppercase text-[10px] tracking-wider font-semibold block">Actualitzat</span>
                <span>{new Date(category.updatedAt).toLocaleString('ca-ES')}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
