import ky from "ky";

export const apiClient = ky.create({
	prefixUrl: "http://localhost:3000/api/",  // Backend context-path es /api
	credentials: "include",
	timeout: 15000,
	headers: {
		"Content-Type": "application/json",
	},
});