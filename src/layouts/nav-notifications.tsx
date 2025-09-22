import { Button } from "@/components/ui/button";
import { Bell, BellRing } from "lucide-react";
import { useState } from "react";

const NavNotification = () => {
	const [isRinging, setIsRinging] = useState(false);

	const toggleIcon = () => {
		setIsRinging((prev) => !prev);
	};

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={toggleIcon}
			onKeyUp={(e) => e.key === "Enter" && toggleIcon()}
			className=""
		>
			{isRinging ? <BellRing /> : <Bell />}
		</Button>
	);
};

export default NavNotification;
