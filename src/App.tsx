import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from "./routeTree.gen";
import { Toaster } from './components/ui/sonner';
import NotFoundPage from './components/page-404/page';
import SpinnerPage from './components/spinner/spinner-page';
import { AuthProvider, useAuthContext } from './context/auth-context';
import { CartProvider } from './context/cart-context';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

// Create a new router instance
const router = createRouter({
	routeTree,
	context: {
		queryClient,
		auth: undefined!,
	},
	defaultPreload: "intent",
	scrollRestoration: true,
	defaultStructuralSharing: true,
	// Since we're using React Query, we don't want loader calls to ever be stale
	// This will ensure that the loader is always called when the route is preloaded or visited
	defaultPreloadStaleTime: 0,
	defaultPendingComponent: SpinnerPage,
	defaultNotFoundComponent: NotFoundPage,
});

const AppRouter = () => {
	const auth = useAuthContext(); // ahora sí, dentro del AuthProvider
	return (
		<RouterProvider
			router={router}
			context={{ queryClient, auth }}
		/>
	);
}

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<CartProvider>
					<AppRouter />
				</CartProvider>
			</AuthProvider>
			<Toaster richColors />
		</QueryClientProvider>
	);
}
export default App;
