/** biome-ignore-all lint/correctness/useUniqueElementIds: <explanation> */
/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
import { useCartContext } from "@/context/cart-context";
import { useNavigate } from "@tanstack/react-router";
import { useAuthContext } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import ImageLazy from "@/components/image-lazy";
import {
	ShoppingCart,
	CreditCard,
	MapPin,
	User,
	CheckCircle
} from "lucide-react";
import {
	checkoutSchema,
	type CheckoutData
} from "@/lib/validations/checkout";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getImageUrl } from "@/features/product/services/upload-service";
import { createOrder } from "@/features/order/services/order-service";

const CHECKOUT_STORAGE_KEY = "checkout_data";

// Función para guardar datos en localStorage (sin datos sensibles de tarjeta)
const saveCheckoutData = (data: CheckoutData) => {
	try {
		const dataToSave = {
			billing: data.billing,
			shipping: data.shipping,
			payment: {
				// NO guardar cardNumber ni cvv (datos sensibles)
				expiryDate: data.payment.expiryDate,
				cardholderName: data.payment.cardholderName
			},
			sameAddress: data.sameAddress
		};
		localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(dataToSave));
	} catch (error) {
		console.error("Error al guardar datos de checkout:", error);
	}
};

// Función para cargar datos guardados
const loadCheckoutData = (): Partial<CheckoutData> | null => {
	try {
		const saved = localStorage.getItem(CHECKOUT_STORAGE_KEY);
		if (!saved) return null;
		const parsed = JSON.parse(saved);
		return {
			...parsed,
			payment: {
				...parsed.payment,
				cardNumber: "", // Siempre vacío por seguridad
				cvv: "" // Siempre vacío por seguridad
			}
		};
	} catch (error) {
		console.error("Error al cargar datos de checkout:", error);
		return null;
	}
};

