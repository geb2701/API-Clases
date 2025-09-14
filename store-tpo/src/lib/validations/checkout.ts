import { z } from "zod";

// Esquema para información de facturación
export const billingInfoSchema = z.object({
    firstName: z
        .string()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(50, "El nombre no puede exceder los 50 caracteres")
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras y espacios"),

    lastName: z
        .string()
        .min(2, "El apellido debe tener al menos 2 caracteres")
        .max(50, "El apellido no puede exceder los 50 caracteres")
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El apellido solo puede contener letras y espacios"),

    dni: z
        .string()
        .min(7, "El DNI debe tener al menos 7 caracteres")
        .max(11, "El DNI no puede exceder los 11 caracteres")
        .regex(/^[0-9]+$/, "El DNI solo puede contener números"),

    address: z
        .string()
        .min(10, "La dirección debe tener al menos 10 caracteres")
        .max(100, "La dirección no puede exceder los 100 caracteres"),

    city: z
        .string()
        .min(2, "La ciudad debe tener al menos 2 caracteres")
        .max(50, "La ciudad no puede exceder los 50 caracteres")
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "La ciudad solo puede contener letras y espacios"),

    postalCode: z
        .string()
        .min(4, "El código postal debe tener al menos 4 caracteres")
        .max(10, "El código postal no puede exceder los 10 caracteres")
        .regex(/^[0-9A-Za-z]+$/, "El código postal solo puede contener números y letras")
});

// Esquema para información de envío
export const shippingInfoSchema = z.object({
    firstName: z
        .string()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(50, "El nombre no puede exceder los 50 caracteres")
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras y espacios"),

    lastName: z
        .string()
        .min(2, "El apellido debe tener al menos 2 caracteres")
        .max(50, "El apellido no puede exceder los 50 caracteres")
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El apellido solo puede contener letras y espacios"),

    address: z
        .string()
        .min(10, "La dirección debe tener al menos 10 caracteres")
        .max(100, "La dirección no puede exceder los 100 caracteres"),

    city: z
        .string()
        .min(2, "La ciudad debe tener al menos 2 caracteres")
        .max(50, "La ciudad no puede exceder los 50 caracteres")
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "La ciudad solo puede contener letras y espacios"),

    postalCode: z
        .string()
        .min(4, "El código postal debe tener al menos 4 caracteres")
        .max(10, "El código postal no puede exceder los 10 caracteres")
        .regex(/^[0-9A-Za-z]+$/, "El código postal solo puede contener números y letras")
});

// Esquema para información de pago
export const paymentInfoSchema = z.object({
    cardNumber: z
        .string()
        .min(13, "El número de tarjeta debe tener al menos 13 dígitos")
        .max(19, "El número de tarjeta no puede exceder los 19 dígitos")
        .regex(/^[0-9\s]+$/, "El número de tarjeta solo puede contener números y espacios")
        .refine((val) => {
            const digits = val.replace(/\s/g, '');
            let sum = 0;
            let isEven = false;

            for (let i = digits.length - 1; i >= 0; i--) {
                let digit = parseInt(digits[i]);

                if (isEven) {
                    digit *= 2;
                    if (digit > 9) {
                        digit -= 9;
                    }
                }

                sum += digit;
                isEven = !isEven;
            }

            return sum % 10 === 0;
        }, "Número de tarjeta inválido"),

    expiryDate: z
        .string()
        .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Formato de fecha inválido (MM/AA)")
        .refine((val) => {
            const [month, year] = val.split('/');
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear() % 100;
            const currentMonth = currentDate.getMonth() + 1;

            const cardYear = parseInt(year);
            const cardMonth = parseInt(month);

            if (cardYear < currentYear) return false;
            if (cardYear === currentYear && cardMonth < currentMonth) return false;
            if (cardYear > currentYear + 10) return false; // No más de 10 años en el futuro

            return true;
        }, "La tarjeta está vencida o la fecha es muy lejana"),

    cvv: z
        .string()
        .min(3, "El CVV debe tener al menos 3 dígitos")
        .max(4, "El CVV no puede exceder los 4 dígitos")
        .regex(/^[0-9]+$/, "El CVV solo puede contener números"),

    cardholderName: z
        .string()
        .min(2, "El nombre del titular debe tener al menos 2 caracteres")
        .max(50, "El nombre del titular no puede exceder los 50 caracteres")
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre del titular solo puede contener letras y espacios")
});

// Esquema principal para el checkout
export const checkoutSchema = z.object({
    billing: billingInfoSchema,
    shipping: shippingInfoSchema,
    payment: paymentInfoSchema,
    sameAddress: z.boolean()
});

// Tipos inferidos de los esquemas
export type BillingInfo = z.infer<typeof billingInfoSchema>;
export type ShippingInfo = z.infer<typeof shippingInfoSchema>;
export type PaymentInfo = z.infer<typeof paymentInfoSchema>;
export type CheckoutData = z.infer<typeof checkoutSchema>;
