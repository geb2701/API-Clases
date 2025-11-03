import { Link } from "@tanstack/react-router"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { useAuthContext } from "@/context/auth-context";
import useTheme, { type Theme } from "@/hooks/use-theme";
import { getInitials } from "@/lib/helpers";
import { BaggageClaim, EllipsisVertical, Moon, Sun, User } from "lucide-react";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { setTheme, theme } = useTheme();
  const { user, logout } = useAuthContext();

  const firstName = (user?.name?.trim()?.split(/\s+/)?.[0]) || (user?.email?.split("@")[0] ?? "Usuario");
  const initials = getInitials(user?.name ?? firstName, user?.surname ?? "");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="w-full justify-between data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div data-slot="avatar">
                <Avatar className="size-8">
                  <AvatarImage alt={initials} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 ms-2 truncate text-sm font-medium text-left">
                {firstName}
              </div>

              <div className="size-8 rounded-lg flex items-center justify-center bg-sidebar-accent/50">
                <EllipsisVertical className="size-5 opacity-40" />
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem className="gap-3 px-1" asChild>
              <Link to="/perfil">
                <User size={20} className="text-muted-foreground/70" aria-hidden="true" />
                <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
            {user && (
              <DropdownMenuItem className="gap-3 px-1" asChild>
                <Link to="/gestionar">
                  <BaggageClaim size={20} className="text-muted-foreground/70" aria-hidden="true" />
                  <span>Gestionar</span>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />

            <DropdownMenuLabel className="flex items-center gap-2">
              <div className="relative size-5">
                <Sun className="absolute inset-0 size-5 opacity-100 transition-opacity duration-300 dark:opacity-0" />
                <Moon className="absolute inset-0 size-5 opacity-0 transition-opacity duration-300 dark:opacity-100" />
              </div>
              <span className="text-sm">Tema</span>
            </DropdownMenuLabel>

            <DropdownMenuRadioGroup value={theme} onValueChange={(t) => setTheme(t as Theme)}>
              <DropdownMenuRadioItem value="light" className="ml-2">Claro</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark" className="ml-2">Oscuro</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system" className="ml-2">Sistema</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>

            <DropdownMenuSeparator />

            {!user && (
              <>
                <DropdownMenuItem asChild>
                  <Link to="/login">Iniciar sesión</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/signup">Crear cuenta</Link>
                </DropdownMenuItem>
              </>
            )}

            {user && (
              <DropdownMenuItem onClick={() => logout()}>
                Cerrar sesión
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
