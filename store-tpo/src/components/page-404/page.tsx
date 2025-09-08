import { Typography } from "@/components/typography/typography";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

/**
 * NotFoundPage component renders a 404 error page.
 *
 * This component displays a message indicating that the requested page was not found.
 * It includes a large "404" text, a heading with the message "Página no encontrada!",
 * a description in Spanish apologizing for the missing page, and a button to navigate back to the homepage.
 *
 * @returns {JSX.Element} The rendered 404 error page component.
 */
export default function NotFoundPage() {
	return (
		<>
			<main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
				<div className="text-center">
					<p className="bg-gradient-to-r from-black to-white bg-clip-text text-[7rem] font-bold leading-tight text-transparent">
						404
					</p>
					<Typography
						variant="h1"
						className="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-7xl"
					>
						Página no encontrada!
					</Typography>
					<p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
						Lo sentimos, no hemos podido encontrar la página que estas buscando.
					</p>
					<div className="mt-10 flex items-center justify-center gap-x-6">
						<Button asChild>
							<Link
								to="/"
								className="px-3.5 py-2.5 font-semibold shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2"
							>
								Volver al inicio
							</Link>
						</Button>
					</div>
				</div>
			</main>
		</>
	);
}
