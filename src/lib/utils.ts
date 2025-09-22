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
	const instance = new cls();
	return Object.assign(instance, obj);
}