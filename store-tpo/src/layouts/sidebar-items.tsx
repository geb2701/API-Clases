import { ChevronRight, type LucideIcon } from "lucide-react";

import { Typography } from "@/components/typography/typography";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	useSidebar,
} from "@/components/ui/sidebar";
import { useAuthContext } from "@/contexts/auth-context";
import { Link } from "@tanstack/react-router";
import React from "react";
import { SidebarSearchStore } from "./storage/sidebar-search-store";

export interface SidebarItem {
	title: string;
	url?: string;
	icon?: LucideIcon;
	isActive?: boolean;
	items?: SidebarItem[];
	isCollapsible?: boolean;
}

interface NavMainProps {
	items: SidebarItem[];
	level?: number;
}

// Helper to check if an item or its descendants are enabled
const isEnabled = (
	navegationItem: SidebarItem,
	haveAccessRoute: (route: string) => boolean,
): boolean => {
	if (navegationItem.url) {
		return haveAccessRoute(navegationItem.url);
	}
	if (navegationItem.items) {
		return navegationItem.items.some((subAction) => {
			if (subAction.url) {
				return haveAccessRoute(subAction.url);
			}
			if (subAction.items) {
				return isEnabled(subAction, haveAccessRoute);
			}
			return false;
		});
	}
	return true;
};

// Helper to check if an item or its descendants are matched
const isFilter = (navegationItem: SidebarItem, filter: string): boolean => {
	const compare = (x: string) => x.toLowerCase().includes(filter.toLowerCase());
	if (filter === "") {
		return true;
	}
	if (compare(navegationItem.title)) {
		return true;
	}
	if (navegationItem.items) {
		return navegationItem.items.some((subAction) => {
			return isFilter(subAction, filter);
		});
	}
	return false;
};

// Extract hash if present
const getHash = (url?: string) =>
	url?.includes("#") ? url.substring(url.indexOf("#") + 1) : undefined;
const getCleanedUrl = (url?: string) =>
	url?.includes("#") ? url.substring(0, url.indexOf("#")) : url;

export const SidebarItems = ({ items, level = 0 }: NavMainProps) => {
	const { haveAccessRoute } = useAuthContext();
	const { filterValue } = SidebarSearchStore();

	const aux = items.filter((x) => isFilter(x, filterValue));
	const itemsFilter = aux.length > 0 || level === 0 ? aux : items;

	return (
		<>
			{/* <AnimatePresence> */}
			{
				//hacemos primero el filtrado por el filtro que es menos costoso
				itemsFilter
					.filter((x) => isEnabled(x, haveAccessRoute)) // Replace with actual access check if needed
					.map((item) => (
						//   <motion.div
						//     key={item.title}
						//     /* initial={{ opacity: 0, scale: 0.9 }}
						//  animate={{ opacity: 1, scale: 1 }}
						//  exit={{ opacity: 0, scale: 0.9 }}
						//  transition={{ duration: 0.2 }} */
						//     initial={{ opacity: 0, y: 10, scale: 0.95 }}
						//     animate={{ opacity: 1, y: 0, scale: 1 }}
						//     exit={{ opacity: 0, y: -10, scale: 0.9 }}
						//     transition={{ duration: 0.3, ease: "easeInOut" }}
						//     layout>
						<NavItem key={item.title} item={item} level={level + 1} />
						// </motion.div>
					))
			}
			{/* </AnimatePresence> */}
		</>
	);
};

const NavItem = ({ item, level }: { item: SidebarItem; level: number }) => {
	if (item.items && item.items.length > 0) {
		return <GroupItem item={item} level={level + 1} />;
	}
	return <MenuItem item={item} />;
};

