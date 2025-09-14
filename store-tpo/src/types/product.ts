export class Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;

  constructor(
    id: number,
    name: string,
    description: string,
    price: number,
    category: string,
    image: string,
    stock: number
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category;
    this.image = image;
    this.stock = stock;
  }

  getFormattedPrice(): string {
    return `$${this.price.toFixed(2)}`;
  }
}
