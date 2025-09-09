import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useUserContext } from "@/contexts/user-context";
import { getInitials } from "@/lib/helpers";
import {
	Check,
	Crown,
	Database,
	Eye,
	FileText,
	Lock,
	Pencil,
	Settings,
	Shield,
	Unlock,
	User,
	Users,
	X,
} from "lucide-react";
import { useId } from "react";

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

export const permissionDetails = {
	viewer: {
		label: "Viewer",
		icon: Eye,
		color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
		description: "Tienes acceso de solo lectura a este proyecto",
		canDo: [
			"Ver todo el contenido del proyecto",
			"Dejar comentarios en documentos",
			"Descargar archivos públicos",
			"Ver lista de miembros del equipo",
			"Recibir notificaciones",
		],
		cannotDo: [
			"Editar o crear contenido",
			"Gestionar permisos de usuario",
			"Eliminar archivos o carpetas",
			"Acceder a configuración de administrador",
			"Invitar nuevos usuarios",
		],
	},
	editor: {
		label: "Editor",
		icon: Pencil,
		color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
		description: "Puedes ver y editar el contenido del proyecto",
		canDo: [
			"Ver todo el contenido del proyecto",
			"Editar y crear documentos",
			"Subir y gestionar archivos",
			"Dejar y gestionar comentarios",
			"Crear y asignar tareas",
			"Ver análisis del proyecto",
		],
		cannotDo: [
			"Gestionar permisos de usuario",
			"Eliminar el proyecto",
			"Acceder a configuración de facturación",
			"Invitar usuarios como administrador",
			"Cambiar configuración del proyecto",
		],
	},
	admin: {
		label: "Admin",
		icon: Shield,
		color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
		description: "Tienes control total sobre este proyecto",
		canDo: [
			"Todos los permisos de editor",
			"Gestionar permisos de usuario",
			"Invitar y eliminar usuarios",
			"Acceder a configuración del proyecto",
			"Ver registros de auditoría",
			"Gestionar integraciones",
			"Exportar datos del proyecto",
		],
		cannotDo: [
			"Eliminar el proyecto permanentemente",
			"Transferir propiedad del proyecto",
			"Acceder a información de facturación",
			"Cambiar plan de suscripción",
		],
	},
	owner: {
		label: "Owner",
		icon: Crown,
		color:
			"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
		description: "Tienes control total sobre este proyecto",
		canDo: [
			"Todos los permisos de administrador",
			"Eliminar proyecto permanentemente",
			"Transferir propiedad",
			"Acceder a configuración de facturación",
			"Cambiar plan de suscripción",
			"Gestionar claves API",
			"Configurar webhooks",
		],
		cannotDo: [],
	},
};

