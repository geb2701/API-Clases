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
	iconSize = "md",
	className,
	message,
}: SpinnerLandmarkProps) {
	const iconSizeClasses = {
		sm: "size-4",
		md: "size-6",
		lg: "size-8",
		xl: "size-12",
	};

	return (
		<div className="flex flex-col items-center space-y-3">
			<div className="relative flex items-center justify-center">
				<svg
					aria-hidden="true"
					className={cn(
					"animate-spin text-gray-200 dark:text-gray-600",
					{
						"w-4 h-4": size === "sm",
						"w-8 h-8": size === "md",
						"w-12 h-12": size === "lg",
					},
					className,
				)}
					viewBox="0 0 100 101"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
						fill="currentColor"
					/>
				</svg>

				<div className="absolute inset-0 flex items-center justify-center text-primary">
					<Landmark
						className={cn(
							"transition-all group-hover:scale-110",
							iconSizeClasses[iconSize],
						)}
					/>
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
