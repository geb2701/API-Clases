export class Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  discount?: number; // Precio con descuento (opcional)

  constructor(
    id: number,
    name: string,
    description: string,
    price: number,
    category: string,
    image: string,
    stock: number,
    discount?: number
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category;
    this.image = image;
    this.stock = stock;
    this.discount = discount;
  }

  getFormattedPrice(): string {
    return `$${this.price.toFixed(2)}`;
  }

  getFormattedDiscountPrice(): string {
    return this.discount ? `$${this.discount.toFixed(2)}` : this.getFormattedPrice();
  }

  hasDiscount(): boolean {
    return this.discount !== undefined && this.discount < this.price;
  }

  getDiscountPercentage(): number {
    if (!this.hasDiscount()) return 0;
    return Math.round(((this.price - this.discount!) / this.price) * 100);
  }
}