//TODO Modificar Componente
export default function DialogUser({
	isOpen,
	onClose,
}: { isOpen: boolean; onClose: () => void }) {
	const id = useId();
	const user = useUserContext().getUser();
	// console.log(user);

	const hasAccess = (resource: (typeof resources)[0]) => {
		// console.log("falta modificar aca", resource);
		return true;
	};

	const userPermission = permissionDetails.owner;
	const PermissionIcon = userPermission.icon;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<User className="h-5 w-5" />
						Perfil y permisos
					</DialogTitle>
					<DialogDescription>
						Este es tu nivel de acceso actual y lo que puedes hacer.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2">
					<Card>
						<CardHeader className="pb-3">
							<div className="flex items-center gap-4">
								<Avatar className="size-12">
									<AvatarImage
										src={user?.imageUrl || "/placeholder.svg"}
										alt={`${user?.firstname} ${user?.lastname}`}
									/>
									<AvatarFallback className="bg-primary text-xl text-primary-foreground font-semibold">
										{getInitials(user?.firstname ?? "B", user?.lastname ?? "N")}
									</AvatarFallback>
								</Avatar>
								<div className="flex-1">
									<CardTitle className="text-lg">{`${user?.firstname} ${user?.lastname}`}</CardTitle>
									<CardDescription className="flex flex-col gap-0.5">
										<span>{user?.email}</span>
										<span className="text-xs text-muted-foreground">
											ID: {user?.userNumber}
										</span>
									</CardDescription>
								</div>
								<Badge
									variant="secondary"
									className={`gap-2 ${userPermission.color}`}
								>
									<PermissionIcon className="h-4 w-4" />
									{userPermission.label}
								</Badge>
							</div>
						</CardHeader>
						<CardContent className="pt-0">
							<p className="text-sm text-muted-foreground">
								{userPermission.description}
							</p>
							{/* <p className="text-xs text-muted-foreground mt-2">
								Miembro desde{" "}
								{new Date(user.joinedDate).toLocaleDateString()}
							</p> */}
						</CardContent>
					</Card>

					{/* Resource Access */}
					<div className="space-y-4">
						<h4 className="text-sm font-medium flex items-center gap-2">
							<Shield className="h-4 w-4" />
							Acceso a recursos
						</h4>
						<div className="grid gap-3">
							{resources.map((resource) => {
								const hasResourceAccess = hasAccess(resource);
								return (
									<div
										key={resource.name}
										className={`flex items-center justify-between p-3 border rounded-lg ${
											hasResourceAccess
												? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
												: "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
										}`}
									>
										<div className="flex items-center gap-3">
											{/* @ts-ignore */}
											<resource.icon className="h-5 w-5 text-muted-foreground" />
											<div>
												<p className="text-sm font-medium">{resource.name}</p>
												<p className="text-xs text-muted-foreground">
													Requerido: {resource.access.join(", ")}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-2">
											{hasResourceAccess ? (
												<>
													<Unlock className="h-4 w-4 text-green-600" />
													<Badge
														variant="outline"
														className="text-green-700 border-green-300"
													>
														Acceso concedido
													</Badge>
												</>
											) : (
												<>
													<Lock className="h-4 w-4 text-red-600" />
													<Badge
														variant="outline"
														className="text-red-700 border-red-300"
													>
														Sin acceso
													</Badge>
												</>
											)}
										</div>
									</div>
								);
							})}
						</div>
					</div>

					<Separator />

					{/* Permissions Details */}
					<div className="grid md:grid-cols-2 gap-4">
						{/* What you can do */}
						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-sm flex items-center gap-2 text-green-700">
									<Check className="h-4 w-4" />
									Lo que puedes hacer
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-0">
								<ul className="space-y-2">
									{userPermission.canDo.map((action) => (
										<li
											key={`${id}-${action}`}
											className="flex items-start gap-2 text-sm"
										>
											<Check className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
											<span>{action}</span>
										</li>
									))}
								</ul>
							</CardContent>
						</Card>

						{/* What you cannot do */}
						{userPermission.cannotDo.length > 0 && (
							<Card>
								<CardHeader className="pb-3">
									<CardTitle className="text-sm flex items-center gap-2 text-red-700">
										<X className="h-4 w-4" />
										Acciones restringidas
									</CardTitle>
								</CardHeader>
								<CardContent className="pt-0">
									<ul className="space-y-2">
										{userPermission.cannotDo.map((action) => (
											<li
												key={`${id}-${action}`}
												className="flex items-start gap-2 text-sm"
											>
												<X className="h-3 w-3 text-red-600 mt-0.5 flex-shrink-0" />
												<span>{action}</span>
											</li>
										))}
									</ul>
								</CardContent>
							</Card>
						)}
					</div>

					{/* Need more access? */}
					<Card className="border-dashed">
						<CardContent className="pt-6">
							<div className="text-center space-y-2">
								<h4 className="text-sm font-medium">¿Necesitas más acceso?</h4>
								<p className="text-xs text-muted-foreground">
									Contacta a tu administrador de proyecto para solicitar
									permisos adicionales.
								</p>
								<Button variant="outline" size="sm" className="mt-2">
									Solicitar acceso
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</DialogContent>
		</Dialog>
	);
}
