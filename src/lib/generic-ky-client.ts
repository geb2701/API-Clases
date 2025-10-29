import ky from "ky";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/";

export const apiClient = ky.create({
	prefixUrl: API_URL,
	credentials: "include",
	timeout: 15000,
});