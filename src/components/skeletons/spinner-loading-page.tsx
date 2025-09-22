import Spinner from "./spinner";

export default function SpinnerLoadingPage() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="mt-8 flex justify-center py-2">
				<Spinner className="size-20" iconSize="lg" />
			</div>
		</div>
	);
}
