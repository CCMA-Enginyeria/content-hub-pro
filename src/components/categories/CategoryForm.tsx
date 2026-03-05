import { useState, useEffect } from 'react';
import { Category, CategoryFormData } from '@/types/category';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, X } from 'lucide-react';
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
  const [keywords, setKeywords] = useState(category?.keywords ?? '');
  const [comments, setComments] = useState(category?.comments ?? '');
  const [synonyms, setSynonyms] = useState(category?.synonyms ?? '');
  const [type, setType] = useState<'Node' | 'Fulla'>(category?.type ?? 'Fulla');
  const [order, setOrder] = useState(category?.order ?? 1);
  const [weight, setWeight] = useState(category?.weight ?? 0);

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

  const children = category ? allCategories.filter((c) => c.parentId === category.id) : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: CategoryFormData = { name, textId, description, parentId, isActive, isVisibleOnPublication, keywords, comments, synonyms, type, order, weight };
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
      <div className="flex-1 mx-auto w-full max-w-3xl px-6 py-8 space-y-6">
        {/* Nom */}
        <FormRow label="Nom *">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom de la categoria"
            required
            className="border-0 border-b rounded-none bg-transparent px-0 text-base font-medium focus-visible:ring-0 focus-visible:border-primary"
          />
        </FormRow>

        {/* ID de la categoria (read-only when editing) */}
        {isEditing && (
          <FormRow label="ID de la categoria">
            <div className="border-b py-2 text-sm font-mono text-muted-foreground">{category.id}</div>
          </FormRow>
        )}

        {/* UID / textId */}
        <FormRow label="UID *">
          <Input
            value={textId}
            onChange={(e) => setTextId(e.target.value.toUpperCase())}
            placeholder="IDENTIFICADOR_UNIC"
            required
            className="border-0 border-b rounded-none bg-transparent px-0 font-mono text-sm uppercase focus-visible:ring-0 focus-visible:border-primary"
          />
        </FormRow>

        {/* Estat */}
        <FormRow label="Estat">
          <div className="border-b pb-2">
            <Select value={isActive ? 'active' : 'inactive'} onValueChange={(v) => setIsActive(v === 'active')}>
              <SelectTrigger className="border-0 bg-transparent px-0 shadow-none focus:ring-0 h-9 w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Activat</SelectItem>
                <SelectItem value="inactive">Desactivat</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </FormRow>

        {/* No visible a publicació */}
        <FormRow label="No visible a publicació">
          <div className="border-b py-2 flex items-center">
            <Checkbox
              checked={!isVisibleOnPublication}
              onCheckedChange={(checked) => setIsVisibleOnPublication(!checked)}
            />
          </div>
        </FormRow>

        {/* Tipus */}
        <FormRow label="Tipus">
          <div className="border-b pb-2">
            <Select value={type} onValueChange={(v) => setType(v as 'Node' | 'Fulla')}>
              <SelectTrigger className="border-0 bg-transparent px-0 shadow-none focus:ring-0 h-9 w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Node">Node</SelectItem>
                <SelectItem value="Fulla">Fulla</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </FormRow>

        {/* Ordre */}
        <FormRow label="Ordre">
          <div className="border-b pb-2">
            <Select value={String(order)} onValueChange={(v) => setOrder(Number(v))}>
              <SelectTrigger className="border-0 bg-transparent px-0 shadow-none focus:ring-0 h-9 w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Alfabètic</SelectItem>
                <SelectItem value="2">Manual</SelectItem>
                <SelectItem value="3">Per pes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </FormRow>

        {/* Pes */}
        <FormRow label="Pes">
          <Input
            type="number"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="border-0 border-b rounded-none bg-transparent px-0 text-sm focus-visible:ring-0 focus-visible:border-primary w-32"
          />
        </FormRow>

        {/* Comentaris */}
        <FormRow label="Comentaris">
          <Textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Comentaris..."
            rows={3}
            className="border rounded-md bg-transparent px-3 py-2 resize-y focus-visible:ring-1 focus-visible:ring-primary text-sm"
          />
        </FormRow>

        {/* Sinònims */}
        <FormRow label="Sinònims">
          <Textarea
            value={synonyms}
            onChange={(e) => setSynonyms(e.target.value)}
            placeholder="Sinònims..."
            rows={3}
            className="border rounded-md bg-transparent px-3 py-2 resize-y focus-visible:ring-1 focus-visible:ring-primary text-sm"
          />
        </FormRow>

        {/* Paraules clau */}
        <FormRow label="Paraules clau">
          <Textarea
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Paraules clau..."
            rows={3}
            className="border rounded-md bg-transparent px-3 py-2 resize-y focus-visible:ring-1 focus-visible:ring-primary text-sm"
          />
        </FormRow>

        {/* Descripció */}
        <FormRow label="Descripció">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripció de la categoria..."
            rows={3}
            className="border rounded-md bg-transparent px-3 py-2 resize-y focus-visible:ring-1 focus-visible:ring-primary text-sm"
          />
        </FormRow>

        {/* Categoria pare */}
        <FormRow label="*Pares">
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
        </FormRow>

        {/* Subcategories (read-only when editing) */}
        {isEditing && children.length > 0 && (
          <FormRow label="Subcategories (Fills)">
            <div className="border-b py-2 text-sm text-muted-foreground">
              {children.map((c) => c.name).join(', ')}
            </div>
          </FormRow>
        )}

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

/* ── Helper ── */
function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[180px_1fr] items-start gap-4">
      <Label className="uppercase text-[11px] tracking-wider font-semibold text-muted-foreground pt-2.5 text-right">
        {label}
      </Label>
      <div>{children}</div>
    </div>
  );
}
