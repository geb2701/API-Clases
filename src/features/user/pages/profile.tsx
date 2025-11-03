/** biome-ignore-all lint/correctness/useUniqueElementIds: <explanation> */
/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
import { useAuthContext } from "@/context/auth-context";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import ImageLazy from "@/components/image-lazy";
import {
	User as UserIcon,
	Mail,
	Package,
	Calendar,
	MapPin,
	FileText,
	DollarSign,
} from "lucide-react";
import { useOrders } from "@/features/order/hooks/use-orders";
import { getImageUrl } from "@/features/product/services/upload-service";
// Formatear fecha sin dependencia externa
const formatDate = (dateString: string | undefined): string => {
	if (!dateString) return "Fecha no disponible";
	try {
		const date = new Date(dateString);
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		};
		return date.toLocaleDateString("es-ES", options);
	} catch {
		return "Fecha inválida";
	}
};

const getStatusColor = (status: string) => {
	switch (status.toLowerCase()) {
		case "pending":
			return "bg-yellow-100 text-yellow-800 border-yellow-200";
		case "processing":
			return "bg-blue-100 text-blue-800 border-blue-200";
		case "shipped":
			return "bg-purple-100 text-purple-800 border-purple-200";
		case "delivered":
			return "bg-green-100 text-green-800 border-green-200";
		case "cancelled":
			return "bg-red-100 text-red-800 border-red-200";
		default:
			return "bg-gray-100 text-gray-800 border-gray-200";
	}
};

const getStatusLabel = (status: string) => {
	switch (status.toLowerCase()) {
		case "pending":
			return "Pendiente";
		case "processing":
			return "Procesando";
		case "shipped":
			return "Enviado";
		case "delivered":
			return "Entregado";
		case "cancelled":
			return "Cancelado";
		default:
			return status;
	}
};

