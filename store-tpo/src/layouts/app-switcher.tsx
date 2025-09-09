"use client";

import * as React from "react";

import MyIcon from "@/assets/images/app-logo.svg";
import { Typography } from "@/components/typography/typography";
import {
	DropdownMenu,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";

export function AppSwitcher({
	apps,
}: {
	apps: {
		name: string;
		logo: string;
	}[];
}) {
	// const [activeApp, setActiveApp] = React.useState(apps[0] ?? null);
	const [activeApp] = React.useState(apps[0] ?? null);
	if (!apps.length) return null;

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground gap-3 [&>svg]:size-auto"
						>
							{/* <div className="flex aspect-square size-9 items-center justify-center rounded-md overflow-hidden bg-sidebar-primary text-sidebar-primary-foreground relative after:rounded-[inherit] after:absolute after:inset-0 after:shadow-[0_1px_2px_0_rgb(0_0_0/.05),inset_0_1px_0_0_rgb(255_255_255/.12)] after:pointer-events-none">
								{activeApp && (
									<img
										src={activeApp.logo}
										width={36}
										height={36}
										alt={activeApp.name}
									/>
								)}
							</div> */}
							<div className="flex pl-1 transition-[padding] duration-200 ease-in-out">
								<Link className="group/logo inline-flex" to="/">
									<img
										src={MyIcon}
										alt="App logo"
										className="size-10 group-data-[collapsible=icon]:size-6 transition-[width,height] duration-200 ease-in-out"
									/>
								</Link>
							</div>
							<div className="group-data-[collapsible=icon]:hidden flex-1 text-center">
								<Typography variant="h3" className="truncate tracking-wide">
									{activeApp?.name ?? "Selecciona una app"}
								</Typography>
							</div>
							{/* <ChevronDown
								className="ms-auto text-sidebar-foreground/50"
								size={20}
								aria-hidden="true"
							/> */}
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					{/* <DropdownMenuContent
						className="dark w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-md"
						align="start"
						side="bottom"
						sideOffset={4}
					>
						<DropdownMenuLabel className="uppercase text-muted-foreground/70 text-xs">
							Apps
						</DropdownMenuLabel>
						{apps.map((app, index) => (
							<DropdownMenuItem
								key={app.name}
								onClick={() => setActiveApp(app)}
								className="gap-2 p-2"
							>
								<div className="flex size-6 items-center justify-center rounded-md overflow-hidden">
									<img src={app.logo} width={36} height={36} alt={app.name} />
								</div>
								{app.name}
								<DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
							</DropdownMenuItem>
						))}
						<DropdownMenuSeparator />
						<DropdownMenuItem className="gap-2 p-2">
							<Plus className="opacity-60" size={16} aria-hidden="true" />
							<div className="font-medium">Agregar app</div>
						</DropdownMenuItem>
					</DropdownMenuContent> */}
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
