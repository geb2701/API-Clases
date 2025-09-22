import { cn } from "@/lib/utils";
import type { JSX } from "react";

interface StaticListProps {
	items: string[];
}

/**
 * StaticList is a component that renders a static list of items.
 * It is used to display a list of items in a static format.
 *
 * @param {StaticListProps} props - The props for the StaticList component.
 * @param {string[]} props.items - The items to be displayed in the list.
 * @returns {JSX.Element} The rendered StaticList component.
 */
const StaticList = ({
	className,
	items,
	...props
}: React.ComponentProps<"ul"> & StaticListProps): JSX.Element => {
	return (
		<ul
			data-slot="ul"
			className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}
			{...props}
		>
			{items.map((item: string, index: number) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: List items are not dynamic
				<li key={index}>{item}</li>
			))}
		</ul>
	);
}

export { StaticList };