const GroupItem = ({ item, level }: { item: SidebarItem; level: number }) => {
	const [isOpen, setIsOpen] = React.useState(item.isActive ?? false);
	const { state, toggleSidebar } = useSidebar();

	const setIsOpenController = (x: boolean) => {
		if (state === "collapsed") {
			toggleSidebar();
			setIsOpen(true);
		} else {
			setIsOpen(x);
		}
	};

	if (level === 2) {
		if (item.isCollapsible && state === "expanded") {
			return (
				<Collapsible
					open={isOpen}
					onOpenChange={setIsOpenController}
					className={"group/collapsible"}
				>
					<SidebarGroup>
						<SidebarGroupLabel
							className="uppercase text-muted-foreground/65"
							asChild
						>
							<CollapsibleTrigger className="flex w-full items-center justify-between">
								{item.title}
								<ChevronRight
									size={20}
									aria-hidden="true"
									className={`ml-auto transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
								/>
							</CollapsibleTrigger>
						</SidebarGroupLabel>
						{/* <AnimatePresence initial={false}> */}
						{isOpen && (
							<CollapsibleContent forceMount>
								<SidebarGroupContent>
									{item.items && (
										<SidebarItems items={item.items} level={level + 1} />
									)}
								</SidebarGroupContent>
							</CollapsibleContent>
						)}
						{/* </AnimatePresence> */}
					</SidebarGroup>
				</Collapsible>
			);
		}
		return (
			<SidebarGroup className="pb-0">
				{item.title && (
					<SidebarGroupLabel className="uppercase text-muted-foreground/65 mb-2 font-semibold">
						{item.title}
					</SidebarGroupLabel>
				)}
				<SidebarGroupContent>
					{item.items && <SidebarItems items={item.items} level={level + 1} />}
				</SidebarGroupContent>
			</SidebarGroup>
		);
	}
	return (
		<SidebarMenu>
			<Collapsible
				asChild
				open={isOpen}
				onOpenChange={setIsOpenController}
				className={"group/collapsible"}
			>
				<SidebarMenuItem>
					<CollapsibleTrigger asChild>
						<SidebarMenuButton
							className="group/menu-button group-data-[collapsible=icon]:px-[5px]! font-medium gap-1 h-9 [&>svg]:size-auto"
							tooltip={item.title}
							isActive={item.isActive}
						>
							{item.icon && (
								<item.icon
									aria-hidden="true"
									className="text-muted-foreground/65 group-data-[active=true]/menu-button:text-primary pr-1"
									size={20}
								/>
							)}
							<Typography variant="small" className="truncate">
								{item.title}
							</Typography>
							<ChevronRight
								size={18}
								aria-hidden="true"
								className={
									"ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 text-sidebar-foreground/50"
								}
							/>
						</SidebarMenuButton>
					</CollapsibleTrigger>
					{/* <AnimatePresence initial={false}> */}
					{isOpen && (
						<CollapsibleContent forceMount>
							<SidebarMenuSub>
								{item.items && (
									<SidebarItems items={item.items} level={level + 1} />
								)}
							</SidebarMenuSub>
						</CollapsibleContent>
					)}
					{/* </AnimatePresence> */}
				</SidebarMenuItem>
			</Collapsible>
		</SidebarMenu>
	);
};

const MenuItem = ({ item }: { item: SidebarItem }) => {
	const { url, title, icon: Icon } = item;
	const hash = getHash(url);
	const cleanedUrl = getCleanedUrl(url);
	const includeHash = !!hash;

	const { toggleSidebar, state } = useSidebar();
	const handleClick = () => {
		if (state === "expanded") {
			toggleSidebar();
		}
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<Link
					onClick={handleClick}
					to={cleanedUrl}
					hash={hash}
					activeOptions={{ exact: true, includeHash }}
				>
					{({ isActive }) => (
						<SidebarMenuButton
							isActive={isActive}
							className="group/menu-button group-data-[collapsible=icon]:px-[5px]! font-medium gap-3 h-9 [&>svg]:size-auto"
							tooltip={title}
						>
							{Icon && (
								<Icon
									aria-hidden="true"
									className="text-muted-foreground/65 group-data-[active=true]/menu-button:text-primary"
									size={22}
								/>
							)}
							<span>{title}</span>
						</SidebarMenuButton>
					)}
				</Link>
			</SidebarMenuItem>
		</SidebarMenu>
	);
};
