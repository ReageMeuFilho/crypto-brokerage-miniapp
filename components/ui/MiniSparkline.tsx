"use client";

import { useMemo } from "react";

interface MiniSparklineProps {
  data: number[];
  isPositive: boolean;
}

export function MiniSparkline({ data, isPositive }: MiniSparklineProps) {
  const path = useMemo(() => {
    if (!data || data.length === 0) return "";

    const width = 80;
    const height = 40;
    const padding = 2;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    });

    return `M ${points.join(" L ")}`;
  }, [data]);

  const color = isPositive ? "#10b981" : "#ef4444";

  return (
    <svg width="80" height="40" viewBox="0 0 80 40" className="w-full h-full">
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

