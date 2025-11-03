import { useAuthContext } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clearAuthStorage } from "@/utils/clear-auth-storage";
import * as authService from "@/features/auth/services/auth-service";

export const DebugAuth = () => {
    const { user, token, isLogged } = useAuthContext();

    const testLogin = async () => {
        console.log("🧪 Probando login...");
        try {
            const response = await authService.login({
                email: "test@example.com",
                password: "test123"
            });
            console.log("✅ Respuesta del servidor:", response);
            alert(`Respuesta: ${JSON.stringify(response, null, 2)}`);
        } catch (error) {
            console.error("❌ Error en test:", error);
            alert(`Error: ${error instanceof Error ? error.message : "Error desconocido"}`);
        }
    };

    const testAPI = async () => {
        console.log("🧪 Probando conexión con API...");
        try {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/";
            const response = await fetch(`${API_URL}health`);
            const data = await response.json();
            console.log("✅ API responde:", data);
            alert(`API URL: ${API_URL}\nEstado: ${response.status}\nRespuesta: ${JSON.stringify(data, null, 2)}`);
        } catch (error) {
            console.error("❌ Error conectando con API:", error);
            alert(`Error: ${error instanceof Error ? error.message : "No se pudo conectar"}`);
        }
    };

    const checkStorage = () => {
        const authStore = localStorage.getItem("auth-store");
        const parsed = authStore ? JSON.parse(authStore) : null;
        console.log("📦 Storage actual:", parsed);
        alert(`Storage:\n${JSON.stringify(parsed, null, 2)}`);
    };

    const clearStorage = () => {
        if (confirm("¿Estás seguro de que quieres limpiar el almacenamiento?")) {
            clearAuthStorage();
            alert("✅ Almacenamiento limpiado. Recarga la página.");
            window.location.reload();
        }
    };

    return (
        <Card className="m-4 max-w-2xl">
            <CardHeader>
                <CardTitle>🔧 Diagnóstico de Autenticación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <h3 className="font-semibold">Estado Actual:</h3>
                    <pre className="bg-muted p-2 rounded text-xs overflow-auto">
                        {JSON.stringify({
                            isLogged,
                            user: user ? { id: user.id, email: user.email, name: user.name } : null,
                            hasToken: !!token,
                            tokenLength: token?.length || 0,
                            apiUrl: import.meta.env.VITE_API_URL || "http://localhost:8080/api/",
                        }, null, 2)}
                    </pre>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <Button onClick={testAPI} variant="outline" size="sm">
                        🧪 Probar API
                    </Button>
                    <Button onClick={testLogin} variant="outline" size="sm">
                        🧪 Probar Login
                    </Button>
                    <Button onClick={checkStorage} variant="outline" size="sm">
                        📦 Ver Storage
                    </Button>
                    <Button onClick={clearStorage} variant="destructive" size="sm">
                        🗑️ Limpiar Storage
                    </Button>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>Instrucciones:</strong></p>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Haz clic en "🧪 Probar API" para verificar que el backend esté corriendo</li>
                        <li>Revisa la consola del navegador (F12) para ver logs detallados</li>
                        <li>Si hay problemas, haz clic en "🗑️ Limpiar Storage" y recarga</li>
                        <li>Intenta hacer login nuevamente</li>
                    </ol>
                </div>
            </CardContent>
        </Card>
    );
};

