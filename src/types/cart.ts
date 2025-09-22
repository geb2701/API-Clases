import { Product } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
}

export class CartItemClass {
  product: Product;
  quantity: number;

  constructor(product: Product, quantity: number = 1) {
    this.product = product;
    this.quantity = quantity;
  }

  get total(): number {
    const price = Number(this.product.discount ?? this.product.price);
    return price * this.quantity;
  }

  get formattedTotal(): string {
    return `$${this.total.toFixed(2)}`;
  }
}
