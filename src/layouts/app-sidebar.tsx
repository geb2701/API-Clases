import type * as React from "react";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
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
  Book,
  Cpu,
  House, 
  Lamp, 
  PackageSearch, 
  Search, 
  Shirt, 
  ShoppingCart,
  SquareStar,
  type LucideIcon,
  Tag,
} from "lucide-react";
import { NavUser } from "./nav-user";
import { SidebarItems } from "./sidebar-items";
import { SidebarSearchStore } from "./storage/sidebar-search-store";
import { useCartContext } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useCategories } from "@/features/category/hooks/use-categories";
import type { Category } from "@/types/product";
import { categoryToSlug } from "@/lib/helpers";

// Mapeo de nombres de categoría a iconos (sin acentos para facilitar matching)
const categoryIconMap: Record<string, LucideIcon> = {
  "accesorios": House,
  "decoracion": SquareStar,
  "hogar": Lamp,
  "libros": Book,
  "ropa": Shirt,
  "tecnologia": Cpu,
  "default": Tag,
};

const getCategoryIcon = (categoryName: string): LucideIcon => {
  const normalizedName = categoryName
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
  return categoryIconMap[normalizedName] || categoryIconMap.default;
};

const getStaticData = (categories: Category[]) => [
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
    items: categories.map((category) => ({
      title: category.name,
      url: `/productos/categorias/${categoryToSlug(category.name)}`,
      icon: getCategoryIcon(category.name),
    })),
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { filterValue, setFilter } = SidebarSearchStore();
  const { openCart, getTotalItems } = useCartContext();
  
  // Obtener categorías desde la API
  const categoriesApi = useCategories();
  const { data: categories = [] } = useQuery(categoriesApi.queryOptions.all());

  // Generar datos del sidebar dinámicamente basados en las categorías
  const data = getStaticData(categories);

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader className="h-16 max-md:mt-2 mb-2 flex items-center justify-center overflow-hidden">
        {/* Versión expandida: con texto */}
        <div className="group-data-[collapsible=icon]:hidden">
          <Logo size="md" showText />
        </div>

        {/* Versión colapsada: sin texto */}
        <div className="hidden group-data-[collapsible=icon]:block">
          <Logo size="md" showText={false} />
        </div>
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