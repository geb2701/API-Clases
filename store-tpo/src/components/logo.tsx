import React, { useEffect, useState } from "react";
import useTheme from "@/hooks/use-theme";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  size = "md", 
  showText = true 
}) => {
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    const checkTheme = () => {
      if (theme === "dark") {
        setIsDark(true);
      } else if (theme === "light") {
        setIsDark(false);
      } else {
        // system theme
        setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
      }
    };
    
    checkTheme();
    
    // Escuchar cambios en el tema del sistema
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        checkTheme();
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme]);

  // Tamaños del logo
  const sizes = {
    sm: { width: 24, height: 24, textSize: "text-sm" },
    md: { width: 32, height: 32, textSize: "text-lg" },
    lg: { width: 48, height: 48, textSize: "text-2xl" }
  };

  const currentSize = sizes[size];

  // Colores para tema claro y oscuro
  const colors = {
    light: {
      monkey: "#1e293b", // slate-800
      cursor: "#1e293b", // slate-800
      chango: "#1e293b", // slate-800
      click: "url(#clickGradientLight)"
    },
    dark: {
      monkey: "#f1f5f9", // slate-100
      cursor: "#f1f5f9", // slate-100
      chango: "#f1f5f9", // slate-100
      click: "url(#clickGradientDark)"
    }
  };

  const currentColors = isDark ? colors.dark : colors.light;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Icono del mono */}
      <svg
        width={currentSize.width}
        height={currentSize.height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Definir gradientes */}
        <defs>
          <linearGradient id="clickGradientLight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" /> {/* pink-500 */}
            <stop offset="100%" stopColor="#f97316" /> {/* orange-500 */}
          </linearGradient>
          <linearGradient id="clickGradientDark" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f472b6" /> {/* pink-400 */}
            <stop offset="100%" stopColor="#fb923c" /> {/* orange-400 */}
          </linearGradient>
        </defs>

        {/* Cabeza del mono */}
        <circle
          cx="35"
          cy="35"
          r="18"
          fill="none"
          stroke={currentColors.monkey}
          strokeWidth="3"
        />
        
        {/* Orejas del mono */}
        <circle
          cx="25"
          cy="25"
          r="6"
          fill="none"
          stroke={currentColors.monkey}
          strokeWidth="2"
        />
        <circle
          cx="45"
          cy="25"
          r="6"
          fill="none"
          stroke={currentColors.monkey}
          strokeWidth="2"
        />
        
        {/* Ojos del mono */}
        <circle
          cx="30"
          cy="32"
          r="2"
          fill={currentColors.monkey}
        />
        <circle
          cx="40"
          cy="32"
          r="2"
          fill={currentColors.monkey}
        />
        
        {/* Nariz del mono */}
        <ellipse
          cx="35"
          cy="38"
          rx="1.5"
          ry="1"
          fill={currentColors.monkey}
        />
        
        {/* Boca del mono */}
        <path
          d="M 30 42 Q 35 45 40 42"
          fill="none"
          stroke={currentColors.monkey}
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Cuerpo del mono */}
        <ellipse
          cx="35"
          cy="65"
          rx="12"
          ry="15"
          fill="none"
          stroke={currentColors.monkey}
          strokeWidth="3"
        />
        
        {/* Brazo izquierdo del mono */}
        <path
          d="M 23 60 Q 15 55 12 65"
          fill="none"
          stroke={currentColors.monkey}
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Mano del mono con cursor */}
        <circle
          cx="12"
          cy="65"
          r="3"
          fill={currentColors.cursor}
        />
        
        {/* Cursor de computadora */}
        <path
          d="M 12 65 L 8 70 L 10 72 L 14 70 Z"
          fill={currentColors.cursor}
        />
        <path
          d="M 8 70 L 6 75 L 8 77 L 10 75 Z"
          fill={currentColors.cursor}
        />
      </svg>

      {/* Texto del logo */}
      {showText && (
        <div className={`font-bold ${currentSize.textSize} tracking-tight`}>
          <span className="text-foreground">Chango</span>
          <span 
            className={`bg-gradient-to-r bg-clip-text text-transparent ${
              isDark 
                ? "from-pink-400 to-orange-400" 
                : "from-pink-500 to-orange-500"
            }`}
          >
            Click
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
