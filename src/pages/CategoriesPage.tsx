import { useMemo, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCategoriesContext } from '@/contexts/CategoriesContext';
import { CategoryList } from '@/components/categories/CategoryList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, ArrowLeft, X, ChevronDown } from 'lucide-react';

type StatusFilter = 'all' | 'active' | 'inactive';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Totes' },
  { value: 'active', label: 'Actives' },
  { value: 'inactive', label: 'Inactives' },
] as const;

export default function CategoriesPage() {
  const {
    categories,
    filteredCategories,
    searchQuery,
    setSearchQuery,
    getChildren,
  } = useCategoriesContext();

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const parentId = searchParams.get('parent');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [pageSize, setPageSize] = useState(20);

  // Popover filter state
  const [statusPopoverOpen, setStatusPopoverOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<Set<StatusFilter>>(new Set(['all']));

  const parentCategory = useMemo(
    () => (parentId ? categories.find((c) => c.id === parentId) ?? null : null),
    [categories, parentId]
  );

  const displayedCategories = useMemo(() => {
    let result: typeof categories;
    if (parentId) {
      const descendants: typeof categories = [];
      const collect = (pid: string) => {
        const children = getChildren(pid);
        children.forEach((c) => {
          descendants.push(c);
          collect(c.id);
        });
      };
      collect(parentId);
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        result = descendants.filter(
          (c) => c.name.toLowerCase().includes(q) || c.textId.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
        );
      } else {
        result = descendants;
      }
    } else {
      result = filteredCategories;
    }
    if (statusFilter === 'active') return result.filter((c) => c.isActive);
    if (statusFilter === 'inactive') return result.filter((c) => !c.isActive);
    return result;
  }, [parentId, filteredCategories, categories, getChildren, searchQuery, statusFilter]);

  const handleSelect = (id: string) => navigate(`/categories/${id}`);

  const clearParentFilter = () => {
    setSearchParams({});
  };

  const handleStatusToggle = (value: StatusFilter) => {
    const next = new Set(pendingStatus);
    if (value === 'all') {
      next.clear();
      next.add('all');
    } else {
      next.delete('all');
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      if (next.size === 0) {
        next.add('all');
      }
    }
    setPendingStatus(next);
  };

  const applyStatusFilter = () => {
    if (pendingStatus.has('all') || (pendingStatus.has('active') && pendingStatus.has('inactive'))) {
      setStatusFilter('all');
    } else if (pendingStatus.has('active')) {
      setStatusFilter('active');
    } else {
      setStatusFilter('inactive');
    }
    setStatusPopoverOpen(false);
  };

  const statusLabel = statusFilter === 'all' ? 'Tots' : statusFilter === 'active' ? 'Actives' : 'Inactives';

  const headerTitle = parentCategory
    ? `Categories / ${parentCategory.name}`
    : 'Categories';

  return (
    <div className="min-h-screen bg-background">
      {/* Filter bar */}
      <div className="border-b bg-muted/30">
        <div className="flex items-center gap-4 px-6 py-2 text-sm">
          <span className="text-muted-foreground text-xs font-medium">Cercant a:</span>

          {/* Status filter popover */}
          <Popover open={statusPopoverOpen} onOpenChange={setStatusPopoverOpen}>
            <PopoverTrigger asChild>
              <button className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:text-primary transition-colors">
                Estat: <span className="font-bold">{statusLabel}</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-48 p-0">
              <div className="p-3 space-y-2.5">
                {STATUS_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-2.5 cursor-pointer text-sm"
                  >
                    <Checkbox
                      checked={pendingStatus.has(opt.value)}
                      onCheckedChange={() => handleStatusToggle(opt.value)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
              <div className="border-t px-3 py-2">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={applyStatusFilter}
                >
                  Aplica
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Search */}
          <div className="relative max-w-[220px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="cercar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs border-0 border-b border-border rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Subheader */}
      <div className="border-b bg-background">
        <div className="flex items-center justify-between px-6 py-2.5">
          <div className="flex items-center gap-3">
            {parentCategory && (
              <button
                onClick={clearParentFilter}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div className="flex items-baseline gap-2">
              <h1 className="text-sm font-medium text-foreground">{headerTitle}:</h1>
              <span className="text-sm text-primary font-bold">
                {displayedCategories.length} registres
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Continguts per plana:</span>
              <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
                <SelectTrigger className="h-7 w-16 text-xs border rounded px-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 50, 100].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => navigate('/categories/new')}
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-5 rounded-full"
            >
              Crea nova
            </Button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="px-0">
        <CategoryList
          categories={displayedCategories}
          selectedId={null}
          onSelect={handleSelect}
          allCategories={categories}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
}
