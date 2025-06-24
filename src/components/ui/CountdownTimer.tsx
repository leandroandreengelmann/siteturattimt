"use client";

import React, { useState, useEffect } from "react";
import { ClockIcon } from "@heroicons/react/24/outline";

interface CountdownTimerProps {
  endDate: string;
  size?: "small" | "medium" | "large";
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({
  endDate,
  size = "medium",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const calculateTimeLeft = () => {
      const endTime = new Date(endDate).getTime();
      const now = new Date().getTime();
      const difference = endTime - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
        setIsExpired(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
      }
    };

    // Calcular imediatamente
    calculateTimeLeft();

    // Atualizar a cada segundo
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  // Estilos baseados no tamanho
  const sizeClasses = {
    small: {
      container: "px-2 py-1 text-xs",
      icon: "w-3 h-3",
      text: "text-xs",
    },
    medium: {
      container: "px-3 py-1.5 text-sm",
      icon: "w-4 h-4",
      text: "text-sm",
    },
    large: {
      container: "px-4 py-3 text-base",
      icon: "w-5 h-5",
      text: "text-base",
    },
  };

  const classes = sizeClasses[size];

  // Evitar problemas de hidratação
  if (!isMounted) {
    return (
      <div
        className={`bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg ${classes.container} flex items-center justify-center gap-1 shadow-lg max-w-full overflow-hidden`}
      >
        <ClockIcon className={`${classes.icon} text-white flex-shrink-0`} />
        <div
          className={`${classes.text} text-white font-bold flex-1 text-center`}
        >
          <span className="font-mono font-black tracking-tight whitespace-nowrap">
            00:00:00
          </span>
        </div>
      </div>
    );
  }

  // Se a promoção já expirou, não mostrar o contador
  if (isExpired) {
    return null;
  }

  return (
    <div
      className={`bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg ${classes.container} flex items-center justify-center gap-1 shadow-lg animate-pulse max-w-full overflow-hidden`}
    >
      <ClockIcon className={`${classes.icon} text-white flex-shrink-0`} />
      <div
        className={`${classes.text} text-white font-bold flex-1 text-center`}
      >
        {timeLeft.days > 0 && (
          <span className="font-black">{timeLeft.days}d </span>
        )}
        <span className="font-mono font-black tracking-tight whitespace-nowrap">
          {String(timeLeft.hours).padStart(2, "0")}:
          {String(timeLeft.minutes).padStart(2, "0")}:
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
