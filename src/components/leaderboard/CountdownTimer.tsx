"use client";

import { useEffect, useMemo, useState } from "react";

type TimeLeft = {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(target: string): TimeLeft {
  const diff = new Date(target).getTime() - Date.now();
  const safe = Math.max(diff, 0);

  return {
    totalMs: safe,
    days: Math.floor(safe / (1000 * 60 * 60 * 24)),
    hours: Math.floor((safe / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((safe / (1000 * 60)) % 60),
    seconds: Math.floor((safe / 1000) % 60),
  };
}

const PLACEHOLDER_TIME: TimeLeft = {
  totalMs: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

export function CountdownTimer({ target }: { target: string }) {
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(PLACEHOLDER_TIME);

  useEffect(() => {
    setIsMounted(true);

    const update = () => {
      setTimeLeft(getTimeLeft(target));
    };

    update();

    const timer = window.setInterval(update, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [target]);

  const displayTime = isMounted ? timeLeft : PLACEHOLDER_TIME;

  const items = useMemo(() => {
    const base = [
      { key: "days", label: "Days", value: displayTime.days },
      { key: "hours", label: "Hours", value: displayTime.hours },
      { key: "minutes", label: "Minutes", value: displayTime.minutes },
      { key: "seconds", label: "Seconds", value: displayTime.seconds },
    ];

    if (displayTime.days <= 0) {
      return base.filter((item) => item.key !== "days");
    }

    return base;
  }, [displayTime.days, displayTime.hours, displayTime.minutes, displayTime.seconds]);

  const statusText = useMemo(() => {
    if (!isMounted) return "Cycle active";
    if (displayTime.totalMs <= 0) return "Cycle closed";
    if (displayTime.totalMs <= 60_000) return "Closing now";
    if (displayTime.totalMs <= 5 * 60_000) return "Closing soon";
    return "Cycle active";
  }, [displayTime.totalMs, isMounted]);

  return (
    <div className="rounded-[24px] border border-white/8 bg-white/[0.025] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:px-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="vault-label">Countdown</div>
          <div className="mt-2 text-sm font-medium text-[#a1acb8]">{statusText}</div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-stretch sm:gap-3">
          {items.map((item) => (
            <div
              key={item.key}
              className="min-w-[76px] rounded-[18px] border border-white/7 bg-black/20 px-3 py-3 text-center"
            >
              <div className="font-display text-[1.5rem] font-semibold leading-none text-[#f5f7fa] sm:text-[1.7rem]">
                {String(item.value).padStart(2, "0")}
              </div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.24em] text-[#6f7986]">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
