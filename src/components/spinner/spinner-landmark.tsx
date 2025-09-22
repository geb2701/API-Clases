import { cn } from "@/lib/utils";
import { Landmark } from "lucide-react";

interface SpinnerLandmarkProps {
	size?: "sm" | "md" | "lg";
	iconSize?: "sm" | "md" | "lg" | "xl";
	className?: string;
	message?: string;
}

/**
 * A functional React component that renders a loading spinner with an optional message.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - The size of the spinner. Can be 'sm', 'md', or 'lg'.
 * @param {'sm' | 'md' | 'lg' | 'xl'} [props.iconSize='md'] - The size of the icon inside the spinner. Can be 'sm', 'md', 'lg', or 'xl'.
 * @param {string} [props.className] - Additional CSS classes to apply to the spinner.
 * @param {string} [props.message] - An optional message to display below the spinner.
 * @returns {JSX.Element} The rendered spinner component.
 */
export default function SpinnerLandmark({
	size = "md",
	message,
}: SpinnerLandmarkProps) {
	return (
		<div className="flex flex-col items-center space-y-3">
			<div className="relative flex items-center justify-center">
				<div className="container mx-auto px-4 py-8 max-w-4xl">
					<div className="flex items-center justify-center min-h-[400px]">
						<div className="text-center">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>

						</div>
					</div>
				</div>
			</div>

			{message ? (
				<span
					className={cn("text-gray-500 dark:text-gray-400", {
						"text-sm": size === "sm",
						"text-base": size === "md",
						"text-lg": size === "lg",
					})}
				>
					{message}
				</span>
			) : (
				<span className="sr-only">Loading...</span>
			)}
		</div>
	);
}
