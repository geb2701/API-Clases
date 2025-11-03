import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fromObject<T extends object>(
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	cls: new (...args: any[]) => T,
	obj: Partial<T>,
): T {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const instance = Object.create(cls.prototype);
	return Object.assign(instance, obj);
}