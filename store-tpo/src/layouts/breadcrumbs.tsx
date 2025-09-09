import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Link, isMatch, useMatches } from "@tanstack/react-router";
import React from "react";

export function Breadcrumbs() {
	const matches = useMatches();
	const matchesWithCrumbs = matches.filter((match) =>
		isMatch(match, "loaderData.crumb"),
	);

	const items = matchesWithCrumbs.map(({ pathname, loaderData }) => {
		return {
			href: pathname,
			label: loaderData?.crumb,
		};
	});
	/*
	console.log("matches: ", matches.map(m => ({
	pathname: m.pathname,
	crumb: m.loaderData?.crumb,
	routeId: m.routeId,
	})));*/

	return (
		<Breadcrumb>
			<BreadcrumbList className="p-0">
				<BreadcrumbItem className="hidden md:block">
					<BreadcrumbLink asChild>
						<Link to="/"> Inicio </Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator className="hidden md:block" />
				{items.map((item, index) => (
					<React.Fragment key={item.href}>
						<BreadcrumbItem key={`breadcrumb-item-${item.href}`}>
							<BreadcrumbLink asChild>
								<Link to={item.href}> {item.label} </Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						{index < items.length - 1 && (
							<BreadcrumbSeparator
								key={`breadcrumb-separator-${item.href}`}
								className="hidden md:block"
							/>
						)}
					</React.Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
