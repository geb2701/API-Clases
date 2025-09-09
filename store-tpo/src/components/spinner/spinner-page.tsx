import SpinnerLandmark from "./spinner-landmark";

/**
 * SpinnerLoadingPage is a functional component that renders a full-screen loading spinner.
 * It centers the spinner both vertically and horizontally within the viewport.
 *
 * @returns {JSX.Element} A JSX element containing the loading spinner.
 */
export default function SpinnerPage() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="mt-8 flex justify-center py-2">
				<SpinnerLandmark className="size-20" iconSize="lg" />
			</div>
		</div>
	);
}
