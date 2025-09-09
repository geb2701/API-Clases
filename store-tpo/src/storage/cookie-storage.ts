import { getCookie, removeCookie, setCookie } from "typescript-cookie";

// Custom storage interface using typescript-cookie
const cookieStorage = {
	getItem: (name: string) => {
		const value = getCookie(name); // Retrieve value from cookies
		return value ? JSON.parse(value) : null; // Parse it to JSON or return null
	},
	setItem: (name: string, value: string) => {
		setCookie(name, JSON.stringify(value), { expires: 7 }); // Store in cookie with expiry (7 days)
	},
	removeItem: (name: string) => {
		removeCookie(name); // Remove the cookie
	},
};

export default cookieStorage;
