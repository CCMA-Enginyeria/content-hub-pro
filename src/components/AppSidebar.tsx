import { useState } from 'react';
import {
  Tags,
  Tv,
  Globe,
  Radio,
  Users,
  Settings,
  Star,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dtyLogo from '@/assets/dty-logo.svg';
import { NavLink } from '@/components/NavLink';
import { useCategoriesContext } from '@/contexts/CategoriesContext';
import { Category } from '@/types/category';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const otherContentItems = [
  { title: 'Emissions', url: '/emissions', icon: Radio },
  { title: 'Mapa Web', url: '/mapa-web', icon: Globe },
  { title: 'programesTv3', url: '/programes-tv3', icon: Tv },
];

const systemItems = [
  { title: 'Serveis i usuaris', url: '/serveis', icon: Users },
  { title: 'Sistema', url: '/sistema', icon: Settings },
];

/* ── Mini tree node for sidebar ── */
function SidebarCategoryNode({
  category,
  getChildren,
  level = 0,
  onDelete,
}: {
  category: Category;
  getChildren: (parentId: string) => Category[];
  level?: number;
  onDelete: (cat: Category) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const children = getChildren(category.id);
  const hasChildren = children.length > 0;

  if (collapsed) return null;

  return (
    <div>
      <div
        className="group flex items-center gap-1 rounded-md px-1.5 py-1 text-xs text-sidebar-foreground/80 hover:bg-sidebar-accent transition-colors"
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {hasChildren ? (
          <button onClick={() => setExpanded(!expanded)} className="shrink-0 p-0.5 rounded hover:bg-sidebar-accent">
            {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
        ) : (
          <span className="w-4" />
        )}
        {expanded && hasChildren ? (
          <FolderOpen className="h-3.5 w-3.5 shrink-0 text-accent" />
        ) : (
          <Folder className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        )}
        <span
          className="truncate flex-1 cursor-pointer"
          onClick={() => navigate(`/categories/${category.id}`)}
        >
          {category.name}
        </span>
        <div className="flex items-center gap-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => navigate(`/categories/${category.id}/edit`)} title="Editar">
            <Pencil className="h-2.5 w-2.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive hover:bg-destructive/10" onClick={() => onDelete(category)} title="Eliminar">
            <Trash2 className="h-2.5 w-2.5" />
          </Button>
        </div>
      </div>
      {expanded && hasChildren && (
        <div>
          {children.map((child) => (
            <SidebarCategoryNode
              key={child.id}
              category={child}
              getChildren={getChildren}
              level={level + 1}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarSection({
  label,
  items,
  defaultOpen = true,
}: {
  label: string;
  items: { title: string; url: string; icon: React.ElementType }[];
  defaultOpen?: boolean;
}) {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  return (
    <Collapsible defaultOpen={defaultOpen} className="group/collapsible">
      <SidebarGroup>
        <CollapsibleTrigger asChild>
          <SidebarGroupLabel className="cursor-pointer text-sidebar-foreground/60 hover:text-sidebar-foreground uppercase text-[10px] tracking-widest font-semibold flex items-center justify-between">
            {!collapsed && label}
            {!collapsed && (
              <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=closed]/collapsible:rotate-[-90deg]" />
            )}
          </SidebarGroupLabel>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const navigate = useNavigate();
  const { rootCategories, getChildren, deleteCategory } = useCategoriesContext();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2.5">
            <img src={dtyLogo} alt="DTY Logo" className="h-8 w-8 shrink-0" />
            {!collapsed && (
              <span className="text-sm font-semibold text-sidebar-foreground tracking-tight">
                3Cat CMS
              </span>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent>
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="cursor-pointer text-sidebar-foreground/60 hover:text-sidebar-foreground uppercase text-[10px] tracking-widest font-semibold flex items-center justify-between">
                  {!collapsed && 'Continguts'}
                  {!collapsed && (
                    <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=closed]/collapsible:rotate-[-90deg]" />
                  )}
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {/* Categories with expandable tree */}
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <div
                          className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors cursor-pointer"
                          onClick={() => {
                            setCategoriesOpen(!categoriesOpen);
                            navigate('/categories');
                          }}
                        >
                          <Tags className="h-4 w-4 shrink-0" />
                          {!collapsed && <span className="flex-1">Categories</span>}
                          {!collapsed && (
                            <ChevronDown
                              className={`h-3.5 w-3.5 transition-transform ${!categoriesOpen ? '-rotate-90' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCategoriesOpen(!categoriesOpen);
                              }}
                            />
                          )}
                        </div>
                      </SidebarMenuButton>
                      {categoriesOpen && !collapsed && (
                        <div className="mt-0.5 mb-1">
                          {rootCategories.map((cat) => (
                            <SidebarCategoryNode
                              key={cat.id}
                              category={cat}
                              getChildren={getChildren}
                              onDelete={setDeleteTarget}
                            />
                          ))}
                        </div>
                      )}
                    </SidebarMenuItem>

                    {/* Other content items */}
                    {otherContentItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <NavLink
                            to={item.url}
                            end
                            className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                            activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                          >
                            <item.icon className="h-4 w-4 shrink-0" />
                            {!collapsed && <span>{item.title}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>

          <SidebarSection label="Sistema" items={systemItems} defaultOpen={false} />
        </SidebarContent>

        <SidebarFooter className="p-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink
                  to="/favorits"
                  className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                  activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                >
                  <Star className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>Favorits</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar categoria</AlertDialogTitle>
            <AlertDialogDescription>
              Estàs segur que vols eliminar <strong>{deleteTarget?.name}</strong>?
              Aquesta acció no es pot desfer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel·lar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
