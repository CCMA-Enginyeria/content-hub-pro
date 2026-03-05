import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Search, X } from 'lucide-react';
import { Category } from '@/types/category';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MoveCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceCategory: Category;
  allCategories: Category[];
  onConfirm: (targetId: string, deleteSource: boolean) => void;
}

export function MoveCategoryDialog({
  open,
  onOpenChange,
  sourceCategory,
  allCategories,
  onConfirm,
}: MoveCategoryDialogProps) {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [deleteSource, setDeleteSource] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return allCategories
      .filter((c) => c.id !== sourceCategory.id)
      .filter((c) => !q || c.name.toLowerCase().includes(q) || c.textId.toLowerCase().includes(q));
  }, [allCategories, sourceCategory.id, search]);

  const handleConfirm = () => {
    if (!selectedId) return;
    onConfirm(selectedId, deleteSource);
    handleClose();
  };

  const handleClose = () => {
    setSearch('');
    setSelectedId('');
    setDeleteSource(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mou categoria: {sourceCategory.name}</DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cercar categoria destí..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Category list with radio */}
        <ScrollArea className="h-[280px] border rounded-md">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground py-8">
              No s'han trobat categories.
            </div>
          ) : (
            <RadioGroup value={selectedId} onValueChange={setSelectedId}>
              <div className="divide-y">
                {filtered.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-muted/40 transition-colors"
                  >
                    <RadioGroupItem value={cat.id} id={cat.id} />
                    <div className="min-w-0 flex-1">
                      <span className="text-sm font-medium text-foreground block truncate">{cat.name}</span>
                      <span className="text-xs text-muted-foreground font-mono">{cat.textId}</span>
                    </div>
                  </label>
                ))}
              </div>
            </RadioGroup>
          )}
        </ScrollArea>

        {/* Delete source checkbox */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="delete-source"
            checked={deleteSource}
            onCheckedChange={(checked) => setDeleteSource(checked === true)}
          />
          <label htmlFor="delete-source" className="text-sm cursor-pointer select-none">
            Esborra la categoria d'origen
          </label>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose}>
            Surt
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedId}>
            Mou
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
