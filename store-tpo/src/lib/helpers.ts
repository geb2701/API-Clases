export const getInitials = (
	firstname: string | null,
	lastname: string | null,
): string => {
	if (!firstname && !lastname) return "";

	const firstInitial = firstname?.[0] ?? "";
	const lastParts = lastname?.split(" ") ?? [];

	const lastInitials = lastParts.map((part) => part[0]).join("");

	return `${firstInitial}${lastInitials}`.toUpperCase();
};

/**
 * Safely capitalizes the first letter of a string.
 *
 * @param str - The string to capitalize.
 * @returns The capitalized string.
 */
export function safeCapitalize(str: string) {
	if (!str) return "";
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Capitalizes the first letter of each word in a string.
 *
 * @param str - The input string.
 * @returns The string with capitalized words.
 */
export function capitalizeWords(str: string): string {
	return str.replace(/\w\S*/g, (txt) => {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}
