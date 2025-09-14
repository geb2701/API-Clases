import type * as React from "react";
import logo from "/Logo.png";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Cpu,
  House, Lamp, PackageSearch, Search, Shirt, ShoppingCart,
} from "lucide-react";
import { NavUser } from "./nav-user";
import { SidebarItems } from "./sidebar-items";
import { SidebarSearchStore } from "./storage/sidebar-search-store";
import { useCartContext } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const data = [
  {
    title: "",
    items: [
      {
        title: "Inicio",
        url: "/",
        icon: House,
      },
    ],
  },
  {
    title: "",
    items: [
      {
        title: "Productos",
        url: "/productos",
        icon: PackageSearch,
      },
    ],
  },
  {
    title: "Categorias",
    items: [
      {
        title: "Accesorios",
        url: "/productos/categorias/accesorios",
        icon: House,
      },
      {
        title: "Hogar",
        url: "/productos/categorias/hogar",
        icon: Lamp,
      },
      {
        title: "Ropa",
        url: "/productos/categorias/ropa",
        icon: Shirt,
      },
      {
        title: "Tecnología",
        url: "/productos/categorias/tecnologia",
        icon: Cpu,
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { filterValue, setFilter } = SidebarSearchStore();
  const { openCart, getTotalItems } = useCartContext();

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader className="h-16 max-md:mt-2 mb-2 flex items-center justify-center">
        <img src={logo} alt="Logo" className="size-10" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden pb-0">
          <SidebarGroupContent>
            <form className="relative">
              <Label htmlFor="search" className="sr-only">
                Buscar
              </Label>
              {/* biome-ignore lint/correctness/useUniqueElementIds: <explanation> */}
              <SidebarInput
                id="search"
                placeholder="Buscar..."
                className="pl-8"
                type="search"
                value={filterValue}
                onChange={(x) => setFilter(x.target.value)}
              />
              <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
            </form>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarItems items={data} />
      </SidebarContent>

      {/* Footer con carrito pegado al usuario */}
      <SidebarFooter className="pt-2 pb-0 flex flex-col gap-2 group-data-[collapsible=icon]:items-center">
        {/* Wrapper: saca padding y centra en colapsado */}
        <div className="
    px-2 w-full
    group-data-[collapsible=icon]:px-0
    group-data-[collapsible=icon]:flex
    group-data-[collapsible=icon]:justify-center
  ">
          <Button
            variant="ghost"
            onClick={openCart}
            aria-label="Abrir carrito"
            className="
        w-full gap-2 justify-start
        group-data-[collapsible=icon]:w-10
        group-data-[collapsible=icon]:h-10
        group-data-[collapsible=icon]:justify-center
        group-data-[collapsible=icon]:p-0
        group-data-[collapsible=icon]:rounded-xl
      "
          >
            <ShoppingCart className="h-4 w-4" />
            {/* Texto solo visible expandido */}
            <span className="group-data-[collapsible=icon]:hidden">Carrito</span>
            {/* Total solo visible expandido */}
            {getTotalItems() > 0 && (
              <Badge
                variant="secondary"
                className="ml-auto group-data-[collapsible=icon]:hidden"
              >
                {getTotalItems()}
              </Badge>
            )}
          </Button>
        </div>

        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}