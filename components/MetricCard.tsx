"use client";

import { useEffect, useState } from "react";

interface MetricCardProps {
  title: string;
  value: string;
  percentChange?: string;
  delay?: number;
}

export default function MetricCard({
  title,
  value,
  percentChange,
  delay = 0,
}: MetricCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;

    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
    if (isNaN(numericValue)) {
      setDisplayValue(value);
      return;
    }

    const duration = 1000;
    const steps = 30;
    const increment = numericValue / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, numericValue);

      if (value.includes("$")) {
        setDisplayValue(`$${current.toFixed(2)}`);
      } else if (value.includes("%")) {
        setDisplayValue(`${current.toFixed(1)}%`);
      } else {
        setDisplayValue(Math.round(current).toLocaleString());
      }

      if (step >= steps) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div
      className={`metric-card ${isVisible ? "metric-card-visible" : ""}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="metric-card-header">{title}</div>
      <div className="metric-card-value">{displayValue}</div>
      {percentChange && (
        <div className="metric-card-change">{percentChange}</div>
      )}
    </div>
  );
}
