/**
 * Utilidad para limpiar el almacenamiento de autenticación
 * Útil para resolver problemas de datos corruptos o usuarios antiguos
 */
export const clearAuthStorage = () => {
    try {
        // Limpiar localStorage
        localStorage.removeItem("auth-store");

        // También limpiar cookies si se están usando
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
            if (name === "auth-store") {
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            }
        }

        console.log("✅ Almacenamiento de autenticación limpiado");
        return true;
    } catch (error) {
        console.error("❌ Error al limpiar almacenamiento:", error);
        return false;
    }
};

// Función para verificar y limpiar datos inválidos
export const validateAndCleanAuthStorage = () => {
    try {
        const authStore = localStorage.getItem("auth-store");
        if (authStore) {
            const parsed = JSON.parse(authStore);
            const state = parsed.state || parsed;

            // Si hay datos pero no hay token o usuario válido, limpiar
            if ((!state.token || !state.user) && state.isLogged) {
                console.warn("⚠️ Datos de autenticación inválidos detectados. Limpiando...");
                clearAuthStorage();
                return false;
            }

            return true;
        }
        return true;
    } catch (error) {
        console.error("❌ Error al validar almacenamiento:", error);
        clearAuthStorage();
        return false;
    }
};

