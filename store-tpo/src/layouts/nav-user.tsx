/*
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import useTheme, { type Theme } from "@/hooks/use-theme";
import { getInitials } from "@/lib/helpers";
import {
	Database,
	EllipsisVertical,
	FileText,
	Moon,
	Settings,
	Sun,
	User,
	Users,
} from "lucide-react";
import { useState } from "react";

export const resources = [
	{
		name: "Panel de Control del Proyecto",
		type: "dashboard",
		access: ["viewer", "editor", "admin", "owner"],
		icon: FileText,
	},
	{
		name: "Gestión de Usuarios",
		type: "users",
		access: ["admin", "owner"],
		icon: Users,
	},
	{
		name: "Acceso a la Base de Datos",
		type: "database",
		access: ["editor", "admin", "owner"],
		icon: Database,
	},
	{
		name: "Configuración del Proyecto",
		type: "settings",
		access: ["admin", "owner"],
		icon: Settings,
	},
	{
		name: "Facturación y Suscripción",
		type: "billing",
		access: ["owner"],
		icon: Lock,
	},
];

export function NavUser() {
	const { isMobile } = useSidebar();
	const { setTheme, theme } = useTheme();
	const user = useUserContext().getUser() || {
		firstname: "",
		lastname: "",
		imageUrl: "",
	};
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const toggleProfile = () => {
		setIsProfileOpen(!isProfileOpen);
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger className="py-0" asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="in-data-[state=expanded]:size-6 transition-[width,height] duration-200 ease-in-out">
								<AvatarImage
									src={user.imageUrl ?? ""}
									alt={getInitials(user.firstname, user.lastname)}
								/>
								<AvatarFallback className="bg-primary text-primary-foreground font-semibold">
									{getInitials(user.firstname, user.lastname)}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight ms-1">
								<span className="truncate font-medium">
									{user.firstname} {user.lastname}
								</span>
							</div>
							<div className="size-8 rounded-lg flex items-center justify-center bg-sidebar-accent/50 in-[[data-slot=dropdown-menu-trigger]:hover]:bg-transparent">
								<EllipsisVertical className="size-5 opacity-40" size={20} />
							</div>
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuItem className="gap-3 px-1" onClick={toggleProfile}>
							<User
								size={20}
								className="text-muted-foreground/70"
								aria-hidden="true"
							/>
							<span>Perfil</span>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuLabel className="flex items-center gap-2">
							<div className="relative size-5">
								<Sun className="absolute inset-0 size-5 opacity-100 transition-opacity duration-300 dark:opacity-0" />
								<Moon className="absolute inset-0 size-5 opacity-0 transition-opacity duration-300 dark:opacity-100" />
							</div>
							<span className="text-sm">Tema</span>
						</DropdownMenuLabel>
						<DropdownMenuRadioGroup
							value={theme}
							onValueChange={(t) => setTheme(t as Theme)}
						>
							<DropdownMenuRadioItem value="light" className="ml-2">
								Claro
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="dark" className="ml-2">
								Oscuro
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="system" className="ml-2">
								Sistema
							</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
*/
//Todo : habilitar cuando tengamos perfil de usuario