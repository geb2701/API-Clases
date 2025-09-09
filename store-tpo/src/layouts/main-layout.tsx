import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "@tanstack/react-router";
import { AppSidebar } from "./app-sidebar";
import { Breadcrumbs } from "./breadcrumbs";

const MainLayout = () => {
	return (
		<SidebarProvider defaultOpen={true}>
			<AppSidebar />
			<SidebarInset>
				<div className="px-4 md:px-6 lg:px-8 @container">
					<div className="w-full max-w-full mx-auto">
						<header className="flex flex-wrap gap-3 min-h-16 pt-4 pb-3 shrink-0 items-center transition-all ease-linear border-b">
							{/* Left side */}
							<div className="flex flex-1 items-center gap-2">
								<SidebarTrigger className="-ms-1" />
								<div className="max-lg:hidden lg:contents">
									<Separator
										orientation="vertical"
										className="me-2 data-[orientation=vertical]:h-4"
									/>
									<Breadcrumbs />
								</div>
							</div>
							{/* Right side */}
							{/* <ActionButtons /> */}
						</header>
						<div className="overflow-hidden">
							<Outlet />
						</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default MainLayout;
