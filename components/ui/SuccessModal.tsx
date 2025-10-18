"use client";

import { ReactNode } from "react";
import { X, CheckCircle } from "lucide-react";
import { Button } from "./Button";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function SuccessModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  actions,
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-soft-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Success icon */}
        <div className="flex justify-center pt-8 pb-4">
          <div className="w-16 h-16 rounded-full bg-success-50 dark:bg-success-900/20 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-success-500" />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {subtitle}
            </p>
          )}
          <div className="text-left">{children}</div>
          {actions && <div className="mt-6 space-y-3">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
