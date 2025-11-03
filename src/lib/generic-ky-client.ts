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
	// Asegurar que las respuestas se interpreten como UTF-8
	headers: {
		"Accept": "application/json; charset=utf-8",
		"Accept-Charset": "utf-8",
	},
	hooks: {
		beforeRequest: [
			(request) => {
				// Agregar token JWT al header Authorization si está disponible
				const token = getAuthToken();
				if (token) {
					request.headers.set("Authorization", `Bearer ${token}`);
				}
				// Asegurar que el Content-Type use UTF-8 si hay body
				if (request.body && request.headers.get("Content-Type")?.includes("application/json")) {
					request.headers.set("Content-Type", "application/json; charset=utf-8");
				}
			},
		],
    afterResponse: [
      async (request, _options, response) => {
        // Manejo centralizado de expiración de token
        if (response.status === 401 || response.status === 403) {
          try {
            // Limpiar token en localStorage
            const authStoreRaw = localStorage.getItem("auth-store");
            if (authStoreRaw) {
              const parsed = JSON.parse(authStoreRaw);
              if (parsed?.state) {
                parsed.state.token = null;
                parsed.state.isLogged = false;
                localStorage.setItem("auth-store", JSON.stringify(parsed));
              } else {
                localStorage.removeItem("auth-store");
              }
            }

            // Redirigir a login preservando destino
            const currentUrl = window.location.pathname + window.location.search;
            const loginUrl = `/login?redirect=${encodeURIComponent(currentUrl)}`;
            // Evitar bucle si ya estamos en login
            if (!window.location.pathname.startsWith("/login")) {
              // Notificar opcionalmente a la app
              window.dispatchEvent(new CustomEvent("auth:expired"));
              window.location.assign(loginUrl);
            }
          } catch {
            // Ignorar errores de limpieza/redirect
          }
        }

        return response;
      }
    ]
	},
});