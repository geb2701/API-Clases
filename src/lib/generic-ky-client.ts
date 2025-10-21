import ky from "ky";

export const apiClient = ky.create({
	prefixUrl: "http://localhost:8080/api/",
	credentials: "include",
	timeout: 15000,
});