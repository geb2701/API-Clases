import { cn } from "@/lib/utils";
import useTheme from "@/hooks/use-theme";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
};

const sizeMap = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
};

export const Logo = ({ size = "md", showText = true, className }: LogoProps) => {
  const { theme } = useTheme();

  // Resolver tema actual (dark/light/system)
  const resolvedTheme =
    theme === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
      : theme;

  // Según tema: blanco o negro
  const logoColor = resolvedTheme === "dark" ? "invert" : "invert-0";
  const textColor = resolvedTheme === "dark" ? "text-white" : "text-black";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img
        src="/Logo.svg"
        alt="ChangoClick"
        className={cn(sizeMap[size], "block object-contain", logoColor)}
        draggable={false}
        aria-hidden={!showText}
      />

      {showText && (
        <span className="select-none font-bold leading-none">
          <span className={textColor}>Chango</span>
          <span className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
            Click
          </span>
        </span>
      )}
    </div>
  );
}
