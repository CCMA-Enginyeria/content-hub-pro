import { useState, useMemo } from 'react';
import {
  Tags,
  Globe,
  FileText,
  Star,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Search,
  Layout,
  Layers,
  Box,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dtyLogo from '@/assets/dty-logo-2.svg';
import { NavLink } from '@/components/NavLink';
import { useCategoriesContext } from '@/contexts/CategoriesContext';
import { Category } from '@/types/category';
import { topLevelDomains } from '@/data/contentTree';
import { ContentDomain } from '@/types/contentTree';

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

/* ── Helper: check if a domain or any descendant matches the query ── */

function domainMatches(domain: ContentDomain, query: string): boolean {
  const q = query.toLowerCase();
  if (domain.localName.toLowerCase().includes(q)) return true;
  if (domain.idName.toLowerCase().includes(q)) return true;
  if (domain.tipologies?.some(t => t.localName.toLowerCase().includes(q))) return true;
  if (domain.subDomains?.some(sub => domainMatches(sub, q))) return true;
  return false;
}

/* ── Content domain node for sidebar ── */

function SidebarContentDomainNode({
  domain,
  level = 0,
  searchQuery = '',
}: {
  domain: ContentDomain;
  level?: number;
  searchQuery?: string;
}) {
  const [manualExpanded, setManualExpanded] = useState(false);
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const hasTipologies = domain.tipologies && domain.tipologies.length > 0;
  const hasSubDomains = domain.subDomains && domain.subDomains.length > 0;
  const hasChildren = hasTipologies || hasSubDomains;

  // Auto-expand when searching and this branch has matches
  const isSearching = searchQuery.length > 0;
  const expanded = isSearching ? (hasChildren && domainMatches(domain, searchQuery)) : manualExpanded;

  if (collapsed) return null;

  const q = searchQuery.toLowerCase();
  const filteredSubDomains = isSearching && hasSubDomains
    ? domain.subDomains!.filter(sub => domainMatches(sub, searchQuery))
    : domain.subDomains;
  const filteredTipologies = isSearching && hasTipologies
    ? domain.tipologies!.filter(t => t.localName.toLowerCase().includes(q))
    : domain.tipologies;

  return (
    <div>
      <div
        className="group flex items-center gap-1 rounded-md px-1.5 py-1 text-xs text-sidebar-foreground/80 hover:bg-sidebar-accent transition-colors cursor-pointer"
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => !isSearching && hasChildren && setManualExpanded(!manualExpanded)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => { e.stopPropagation(); if (!isSearching) setManualExpanded(!manualExpanded); }}
            className="shrink-0 p-0.5 rounded hover:bg-sidebar-accent"
          >
            {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
        ) : (
          <span className="w-4" />
        )}
        <Box className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <span className="truncate flex-1">{domain.localName}</span>
      </div>
      {expanded && (
        <div>
          {filteredSubDomains?.map((sub) => (
            <SidebarContentDomainNode
              key={sub.idName}
              domain={sub}
              level={level + 1}
              searchQuery={searchQuery}
            />
          ))}
          {filteredTipologies?.map((tip, i) => (
            <div
              key={`${tip.idName}-${i}`}
              className="flex items-center gap-1 rounded-md px-1.5 py-1 text-xs text-sidebar-foreground/60 hover:bg-sidebar-accent transition-colors cursor-pointer"
              style={{ paddingLeft: `${(level + 1) * 12 + 8}px` }}
            >
              <span className="w-4" />
              <FileText className="h-3 w-3 shrink-0 text-muted-foreground" />
              <span className="truncate flex-1">{tip.localName}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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
  const [openSection, setOpenSection] = useState<'continguts' | 'categories' | null>(null);
  const [contentSearch, setContentSearch] = useState('');

  // Filter top-level domains when searching
  const filteredDomains = useMemo(() => {
    if (!contentSearch) return topLevelDomains;
    return topLevelDomains.filter(d => domainMatches(d, contentSearch));
  }, [contentSearch]);

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
          <Collapsible
            open={openSection === 'continguts'}
            onOpenChange={(open) => { setOpenSection(open ? 'continguts' : null); if (!open) setContentSearch(''); }}
            className="group/collapsible"
          >
            <SidebarGroup>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="cursor-pointer text-sidebar-foreground/60 hover:text-sidebar-foreground uppercase text-[10px] tracking-widest font-semibold flex items-center gap-2">
                  {!collapsed && <Layers className="h-3.5 w-3.5" />}
                  {!collapsed && 'Continguts'}
                  {!collapsed && (
                    <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=closed]/collapsible:rotate-[-90deg]" />
                  )}
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  {!collapsed && (
                    <div>
                      <div className="px-2 py-1.5">
                        <div className="relative">
                          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Cercar..."
                            value={contentSearch}
                            onChange={(e) => setContentSearch(e.target.value)}
                            className="w-full rounded-md border border-sidebar-border bg-sidebar px-2 py-1 pl-7 text-xs text-sidebar-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-sidebar-ring"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      <div className="max-h-[40vh] overflow-y-auto scrollbar-thin">
                        {filteredDomains.map((domain) => (
                          <SidebarContentDomainNode
                            key={domain.idName}
                            domain={domain}
                            searchQuery={contentSearch}
                          />
                        ))}
                        {contentSearch && filteredDomains.length === 0 && (
                          <div className="px-3 py-2 text-xs text-muted-foreground">
                            Cap resultat per "{contentSearch}"
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>

          {/* Categories */}
          <Collapsible
            open={openSection === 'categories'}
            onOpenChange={(open) => setOpenSection(open ? 'categories' : null)}
            className="group/collapsible"
          >
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
