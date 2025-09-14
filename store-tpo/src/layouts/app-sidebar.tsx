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
import { House, Search } from "lucide-react";
import { NavUser } from "./nav-user";
import { SidebarItems } from "./sidebar-items";
import { SidebarSearchStore } from "./storage/sidebar-search-store";

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
    title: "Categorias",
    items: [
      {
        title: "Accesorios",
        url: "/category/accesorios",
        icon: House,
      },
      {
        title: "Hogar",
        url: "/category/hogar",
        icon: House,
      },
      {
        title: "Ropa",
        url: "/category/ropa",
        icon: House,
      },
      {
        title: "Tecnología",
        url: "/category/tecnologia",
        icon: House,
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { filterValue, setFilter } = SidebarSearchStore();

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
              {/** biome-ignore lint/correctness/useUniqueElementIds: <explanation> */}
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
      <SidebarFooter className="pt-2 pb-0">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
