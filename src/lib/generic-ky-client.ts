import ky from "ky";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/";

// Función para obtener el token JWT del localStorage
const getAuthToken = (): string | null => {
	try {
		const authStore = localStorage.getItem("auth-store");
		if (authStore) {
			const parsed = JSON.parse(authStore);
			return parsed.state?.token || null;
		}
		return null;
	} catch {
		return null;
	}
};

export const apiClient = ky.create({
	prefixUrl: API_URL,
	credentials: "include",
	timeout: 15000,
	hooks: {
		beforeRequest: [
			(request) => {
				// Agregar token JWT al header Authorization si está disponible
				const token = getAuthToken();
				if (token) {
					request.headers.set("Authorization", `Bearer ${token}`);
				}
			},
		],
	},
});