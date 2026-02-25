import { ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react';
import { Category } from '@/types/category';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface CategoryTreeItemProps {
  category: Category;
  getChildren: (parentId: string) => Category[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  level?: number;
}

function CategoryTreeItem({ category, getChildren, selectedId, onSelect, level = 0 }: CategoryTreeItemProps) {
  const [expanded, setExpanded] = useState(level === 0);
  const children = getChildren(category.id);
  const hasChildren = children.length > 0;
  const isSelected = selectedId === category.id;

  return (
    <div>
      <button
        onClick={() => onSelect(category.id)}
        className={cn(
          'flex w-full items-center gap-1.5 rounded-md px-2 py-2 text-sm transition-colors text-left',
          isSelected
            ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary'
            : 'text-foreground hover:bg-muted'
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="shrink-0 p-0.5 rounded hover:bg-muted"
          >
            {expanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>
        ) : (
          <span className="w-[18px]" />
        )}
        {expanded && hasChildren ? (
          <FolderOpen className="h-4 w-4 shrink-0 text-accent" />
        ) : (
          <Folder className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
        <span className="truncate">{category.name}</span>
        {!category.isActive && (
          <span className="ml-auto text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium">
            Inactiva
          </span>
        )}
      </button>
      {expanded && hasChildren && (
        <div>
          {children.map((child) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              getChildren={getChildren}
              selectedId={selectedId}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CategoryTreeProps {
  rootCategories: Category[];
  getChildren: (parentId: string) => Category[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function CategoryTree({ rootCategories, getChildren, selectedId, onSelect }: CategoryTreeProps) {
  return (
    <nav className="space-y-0.5 py-1">
      {rootCategories.map((cat) => (
        <CategoryTreeItem
          key={cat.id}
          category={cat}
          getChildren={getChildren}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </nav>
  );
}
