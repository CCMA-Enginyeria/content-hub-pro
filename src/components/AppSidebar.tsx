import { useState } from 'react';
import {
  Tags,
  Tv,
  Globe,
  FileText,
  Radio,
  Star,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Search,
  Layout,
  Layers,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dtyLogo from '@/assets/dty-logo-2.svg';
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

const contingutItems = [
  { title: 'Emissions', url: '/emissions', icon: Radio },
  { title: 'programesTv3', url: '/programes-tv3', icon: Tv },
];

/* ── Mini tree node for sidebar ── */

function SidebarCategoryNode({
  category,
  getChildren,
  level = 0,
  navigate,
}: {
  category: Category;
  getChildren: (parentId: string) => Category[];
  level?: number;
  navigate: (path: string) => void;
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
        onClick={() => navigate(`/categories/${category.id}`)}
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
        {hasChildren ? (
          expanded ? <FolderOpen className="h-3.5 w-3.5 shrink-0 text-accent" /> : <Folder className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        ) : (
          <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        )}
        <span className="truncate flex-1">{category.name}</span>
        {hasChildren && (
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/categories?parent=${category.id}`); }}
            className="shrink-0 p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-sidebar-accent transition-opacity"
            title="Cerca subcategories"
          >
            <Search className="h-3 w-3" />
          </button>
        )}
      </div>
      {expanded && hasChildren && (
        <div>
          {children.map((child) => (
            <SidebarCategoryNode
              key={child.id}
              category={child}
              getChildren={getChildren}
              level={level + 1}
              navigate={navigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarSection({
  label,
  icon: Icon,
  items,
  defaultOpen = true,
}: {
  label: string;
  icon?: React.ElementType;
  items: { title: string; url: string; icon: React.ElementType }[];
  defaultOpen?: boolean;
}) {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  return (
    <Collapsible defaultOpen={defaultOpen} className="group/collapsible">
      <SidebarGroup>
        <CollapsibleTrigger asChild>
          <SidebarGroupLabel className="cursor-pointer text-sidebar-foreground/60 hover:text-sidebar-foreground uppercase text-[10px] tracking-widest font-semibold flex items-center gap-2">
            {!collapsed && Icon && <Icon className="h-3.5 w-3.5" />}
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

  // Skip "Tags" root node — show its children as top-level
  const tagsRoot = rootCategories.find((c) => c.name === 'Tags');
  const topLevelCategories = tagsRoot ? getChildren(tagsRoot.id) : rootCategories;

  return (
    <Sidebar collapsible="icon">
        <SidebarHeader className="p-4">
          <div className="flex items-center justify-center">
            <img src={dtyLogo} alt="DTY Logo" className="h-9 w-auto shrink-0" />
          </div>
        </SidebarHeader>

        <SidebarContent>
          {/* Continguts */}
          <SidebarSection label="Continguts" icon={Layers} items={contingutItems} defaultOpen />

          {/* Categories — top level section */}
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel
                  className="cursor-pointer text-sidebar-foreground/60 hover:text-sidebar-foreground uppercase text-[10px] tracking-widest font-semibold flex items-center gap-2"
                  onClick={() => navigate('/categories')}
                >
                  {!collapsed && <Tags className="h-3.5 w-3.5" />}
                  {!collapsed && 'Categories'}
                  {!collapsed && (
                    <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=closed]/collapsible:rotate-[-90deg]" />
                  )}
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  {!collapsed && (
                    <div className="max-h-[40vh] overflow-y-auto scrollbar-thin">
                      {topLevelCategories.map((cat) => (
                        <SidebarCategoryNode
                          key={cat.id}
                          category={cat}
                          getChildren={getChildren}
                          navigate={navigate}
                        />
                      ))}
                    </div>
                  )}
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>

          {/* Frontals */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/frontals"
                      end
                      className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <Layout className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>Frontals</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Mapa Web */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/mapa-web"
                      end
                      className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <Globe className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>Mapa Web</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Favorits */}
          <SidebarGroup>
            <SidebarGroupContent>
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
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
  );
}
