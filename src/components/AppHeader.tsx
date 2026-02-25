import { Search, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-12 items-center gap-3 border-b bg-primary px-3 text-primary-foreground">
      <SidebarTrigger className="text-primary-foreground hover:bg-primary-foreground/10" />

      {/* Global search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-primary-foreground/50" />
        <Input
          placeholder="Cercar..."
          className="h-8 border-primary-foreground/20 bg-primary-foreground/10 pl-8 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-primary-foreground/30"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10">
          <Bell className="h-4 w-4" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-primary-foreground/10 transition-colors">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-accent text-accent-foreground text-xs font-semibold">
                  CE
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:inline">cucu_edu</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs text-muted-foreground">El meu compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem>Preferències</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Tancar sessió</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