const CheckoutPage: React.FC = () => {
	const navigate = useNavigate();
	const { getProducts, getFormattedTotal, clearCart } = useCartContext();
	const { isLogged } = useAuthContext();

	const items = getProducts();

	const [currentStep, setCurrentStep] = useState(1);

	// Cargar datos guardados
	const savedData = loadCheckoutData();

	// Configurar react-hook-form con validación Zod
	const form = useForm<CheckoutData>({
		resolver: zodResolver(checkoutSchema),
		defaultValues: savedData || {
			billing: {
				firstName: "",
				lastName: "",
				dni: "",
				address: "",
				city: "",
				postalCode: ""
			},
			shipping: {
				firstName: "",
				lastName: "",
				address: "",
				city: "",
				postalCode: ""
			},
			payment: {
				cardNumber: "",
				expiryDate: "",
				cvv: "",
				cardholderName: ""
			},
			sameAddress: true
		},
		mode: "onChange" // Validar en tiempo real
	});

	const { control, watch, setValue, trigger, getValues, formState: { errors } } = form;
	const formData = watch();

	// Guardar datos automáticamente cuando cambian (con debounce)
	useEffect(() => {
		if (formData.billing?.firstName || formData.billing?.dni) {
			const timeoutId = setTimeout(() => {
				saveCheckoutData(formData);
			}, 500); // Guardar después de 500ms de inactividad

			return () => clearTimeout(timeoutId);
		}
		// biome-ignore lint/correctness/useExhaustiveDependencies: formData contiene todas las dependencias necesarias
	}, [formData]);

	// Función para validar el paso actual
	const validateCurrentStep = (step: number): boolean => {
		const stepErrors: string[] = [];
		const emptyFields: string[] = [];

		if (step === 1) {
			// Verificar campos vacíos de facturación
			if (!formData.billing.firstName.trim()) emptyFields.push("Nombre");
			if (!formData.billing.lastName.trim()) emptyFields.push("Apellido");
			if (!formData.billing.dni.trim()) emptyFields.push("DNI");
			if (!formData.billing.address.trim()) emptyFields.push("Dirección");
			if (!formData.billing.city.trim()) emptyFields.push("Ciudad");
			if (!formData.billing.postalCode.trim()) emptyFields.push("Código postal");

			// Si no es la misma dirección, verificar campos de envío
			if (!formData.sameAddress) {
				if (!formData.shipping.firstName.trim()) emptyFields.push("Nombre de envío");
				if (!formData.shipping.lastName.trim()) emptyFields.push("Apellido de envío");
				if (!formData.shipping.address.trim()) emptyFields.push("Dirección de envío");
				if (!formData.shipping.city.trim()) emptyFields.push("Ciudad de envío");
				if (!formData.shipping.postalCode.trim()) emptyFields.push("Código postal de envío");
			}

			// Verificar errores de validación de facturación
			if (errors.billing?.firstName) stepErrors.push("Nombre");
			if (errors.billing?.lastName) stepErrors.push("Apellido");
			if (errors.billing?.dni) stepErrors.push("DNI");
			if (errors.billing?.address) stepErrors.push("Dirección");
			if (errors.billing?.city) stepErrors.push("Ciudad");
			if (errors.billing?.postalCode) stepErrors.push("Código postal");

			// Si no es la misma dirección, verificar errores de envío
			if (!formData.sameAddress) {
				if (errors.shipping?.firstName) stepErrors.push("Nombre de envío");
				if (errors.shipping?.lastName) stepErrors.push("Apellido de envío");
				if (errors.shipping?.address) stepErrors.push("Dirección de envío");
				if (errors.shipping?.city) stepErrors.push("Ciudad de envío");
				if (errors.shipping?.postalCode) stepErrors.push("Código postal de envío");
			}
		}

		if (step === 2) {
			// Verificar campos vacíos de pago
			if (!formData.payment.cardNumber.trim()) emptyFields.push("Número de tarjeta");
			if (!formData.payment.cardholderName.trim()) emptyFields.push("Nombre del titular");
			if (!formData.payment.expiryDate.trim()) emptyFields.push("Fecha de vencimiento");
			if (!formData.payment.cvv.trim()) emptyFields.push("CVV");

			// Verificar errores de validación de pago
			if (errors.payment?.cardNumber) stepErrors.push("Número de tarjeta");
			if (errors.payment?.cardholderName) stepErrors.push("Nombre del titular");
			if (errors.payment?.expiryDate) stepErrors.push("Fecha de vencimiento");
			if (errors.payment?.cvv) stepErrors.push("CVV");
		}

		// Mostrar notificaciones de errores
		if (emptyFields.length > 0) {
			toast.error("Campos obligatorios incompletos", {
				description: `Por favor, completa los siguientes campos: ${emptyFields.join(", ")}.`,
				duration: 6000,
			});
			return false;
		}

		if (stepErrors.length > 0) {
			if (stepErrors.length === 1) {
				toast.error(`Error en ${stepErrors[0]}`, {
					description: "Por favor, revisa el campo marcado en rojo y corrige el error antes de continuar.",
					duration: 5000,
				});
			} else {
				toast.error(`Se encontraron ${stepErrors.length} errores`, {
					description: `Campos con errores: ${stepErrors.join(", ")}. Por favor, revisa los campos marcados en rojo.`,
					duration: 6000,
				});
			}
			return false;
		}

		return true;
	};

	const handleNext = () => {
		// Forzar validación de todos los campos del paso actual
		if (currentStep === 1) {
			// Validar campos de facturación
			trigger(['billing.firstName', 'billing.lastName', 'billing.dni', 'billing.address', 'billing.city', 'billing.postalCode']);

			// Si no es la misma dirección, validar también campos de envío
			if (!formData.sameAddress) {
				trigger(['shipping.firstName', 'shipping.lastName', 'shipping.address', 'shipping.city', 'shipping.postalCode']);
			}
		}

		if (validateCurrentStep(currentStep)) {
			setCurrentStep(prev => prev + 1);

			// Mostrar notificación de éxito al avanzar
			if (currentStep === 1) {
				toast.success("Información de facturación completada", {
					description: "Ahora puedes continuar con los datos de pago.",
					duration: 3000,
				});
			}
		}
	};

	const handlePrevious = () => {
		setCurrentStep(prev => prev - 1);
	};

	const onSubmit = async (data: CheckoutData) => {
		console.log("onSubmit called with data:", data);

		// Verificaciones explícitas solicitadas
		try {
			const itemsForOrder = items.map(item => ({
				productId: Number(item.product.id),
				quantity: Number(item.quantity)
			}));
			console.log('=== DATOS DE ORDEN ===');
			console.log('Items:', JSON.stringify(itemsForOrder, null, 2));
			const legacyToken = localStorage.getItem('token');
			console.log('Token:', legacyToken ? 'Presente' : 'FALTA');
			try {
				const authStoreRaw = localStorage.getItem('auth-store');
				const parsed = authStoreRaw ? JSON.parse(authStoreRaw) : null;
				console.log('Token (auth-store):', parsed?.state?.token ? 'Presente' : 'FALTA');
			} catch {}
			console.log('Payload completo (previo):', JSON.stringify({
				billing: data.billing,
				shipping: data.sameAddress ? undefined : data.shipping,
				payment: {
					cardNumber: data.payment.cardNumber ? `${data.payment.cardNumber.slice(0,4)}...` : '' ,
					expiryDate: data.payment.expiryDate,
					cvv: data.payment.cvv ? '***' : '',
					cardholderName: data.payment.cardholderName
				},
				items: itemsForOrder
			}, null, 2));
		} catch {}

		// Verificar autenticación
		if (!isLogged) {
			toast.error("Debes iniciar sesión", {
				description: "Por favor, inicia sesión para realizar una compra.",
				duration: 5000,
			});
			navigate({ to: "/login", search: { redirect: "/checkout" } });
			return;
		}

		try {
			// Preparar items de la orden
			const orderItems = items.map(item => ({
				productId: Number(item.product.id),
				quantity: Number(item.quantity)
			}));

			console.log("Calling createOrder API with:", {
				billing: data.billing,
				shipping: data.sameAddress ? undefined : data.shipping,
				payment: {
					cardNumber: data.payment.cardNumber.substring(0, 4) + "..." // Solo mostrar primeros 4 dígitos
				},
				items: orderItems
			});

			// Crear orden usando la API
			const order = await createOrder({
				billing: {
					firstName: data.billing.firstName,
					lastName: data.billing.lastName,
					dni: data.billing.dni,
					address: data.billing.address,
					city: data.billing.city,
					postalCode: data.billing.postalCode
				},
				shipping: data.sameAddress ? undefined : {
					firstName: data.shipping.firstName,
					lastName: data.shipping.lastName,
					dni: data.billing.dni, // Usar mismo DNI
					address: data.shipping.address,
					city: data.shipping.city,
					postalCode: data.shipping.postalCode
				},
				payment: {
					cardNumber: data.payment.cardNumber,
					expiryDate: data.payment.expiryDate,
					cvv: data.payment.cvv,
					cardholderName: data.payment.cardholderName
				},
				items: orderItems
			});

			// Mostrar notificación de éxito
			toast.success("¡Compra realizada con éxito!", {
				description: `Tu pedido ${order.orderNumber} por ${getFormattedTotal()} ha sido procesado correctamente.`,
				duration: 5000,
			});

			// Limpiar carrito
			clearCart();

			// Limpiar datos guardados en localStorage
			try {
				localStorage.removeItem(CHECKOUT_STORAGE_KEY);
			} catch (error) {
				console.error("Error al limpiar datos de checkout:", error);
			}

			// Redireccionar a la página principal después de un breve delay
			setTimeout(() => {
				navigate({ to: "/" });
			}, 2000);

		} catch (error) {
			console.error("Error en onSubmit:", error);

			let errorMessage = "No se pudo procesar tu pedido. Por favor, inténtalo de nuevo.";

			if (error instanceof Error) {
				errorMessage = error.message;
			} else if (error && typeof error === 'object' && 'message' in error) {
				errorMessage = String(error.message);
			}

			// Verificar si el error es de autenticación
			if (errorMessage.toLowerCase().includes("no autenticado") ||
				errorMessage.toLowerCase().includes("unauthorized") ||
				errorMessage.toLowerCase().includes("401")) {
				errorMessage = "Debes iniciar sesión para realizar una compra. Por favor, inicia sesión e intenta nuevamente.";
			}

			toast.error("Error al procesar la compra", {
				description: errorMessage,
				duration: 5000,
			});
		}
	};

	const handleFormSubmit = async (e?: React.MouseEvent) => {
		e?.preventDefault();
		console.log("handleFormSubmit called");

		// Primero validar manualmente el paso 2
		const stepValid = validateCurrentStep(2);
		console.log("Step 2 validation result:", stepValid);

		if (!stepValid) {
			console.log("Step 2 validation failed, aborting");
			return;
		}

		// Forzar validación de todos los campos de pago con react-hook-form
		const isValid = await trigger(['payment.cardNumber', 'payment.cardholderName', 'payment.expiryDate', 'payment.cvv']);
		console.log("Form validation result:", isValid);

		// Si la validación falló, no continuar
		if (!isValid) {
			console.log("React-hook-form validation failed");
			return;
		}

		// Si ambas validaciones pasaron, llamar directamente a onSubmit con los valores del formulario
		console.log("All validations passed, calling onSubmit");
		const formValues = getValues();
		await onSubmit(formValues);
	};

	const handleSameAddressChange = (checked: boolean) => {
		setValue("sameAddress", checked);

		// Si se marca como misma dirección, copiar datos de facturación a envío
		if (checked) {
			const billingData = formData.billing;
			setValue("shipping", billingData);
		}

		// Mostrar notificación informativa
		if (!checked) {
			toast.info("Dirección de envío diferente", {
				description: "Por favor, completa los datos de envío antes de continuar.",
				duration: 4000,
			});
		}
	};

	const formatCardNumber = (value: string) => {
		// Remover todos los espacios y caracteres no numéricos
		const cleaned = value.replace(/\D/g, '');
		// Agregar espacios cada 4 dígitos
		return cleaned.replace(/(.{4})/g, '$1 ').trim();
	};

	const formatExpiryDate = (value: string) => {
		// Remover caracteres no numéricos
		const cleaned = value.replace(/\D/g, '');
		// Formatear como MM/AA
		if (cleaned.length >= 2) {
			return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
		}
		return cleaned;
	};

	if (items.length === 0) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Card className="max-w-md mx-auto">
					<CardContent className="pt-6">
						<div className="text-center">
							<ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
							<h2 className="text-xl font-semibold mb-2">Carrito vacío</h2>
							<p className="text-muted-foreground mb-4">
								No hay productos en tu carrito para finalizar la compra.
							</p>
							<Button onClick={() => navigate({ to: "/" })}>
								Volver al inicio
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold">Finalizar compra</h1>
					<p className="text-muted-foreground mt-2">
						Completa la información para procesar tu pedido
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Formulario principal */}
					<div className="lg:col-span-2 space-y-6">
						{/* Paso 1: Información de facturación */}
						{currentStep === 1 && (
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<User className="h-5 w-5" />
										Información de facturación
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<Label htmlFor="firstName">Nombre *</Label>
											<Controller
												name="billing.firstName"
												control={control}
												render={({ field, fieldState }) => (
													<>
														<Input
															{...field}
															id="firstName"
															className={fieldState.error ? "border-red-500 focus:border-red-500" : ""}
															maxLength={50}
															placeholder="Juan"
														/>
														{fieldState.error && (
															<p className="text-sm text-red-500 mt-1 flex items-center gap-1">
																<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
																	<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
																</svg>
																{fieldState.error.message}
															</p>
														)}
													</>
												)}
											/>
										</div>
										<div>
											<Label htmlFor="lastName">Apellido *</Label>
											<Controller
												name="billing.lastName"
												control={control}
												render={({ field, fieldState }) => (
													<>
														<Input
															{...field}
															id="lastName"
															className={fieldState.error ? "border-red-500 focus:border-red-500" : ""}
															maxLength={50}
															placeholder="Pérez"
														/>
														{fieldState.error && (
															<p className="text-sm text-red-500 mt-1 flex items-center gap-1">
																<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
																	<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
																</svg>
																{fieldState.error.message}
															</p>
														)}
													</>
												)}
											/>
										</div>
									</div>

									<div>
										<Label htmlFor="dni">DNI o CUIT *</Label>
										<Controller
											name="billing.dni"
											control={control}
											render={({ field, fieldState }) => (
												<>
													<Input
														{...field}
														id="dni"
														className={fieldState.error ? "border-red-500 focus:border-red-500" : ""}
														maxLength={11}
														placeholder="12345678"
														onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
													/>
													{fieldState.error && (
														<p className="text-sm text-red-500 mt-1 flex items-center gap-1">
															<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
																<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
															</svg>
															{fieldState.error.message}
														</p>
													)}
												</>
											)}
										/>
									</div>

									<div>
										<Label htmlFor="address">Dirección/Domicilio *</Label>
										<Controller
											name="billing.address"
											control={control}
											render={({ field, fieldState }) => (
												<>
													<Input
														{...field}
														id="address"
														className={fieldState.error ? "border-red-500 focus:border-red-500" : ""}
														maxLength={100}
														placeholder="Av. Corrientes 1234"
													/>
													{fieldState.error && (
														<p className="text-sm text-red-500 mt-1 flex items-center gap-1">
															<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
																<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
															</svg>
															{fieldState.error.message}
														</p>
													)}
												</>
											)}
										/>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<Label htmlFor="city">Ciudad *</Label>
											<Controller
												name="billing.city"
												control={control}
												render={({ field, fieldState }) => (
													<>
														<Input
															{...field}
															id="city"
															className={fieldState.error ? "border-red-500 focus:border-red-500" : ""}
															maxLength={50}
															placeholder="Buenos Aires"
														/>
														{fieldState.error && (
															<p className="text-sm text-red-500 mt-1 flex items-center gap-1">
																<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
																	<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
																</svg>
																{fieldState.error.message}
															</p>
														)}
													</>
												)}
											/>
										</div>
										<div>
											<Label htmlFor="postalCode">Código postal *</Label>
											<Controller
												name="billing.postalCode"
												control={control}
												render={({ field, fieldState }) => (
													<>
														<Input
															{...field}
															id="postalCode"
															className={fieldState.error ? "border-red-500 focus:border-red-500" : ""}
															maxLength={10}
															placeholder="1043"
														/>
														{fieldState.error && (
															<p className="text-sm text-red-500 mt-1 flex items-center gap-1">
																<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
																	<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
																</svg>
																{fieldState.error.message}
															</p>
														)}
													</>
												)}
											/>
										</div>
									</div>

									<Separator />

									<div className="flex items-center space-x-2">
										<Controller
											name="sameAddress"
											control={control}
											render={({ field }) => (
												<Checkbox
													id="sameAddress"
													checked={field.value}
													onCheckedChange={handleSameAddressChange}
												/>
											)}
										/>
										<Label htmlFor="sameAddress">
											El domicilio de facturación es el mismo que el de envío
										</Label>
									</div>

									{!formData.sameAddress && (
										<div className="space-y-4 pt-4">
											<h3 className="text-lg font-semibold flex items-center gap-2">
												<MapPin className="h-5 w-5" />
												Información de envío
											</h3>

											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
													<Label htmlFor="shippingFirstName">Nombre *</Label>
													<Controller
														name="shipping.firstName"
														control={control}
														render={({ field, fieldState }) => (
															<>
																<Input
																	{...field}
																	id="shippingFirstName"
																	className={fieldState.error ? "border-red-500 focus:border-red-500" : ""}
																	maxLength={50}
																	placeholder="Juan"
																/>
																{fieldState.error && (
																	<p className="text-sm text-red-500 mt-1 flex items-center gap-1">
																		<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
																			<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
																		</svg>
																		{fieldState.error.message}
																	</p>
																)}
															</>
														)}
													/>
												</div>
												<div>
													<Label htmlFor="shippingLastName">Apellido *</Label>
													<Controller
														name="shipping.lastName"
														control={control}
														render={({ field, fieldState }) => (
															<>
																<Input
																	{...field}
																	id="shippingLastName"
																	className={fieldState.error ? "border-red-500 focus:border-red-500" : ""}
																	maxLength={50}
																	placeholder="Pérez"
																/>
																{fieldState.error && (
																	<p className="text-sm text-red-500 mt-1 flex items-center gap-1">
																		<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
																			<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
																		</svg>
																		{fieldState.error.message}
																	</p>
																)}
															</>
														)}
													/>
												</div>
											</div>

											<div>
												<Label htmlFor="shippingAddress">Dirección *</Label>
												<Controller
													name="shipping.address"
													control={control}
													render={({ field, fieldState }) => (
														<>
															<Input
																{...field}
																id="shippingAddress"
																className={fieldState.error ? "border-red-500 focus:border-red-500" : ""}
																maxLength={100}
																placeholder="Av. Corrientes 1234"
															/>
															{fieldState.error && (
																<p className="text-sm text-red-500 mt-1 flex items-center gap-1">
																	<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
																		<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
																	</svg>
																	{fieldState.error.message}
																</p>
															)}
														</>
													)}
												/>
											</div>

											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
													<Label htmlFor="shippingCity">Ciudad *</Label>
													<Controller
														name="shipping.city"
														control={control}
														render={({ field, fieldState }) => (
															<>
																<Input
																	{...field}
																	id="shippingCity"
																	className={fieldState.error ? "border-red-500 focus:border-red-500" : ""}
																	maxLength={50}
																	placeholder="Buenos Aires"
																/>
																{fieldState.error && (
																	<p className="text-sm text-red-500 mt-1 flex items-center gap-1">
																		<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
																			<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
																		</svg>
																		{fieldState.error.message}
																	</p>
																)}
															</>
														)}
													/>
												</div>
												<div>
													<Label htmlFor="shippingPostalCode">Código postal *</Label>
													<Controller
														name="shipping.postalCode"
														control={control}
														render={({ field, fieldState }) => (
															<>
																<Input
																	{...field}
																	id="shippingPostalCode"
																	className={fieldState.error ? "border-red-500 focus:border-red-500" : ""}
																	maxLength={10}
																	placeholder="1043"
																/>
																{fieldState.error && (
																	<p className="text-sm text-red-500 mt-1 flex items-center gap-1">
																		<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
																			<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
																		</svg>
																		{fieldState.error.message}
																	</p>
																)}
															</>
														)}
													/>
												</div>
											</div>
										</div>
									)}

									<div className="flex justify-end">
										<Button onClick={handleNext} className="w-full md:w-auto">
											Continuar al pago
										</Button>
									</div>
								</CardContent>
							</Card>
						)}

						{/* Paso 2: Información de pago */}
						{currentStep === 2 && (
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<CreditCard className="h-5 w-5" />
										Información de pago
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<Label htmlFor="cardNumber">Número de tarjeta *</Label>
										<Controller
											name="payment.cardNumber"
											control={control}
											render={({ field, fieldState }) => (
												<>
													<Input
														{...field}
														id="cardNumber"
														placeholder="1234 5678 9012 3456"
														className={fieldState.error ? "border-red-500 focus:border-red-500" : ""}
														maxLength={19}
														onChange={(e) => field.onChange(formatCardNumber(e.target.value))}
													/>
													{fieldState.error && (
														<p className="text-sm text-red-500 mt-1 flex items-center gap-1">
															<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
																<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
															</svg>
															{fieldState.error.message}
														</p>
													)}
												</>
											)}
										/>
									</div>

									<div>
										<Label htmlFor="cardholderName">Nombre del titular *</Label>
										<Controller
											name="payment.cardholderName"
											control={control}
											render={({ field, fieldState }) => (
												<>
													<Input
														{...field}
														id="cardholderName"
														className={fieldState.error ? "border-red-500 focus:border-red-500" : ""}
														maxLength={50}
														placeholder="JUAN PEREZ"
													/>
													{fieldState.error && (
														<p className="text-sm text-red-500 mt-1 flex items-center gap-1">
															<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
																<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
															</svg>
															{fieldState.error.message}
														</p>
													)}
												</>
											)}
										/>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<Label htmlFor="expiryDate">Fecha de vencimiento *</Label>
											<Controller
												name="payment.expiryDate"
												control={control}
												render={({ field, fieldState }) => (
													<>
														<Input
															{...field}
															id="expiryDate"
															placeholder="MM/AA"
															className={fieldState.error ? "border-red-500 focus:border-red-500" : ""}
															maxLength={5}
															onChange={(e) => field.onChange(formatExpiryDate(e.target.value))}
														/>
														{fieldState.error && (
															<p className="text-sm text-red-500 mt-1 flex items-center gap-1">
																<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
																	<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
																</svg>
																{fieldState.error.message}
															</p>
														)}
													</>
												)}
											/>
										</div>
										<div>
											<Label htmlFor="cvv">CVV *</Label>
											<Controller
												name="payment.cvv"
												control={control}
												render={({ field, fieldState }) => (
													<>
														<Input
															{...field}
															id="cvv"
															placeholder="123"
															className={fieldState.error ? "border-red-500 focus:border-red-500" : ""}
															maxLength={4}
															onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
														/>
														{fieldState.error && (
															<p className="text-sm text-red-500 mt-1 flex items-center gap-1">
																<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
																	<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
																</svg>
																{fieldState.error.message}
															</p>
														)}
													</>
												)}
											/>
										</div>
									</div>

									<div className="flex gap-4">
										<Button variant="outline" onClick={handlePrevious} className="flex-1">
											Volver
										</Button>
										<Button onClick={handleFormSubmit} className="flex-1">
											<CheckCircle className="h-4 w-4 mr-2" />
											Finalizar compra
										</Button>
									</div>
								</CardContent>
							</Card>
						)}
					</div>

					{/* Resumen del pedido */}
					<div className="lg:col-span-1">
						<Card className="sticky top-4">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<ShoppingCart className="h-5 w-5" />
									Resumen del pedido
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{/* Lista de productos */}
									<div className="space-y-2">
										{items.map((item) => (
											<div key={item.product.id} className="flex gap-2 p-2 rounded-md border bg-card">
												<div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
													<ImageLazy
														src={getImageUrl(item.product.image)}
														alt={item.product.name}
														className="h-full w-full object-cover"
													/>
												</div>
												<div className="flex-1 min-w-0">
													<h4 className="text-xs font-medium line-clamp-1 mb-1">
														{item.product.name}
													</h4>
													<div className="space-y-0.5">
														<div className="flex items-center justify-between text-xs text-muted-foreground">
															<span>Precio:</span>
															<span className="font-medium text-xs">
																{item.product.hasDiscount()
																	? item.product.getFormattedDiscountPrice()
																	: item.product.getFormattedPrice()
																}
															</span>
														</div>
														<div className="flex items-center justify-between text-xs text-muted-foreground">
															<span>Cant:</span>
															<span className="font-medium text-xs">{item.quantity}</span>
														</div>
														{item.product.hasDiscount() && (
															<div className="flex items-center justify-between text-xs text-muted-foreground">
																<span>Original:</span>
																<span className="line-through text-xs">{item.product.getFormattedPrice()}</span>
															</div>
														)}
													</div>
													<div className="flex items-center justify-between mt-1 pt-1 border-t">
														<span className="text-xs font-semibold">Subtotal:</span>
														<span className="text-xs font-bold text-primary">
															{item.formattedTotal}
														</span>
													</div>
												</div>
											</div>
										))}
									</div>

									<Separator />

									{/* Resumen de totales */}
									<div className="space-y-1">
										<div className="flex items-center justify-between text-xs">
											<span>Productos ({items.length}):</span>
											<span>{items.reduce((acc, item) => acc + item.quantity, 0)} unidades</span>
										</div>
										<div className="flex items-center justify-between text-sm font-semibold">
											<span>Total:</span>
											<span className="text-base font-bold text-primary">{getFormattedTotal()}</span>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CheckoutPage;