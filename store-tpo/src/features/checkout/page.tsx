import React, { useState } from "react";
import { useCartContext } from "@/context/cart-context";
import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    ShoppingCart,
    CreditCard,
    MapPin,
    User,
    ArrowLeft,
    CheckCircle
} from "lucide-react";
import type { CheckoutData } from "@/types/checkout";

const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const { items, getFormattedTotal, clearCart } = useCartContext();

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<CheckoutData>({
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
    });

    const [errors, setErrors] = useState<Partial<CheckoutData>>({});

    const handleInputChange = (field: string, value: string | boolean, section: 'billing' | 'shipping' | 'payment') => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));

        // Limpiar errores cuando el usuario empiece a escribir
        if (errors[section]?.[field as keyof typeof errors[section]]) {
            setErrors(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: undefined
                }
            }));
        }
    };

    const validateStep = (step: number): boolean => {
        const newErrors: Partial<CheckoutData> = {};

        if (step === 1) {
            // Validar datos de facturación
            if (!formData.billing.firstName.trim()) newErrors.billing = { ...newErrors.billing, firstName: "El nombre es requerido" };
            if (!formData.billing.lastName.trim()) newErrors.billing = { ...newErrors.billing, lastName: "El apellido es requerido" };
            if (!formData.billing.dni.trim()) newErrors.billing = { ...newErrors.billing, dni: "El DNI/CUIT es requerido" };
            if (!formData.billing.address.trim()) newErrors.billing = { ...newErrors.billing, address: "La dirección es requerida" };
            if (!formData.billing.city.trim()) newErrors.billing = { ...newErrors.billing, city: "La ciudad es requerida" };
            if (!formData.billing.postalCode.trim()) newErrors.billing = { ...newErrors.billing, postalCode: "El código postal es requerido" };

            // Si no es la misma dirección, validar datos de envío
            if (!formData.sameAddress) {
                if (!formData.shipping.firstName.trim()) newErrors.shipping = { ...newErrors.shipping, firstName: "El nombre es requerido" };
                if (!formData.shipping.lastName.trim()) newErrors.shipping = { ...newErrors.shipping, lastName: "El apellido es requerido" };
                if (!formData.shipping.address.trim()) newErrors.shipping = { ...newErrors.shipping, address: "La dirección es requerida" };
                if (!formData.shipping.city.trim()) newErrors.shipping = { ...newErrors.shipping, city: "La ciudad es requerida" };
                if (!formData.shipping.postalCode.trim()) newErrors.shipping = { ...newErrors.shipping, postalCode: "El código postal es requerido" };
            }
        }

        if (step === 2) {
            // Validar datos de pago
            if (!formData.payment.cardNumber.trim()) newErrors.payment = { ...newErrors.payment, cardNumber: "El número de tarjeta es requerido" };
            if (!formData.payment.expiryDate.trim()) newErrors.payment = { ...newErrors.payment, expiryDate: "La fecha de vencimiento es requerida" };
            if (!formData.payment.cvv.trim()) newErrors.payment = { ...newErrors.payment, cvv: "El CVV es requerido" };
            if (!formData.payment.cardholderName.trim()) newErrors.payment = { ...newErrors.payment, cardholderName: "El nombre del titular es requerido" };
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = () => {
        if (validateStep(2)) {
            // Demo: Mostrar mensaje en consola
            console.log("=== DATOS DE COMPRA ===");
            console.log("Productos:", items);
            console.log("Total:", getFormattedTotal());
            console.log("Datos de facturación:", formData.billing);
            console.log("Datos de envío:", formData.sameAddress ? formData.billing : formData.shipping);
            console.log("Datos de pago:", formData.payment);
            console.log("=======================");

            // Limpiar carrito
            clearCart();

            // Redireccionar a la página principal
            navigate({ to: "/" });
        }
    };

    const handleSameAddressChange = (checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            sameAddress: checked,
            shipping: checked ? prev.billing : prev.shipping
        }));
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
                    <Button
                        variant="ghost"
                        onClick={() => navigate({ to: "/" })}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver al inicio
                    </Button>
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
                                            <Input
                                                id="firstName"
                                                value={formData.billing.firstName}
                                                onChange={(e) => handleInputChange("firstName", e.target.value, "billing")}
                                                className={errors.billing?.firstName ? "border-red-500" : ""}
                                            />
                                            {errors.billing?.firstName && (
                                                <p className="text-sm text-red-500 mt-1">{errors.billing.firstName}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="lastName">Apellido *</Label>
                                            <Input
                                                id="lastName"
                                                value={formData.billing.lastName}
                                                onChange={(e) => handleInputChange("lastName", e.target.value, "billing")}
                                                className={errors.billing?.lastName ? "border-red-500" : ""}
                                            />
                                            {errors.billing?.lastName && (
                                                <p className="text-sm text-red-500 mt-1">{errors.billing.lastName}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="dni">DNI o CUIT *</Label>
                                        <Input
                                            id="dni"
                                            value={formData.billing.dni}
                                            onChange={(e) => handleInputChange("dni", e.target.value, "billing")}
                                            className={errors.billing?.dni ? "border-red-500" : ""}
                                        />
                                        {errors.billing?.dni && (
                                            <p className="text-sm text-red-500 mt-1">{errors.billing.dni}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="address">Dirección/Domicilio *</Label>
                                        <Input
                                            id="address"
                                            value={formData.billing.address}
                                            onChange={(e) => handleInputChange("address", e.target.value, "billing")}
                                            className={errors.billing?.address ? "border-red-500" : ""}
                                        />
                                        {errors.billing?.address && (
                                            <p className="text-sm text-red-500 mt-1">{errors.billing.address}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="city">Ciudad *</Label>
                                            <Input
                                                id="city"
                                                value={formData.billing.city}
                                                onChange={(e) => handleInputChange("city", e.target.value, "billing")}
                                                className={errors.billing?.city ? "border-red-500" : ""}
                                            />
                                            {errors.billing?.city && (
                                                <p className="text-sm text-red-500 mt-1">{errors.billing.city}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="postalCode">Código postal *</Label>
                                            <Input
                                                id="postalCode"
                                                value={formData.billing.postalCode}
                                                onChange={(e) => handleInputChange("postalCode", e.target.value, "billing")}
                                                className={errors.billing?.postalCode ? "border-red-500" : ""}
                                            />
                                            {errors.billing?.postalCode && (
                                                <p className="text-sm text-red-500 mt-1">{errors.billing.postalCode}</p>
                                            )}
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="sameAddress"
                                            checked={formData.sameAddress}
                                            onCheckedChange={handleSameAddressChange}
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
                                                    <Input
                                                        id="shippingFirstName"
                                                        value={formData.shipping.firstName}
                                                        onChange={(e) => handleInputChange("firstName", e.target.value, "shipping")}
                                                        className={errors.shipping?.firstName ? "border-red-500" : ""}
                                                    />
                                                    {errors.shipping?.firstName && (
                                                        <p className="text-sm text-red-500 mt-1">{errors.shipping.firstName}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <Label htmlFor="shippingLastName">Apellido *</Label>
                                                    <Input
                                                        id="shippingLastName"
                                                        value={formData.shipping.lastName}
                                                        onChange={(e) => handleInputChange("lastName", e.target.value, "shipping")}
                                                        className={errors.shipping?.lastName ? "border-red-500" : ""}
                                                    />
                                                    {errors.shipping?.lastName && (
                                                        <p className="text-sm text-red-500 mt-1">{errors.shipping.lastName}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor="shippingAddress">Dirección *</Label>
                                                <Input
                                                    id="shippingAddress"
                                                    value={formData.shipping.address}
                                                    onChange={(e) => handleInputChange("address", e.target.value, "shipping")}
                                                    className={errors.shipping?.address ? "border-red-500" : ""}
                                                />
                                                {errors.shipping?.address && (
                                                    <p className="text-sm text-red-500 mt-1">{errors.shipping.address}</p>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="shippingCity">Ciudad *</Label>
                                                    <Input
                                                        id="shippingCity"
                                                        value={formData.shipping.city}
                                                        onChange={(e) => handleInputChange("city", e.target.value, "shipping")}
                                                        className={errors.shipping?.city ? "border-red-500" : ""}
                                                    />
                                                    {errors.shipping?.city && (
                                                        <p className="text-sm text-red-500 mt-1">{errors.shipping.city}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <Label htmlFor="shippingPostalCode">Código postal *</Label>
                                                    <Input
                                                        id="shippingPostalCode"
                                                        value={formData.shipping.postalCode}
                                                        onChange={(e) => handleInputChange("postalCode", e.target.value, "shipping")}
                                                        className={errors.shipping?.postalCode ? "border-red-500" : ""}
                                                    />
                                                    {errors.shipping?.postalCode && (
                                                        <p className="text-sm text-red-500 mt-1">{errors.shipping.postalCode}</p>
                                                    )}
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
                                        <Input
                                            id="cardNumber"
                                            placeholder="1234 5678 9012 3456"
                                            value={formData.payment.cardNumber}
                                            onChange={(e) => handleInputChange("cardNumber", e.target.value, "payment")}
                                            className={errors.payment?.cardNumber ? "border-red-500" : ""}
                                        />
                                        {errors.payment?.cardNumber && (
                                            <p className="text-sm text-red-500 mt-1">{errors.payment.cardNumber}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="cardholderName">Nombre del titular *</Label>
                                        <Input
                                            id="cardholderName"
                                            value={formData.payment.cardholderName}
                                            onChange={(e) => handleInputChange("cardholderName", e.target.value, "payment")}
                                            className={errors.payment?.cardholderName ? "border-red-500" : ""}
                                        />
                                        {errors.payment?.cardholderName && (
                                            <p className="text-sm text-red-500 mt-1">{errors.payment.cardholderName}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="expiryDate">Fecha de vencimiento *</Label>
                                            <Input
                                                id="expiryDate"
                                                placeholder="MM/AA"
                                                value={formData.payment.expiryDate}
                                                onChange={(e) => handleInputChange("expiryDate", e.target.value, "payment")}
                                                className={errors.payment?.expiryDate ? "border-red-500" : ""}
                                            />
                                            {errors.payment?.expiryDate && (
                                                <p className="text-sm text-red-500 mt-1">{errors.payment.expiryDate}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="cvv">CVV *</Label>
                                            <Input
                                                id="cvv"
                                                placeholder="123"
                                                value={formData.payment.cvv}
                                                onChange={(e) => handleInputChange("cvv", e.target.value, "payment")}
                                                className={errors.payment?.cvv ? "border-red-500" : ""}
                                            />
                                            {errors.payment?.cvv && (
                                                <p className="text-sm text-red-500 mt-1">{errors.payment.cvv}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button variant="outline" onClick={handlePrevious} className="flex-1">
                                            Volver
                                        </Button>
                                        <Button onClick={handleSubmit} className="flex-1">
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
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div key={item.product.id} className="flex gap-3">
                                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                                                <img
                                                    src={`http://localhost:3000/${item.product.image}`}
                                                    alt={item.product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-medium truncate">
                                                    {item.product.name}
                                                </h4>
                                                <p className="text-xs text-muted-foreground">
                                                    Cantidad: {item.quantity}
                                                </p>
                                                <p className="text-sm font-medium">
                                                    {item.formattedTotal}
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-semibold">Total:</span>
                                        <span className="text-lg font-bold">{getFormattedTotal()}</span>
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
