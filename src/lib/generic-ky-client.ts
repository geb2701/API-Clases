import ky from "ky";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/";

export const apiClient = ky.create({
	prefixUrl: API_URL,
	credentials: "include",
	timeout: 15000,
	hooks: {
		beforeRequest: [
			(request) => {
				// Agregar token JWT si existe en localStorage
				const token = localStorage.getItem("jwt_token");
				if (token) {
					request.headers.set("Authorization", `Bearer ${token}`);
				}
			}
		]
	}
});