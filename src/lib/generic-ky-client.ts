import ky from "ky";

export const apiClient = ky.create({
	prefixUrl: "http://localhost:3000/",
	credentials: "include",
	timeout: 15000,
});