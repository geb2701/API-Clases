export interface BillingInfo {
    firstName: string;
    lastName: string;
    dni: string;
    address: string;
    city: string;
    postalCode: string;
}

export interface ShippingInfo {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
}

export interface PaymentInfo {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
}

export interface CheckoutData {
    billing: BillingInfo;
    shipping: ShippingInfo;
    payment: PaymentInfo;
    sameAddress: boolean;
}
