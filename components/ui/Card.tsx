import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  onClick?: () => void;
}

export function Card({ children, className, padding = "md", onClick }: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700",
        paddingClasses[padding],
        onClick && "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