const ProfilePage: React.FC = () => {
	const { user } = useAuthContext();

	// Los hooks deben llamarse siempre, antes de cualquier return condicional
	const ordersQuery = useSuspenseQuery(
		useOrders().queryOptions.myOrders()
	);
	const orders = ordersQuery.data || [];

	if (!user) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Card>
					<CardContent className="pt-6">
						<p className="text-center text-muted-foreground">
							No hay información de usuario disponible
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Calcular estadísticas
	const totalOrders = orders.length;
	const totalSpent = orders.reduce((sum, order) => {
		const amount = typeof order.totalAmount === "number"
			? order.totalAmount
			: parseFloat(String(order.totalAmount || "0"));
		return sum + amount;
	}, 0);
	const pendingOrders = orders.filter(o => o.status?.toLowerCase() === "pending" || o.status?.toLowerCase() === "processing").length;

	return (
		<div className="container mx-auto px-4 py-8 max-w-6xl">
			<div className="space-y-6">
				{/* Header */}
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
					<p className="text-muted-foreground mt-2">
						Información personal e historial de pedidos
					</p>
				</div>

				{/* Estadísticas Rápidas */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Card>
						<CardContent className="pt-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Total de Pedidos</p>
									<p className="text-2xl font-bold">{totalOrders}</p>
								</div>
								<Package className="h-8 w-8 text-muted-foreground" />
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="pt-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Total Gastado</p>
									<p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
								</div>
								<DollarSign className="h-8 w-8 text-muted-foreground" />
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="pt-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Pedidos Pendientes</p>
									<p className="text-2xl font-bold">{pendingOrders}</p>
								</div>
								<Calendar className="h-8 w-8 text-muted-foreground" />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Información del Usuario */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<UserIcon className="h-5 w-5" />
							Información Personal
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="flex items-center gap-3">
								<UserIcon className="h-5 w-5 text-muted-foreground" />
								<div>
									<p className="text-sm font-medium text-muted-foreground">
										Nombre completo
									</p>
									<p className="text-base font-semibold">
										{user.name} {user.surname}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<Mail className="h-5 w-5 text-muted-foreground" />
								<div>
									<p className="text-sm font-medium text-muted-foreground">
										Email
									</p>
									<p className="text-base font-semibold">{user.email}</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<FileText className="h-5 w-5 text-muted-foreground" />
								<div>
									<p className="text-sm font-medium text-muted-foreground">
										ID de Usuario
									</p>
									<p className="text-base font-semibold">#{user.id}</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Historial de Pedidos */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Package className="h-5 w-5" />
							Historial de Pedidos
							<Badge variant="secondary" className="ml-2">
								{orders.length}
							</Badge>
						</CardTitle>
					</CardHeader>
					<CardContent>
						{orders.length === 0 ? (
							<div className="text-center py-8">
								<Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
								<p className="text-muted-foreground">
									No tienes pedidos aún
								</p>
								<Button
									variant="outline"
									className="mt-4"
									onClick={() => {
										window.location.href = "/";
									}}
								>
									Explorar Productos
								</Button>
							</div>
						) : (
							<div className="space-y-4">
								{orders.map((order) => (
									<Card key={order.id} className="border">
										<CardContent className="pt-6">
											<div className="space-y-4">
												{/* Header del Pedido */}
												<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
													<div className="space-y-2">
														<div className="flex items-center gap-2">
															<FileText className="h-4 w-4 text-muted-foreground" />
															<span className="text-sm font-medium text-muted-foreground">
																Pedido #{order.orderNumber || order.id}
															</span>
														</div>
														<div className="flex items-center gap-2">
															<Calendar className="h-4 w-4 text-muted-foreground" />
															<span className="text-sm text-muted-foreground">
																{formatDate(order.createdAt)}
															</span>
														</div>
													</div>
													<div className="flex items-center gap-4">
														<Badge
															className={getStatusColor(order.status)}
														>
															{getStatusLabel(order.status)}
														</Badge>
														<div className="flex items-center gap-2">
															<DollarSign className="h-4 w-4 text-muted-foreground" />
															<span className="text-lg font-bold">
																$
																{typeof order.totalAmount === "number"
																	? order.totalAmount.toFixed(2)
																	: parseFloat(String(order.totalAmount || "0")).toFixed(2)}
															</span>
														</div>
													</div>
												</div>

												<Separator />

												{/* Items del Pedido */}
												{order.orderItems && order.orderItems.length > 0 && (
													<div className="space-y-2">
														<h4 className="font-medium text-sm">Productos:</h4>
														<div className="space-y-2">
															{order.orderItems.map((item) => (
																<div
																	key={item.id}
																	className="flex gap-3 p-3 rounded-md border bg-card"
																>
																	<div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
																		{item.product?.image ? (
																			<ImageLazy
																				src={getImageUrl(item.product.image)}
																				alt={item.product.name || "Producto"}
																				className="h-full w-full object-cover"
																			/>
																		) : (
																			<div className="h-full w-full flex items-center justify-center text-muted-foreground">
																				<Package className="h-6 w-6" />
																			</div>
																		)}
																	</div>
																	<div className="flex-1 min-w-0">
																		<h5 className="font-medium text-sm line-clamp-1">
																			{item.product?.name || "Producto"}
																		</h5>
																		<div className="flex items-center justify-between mt-1">
																			<span className="text-xs text-muted-foreground">
																				Cantidad: {item.quantity}
																			</span>
																			<span className="text-xs font-medium">
																				${item.unitPrice.toFixed(2)} c/u
																			</span>
																		</div>
																	</div>
																	<div className="text-right">
																		<p className="text-sm font-semibold">
																			${item.totalPrice.toFixed(2)}
																		</p>
																	</div>
																</div>
															))}
														</div>
													</div>
												)}

												{/* Direcciones */}
												{(order.billingAddresses?.length || order.shippingAddresses?.length) && (
													<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
														{order.billingAddresses && order.billingAddresses.length > 0 && (
															<div className="space-y-2">
																<h4 className="font-medium text-sm flex items-center gap-2">
																	<MapPin className="h-4 w-4" />
																	Dirección de Facturación
																</h4>
																{order.billingAddresses.map((address) => (
																	<div
																		key={address.id}
																		className="text-sm text-muted-foreground space-y-1"
																	>
																		<p className="font-medium text-foreground">
																			{address.firstName} {address.lastName}
																		</p>
																		<p>{address.address}</p>
																		<p>
																			{address.city}, {address.postalCode}
																		</p>
																		{address.dni && (
																			<p className="text-xs">DNI: {address.dni}</p>
																		)}
																	</div>
																))}
															</div>
														)}
														{order.shippingAddresses && order.shippingAddresses.length > 0 && (
															<div className="space-y-2">
																<h4 className="font-medium text-sm flex items-center gap-2">
																	<MapPin className="h-4 w-4" />
																	Dirección de Envío
																</h4>
																{order.shippingAddresses.map((address) => (
																	<div
																		key={address.id}
																		className="text-sm text-muted-foreground space-y-1"
																	>
																		<p className="font-medium text-foreground">
																			{address.firstName} {address.lastName}
																		</p>
																		<p>{address.address}</p>
																		<p>
																			{address.city}, {address.postalCode}
																		</p>
																	</div>
																))}
															</div>
														)}
													</div>
												)}
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default ProfilePage;

