import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { Slot as SlotPrimitive } from "@radix-ui/react-slot";

const typographyVariants = cva("text-foreground", {
	variants: {
		variant: {
			h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
			h2: "scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0",
			h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
			h4: "scroll-m-20 text-xl font-semibold tracking-tight",
			h5: "scroll-m-20 text-lg font-semibold tracking-tight",
			h6: "scroll-m-20 text-base font-semibold tracking-tight",
			p: "text-base font-normal leading-7 [&:not(:first-child)]:mt-6",
			blockquote: "mt-6 border-l-2 pl-6 italic",
			code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
			lead: "text-xl text-muted-foreground",
			large: "text-lg font-semibold",
			small: "text-sm font-medium leading-none",
			extraSmall: "text-xs leading-none",
			muted: "text-sm text-muted-foreground",
			regular: "text-base",
		},
		weight: {
			bold: "!font-bold",
			semibold: "!font-semibold",
			normal: "!font-normal",
			medium: "!font-medium",
			light: "!font-light",
		},
	},
	defaultVariants: {
		variant: "p",
		weight: "normal",
	},
});

type VariantPropType = VariantProps<typeof typographyVariants>;

const variantElementMap: Record<
	NonNullable<VariantPropType["variant"]>,
	string
> = {
	h1: "h1",
	h2: "h2",
	h3: "h3",
	h4: "h4",
	h5: "h5",
	h6: "h6",
	p: "p",
	blockquote: "blockquote",
	code: "code",
	lead: "p",
	large: "div",
	small: "small",
	extraSmall: "p",
	muted: "p",
	regular: "div",
};

type TextElement =
	| "h1"
	| "h2"
	| "h3"
	| "h4"
	| "p"
	| "blockquote"
	| "code"
	| "small"
	| "div";

export interface TypographyProps
	extends React.HTMLAttributes<HTMLElement>,
		VariantProps<typeof typographyVariants> {
	asChild?: boolean;
	as?: TextElement;
}

/**
 * Text component that renders different HTML elements based on the variant prop.
 * It uses class-variance-authority for styling and supports asChild prop for rendering
 * as a different component.
 *
 * @param {string} className - Additional class names to apply to the component.
 * @param {string} variant - Variant of the text (e.g., h1, h2, p, etc.).
 * @param {string} as - The HTML element to render (e.g., 'h1', 'p', etc.).
 * @param {boolean} asChild - If true, renders the component as a child of another component.
 * @param {object} props - Additional props to pass to the component.
 */
function Typography({
	className,
	variant,
	as,
	asChild = false,
	...props
}: React.ComponentProps<TextElement> & TypographyProps) {
	const Comp = asChild
		? SlotPrimitive
		: (as ?? (variant ? variantElementMap[variant] : undefined) ?? "div");
	return (
		<Comp
			data-slot="text"
			className={cn(typographyVariants({ variant, className }))}
			{...props}
		/>
	);
}

export { Typography, typographyVariants as textVariants };
