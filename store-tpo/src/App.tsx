import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from "./routeTree.gen";
import { Toaster } from './components/ui/sonner';
import NotFoundPage from './components/page-404/page';
import SpinnerPage from './components/spinner/spinner-page';
import { AuthProvider } from './context/auth-context';

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

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<RouterProvider
					router={router}
					context={{ queryClient }}
				/>
			</AuthProvider>
			<Toaster richColors />
		</QueryClientProvider>
	)
}

export default App
