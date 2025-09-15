export class User {
  id: number;
  name: string;
  surname: string;
  email: string;

  constructor(id: number, name: string, surname: string, email: string) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.email = email;
  }

  get displayName(): string {
    return `${this.name} <${this.email}>`;
  }
}
