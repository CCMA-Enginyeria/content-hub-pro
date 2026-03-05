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
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dtyLogo from '@/assets/dty-logo.svg';
import { NavLink } from '@/components/NavLink';
import { useCategoriesContext } from '@/contexts/CategoriesContext';
import { Category } from '@/types/category';

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
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary/25 text-inherit rounded-sm px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function SidebarCategoryNode({
  category,
  getChildren,
  level = 0,
  searchQuery = '',
  onClickCategory,
}: {
  category: Category;
  getChildren: (parentId: string) => Category[];
  level?: number;
  searchQuery?: string;
  onClickCategory: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const children = getChildren(category.id);
  const hasChildren = children.length > 0;

  if (collapsed) return null;

  return (
    <div>
      <div
        className="group flex items-center gap-1 rounded-md px-1.5 py-1 text-xs text-sidebar-foreground/80 hover:bg-sidebar-accent transition-colors cursor-pointer"
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => onClickCategory(category.id)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="shrink-0 p-0.5 rounded hover:bg-sidebar-accent"
          >
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
        <span className="truncate flex-1">
          <HighlightText text={category.name} query={searchQuery} />
        </span>
      </div>
      {expanded && hasChildren && (
        <div>
          {children.map((child) => (
            <SidebarCategoryNode
              key={child.id}
              category={child}
              getChildren={getChildren}
              level={level + 1}
              searchQuery={searchQuery}
              onClickCategory={onClickCategory}
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
  const { rootCategories, getChildren } = useCategoriesContext();
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const handleCategoryClick = (id: string) => {
    const children = getChildren(id);
    if (children.length > 0) {
      navigate(`/categories?parent=${id}`);
    } else {
      navigate(`/categories/${id}`);
    }
  };

  return (
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
                          <div className="max-h-[40vh] overflow-y-auto scrollbar-thin">
                            {rootCategories.map((cat) => (
                                <SidebarCategoryNode
                                  key={cat.id}
                                  category={cat}
                                  getChildren={getChildren}
                                  onClickCategory={handleCategoryClick}
                                />
                              ))}
                            
                          </div>
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
  );
}
