import { ReactNode } from "react";

interface FloatingActionButtonProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  variant?: "primary" | "success" | "error" | "neutral";
}

export function FloatingActionButton({
  icon,
  label,
  onClick,
  variant = "neutral",
}: FloatingActionButtonProps) {
  const variantClasses = {
    primary: "bg-primary-500 text-white",
    success: "bg-success-500 text-white",
    error: "bg-error-500 text-white",
    neutral: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
  };

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 min-w-[64px]"
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-soft ${variantClasses[variant]} transition-transform hover:scale-105 active:scale-95`}
      >
        {icon}
      </div>
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
        {label}
      </span>
    </button>
  );
}
