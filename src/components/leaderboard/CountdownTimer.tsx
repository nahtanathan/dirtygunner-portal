// FILE: src/components/leaderboard/CountdownTimer.tsx

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

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
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

  const dangerLevel = useMemo(() => {
    if (!isMounted) return "normal";
    if (displayTime.totalMs <= 60_000) return "critical";
    if (displayTime.totalMs <= 5 * 60_000) return "warning";
    return "normal";
  }, [displayTime.totalMs, isMounted]);

  const items = useMemo(() => {
    const base = [
      { key: "days", short: "d", value: displayTime.days },
      { key: "hours", short: "h", value: displayTime.hours },
      { key: "minutes", short: "m", value: displayTime.minutes },
      { key: "seconds", short: "s", value: displayTime.seconds },
    ];

    if (displayTime.days <= 0) {
      return base.filter((item) => item.key !== "days");
    }

    return base;
  }, [displayTime.days, displayTime.hours, displayTime.minutes, displayTime.seconds]);

  const statusText = useMemo(() => {
    if (!isMounted) return "Live";
    if (displayTime.totalMs <= 0) return "Ended";
    if (dangerLevel === "critical") return "Ending Now";
    if (dangerLevel === "warning") return "Ending Soon";
    return "Live";
  }, [dangerLevel, displayTime.totalMs, isMounted]);

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div
        className="rounded-2xl border px-5 py-5 md:px-8 md:py-6"
        style={{
          borderColor: "rgba(239, 68, 68, 0.28)",
          background:
            "linear-gradient(180deg, rgba(12, 18, 30, 0.92) 0%, rgba(8, 12, 24, 0.96) 100%)",
          boxShadow:
            dangerLevel === "critical"
              ? "0 0 30px rgba(239,68,68,0.18)"
              : dangerLevel === "warning"
                ? "0 0 24px rgba(245,158,11,0.14)"
                : "0 0 20px rgba(59,130,246,0.10)",
        }}
      >
        <div className="text-center">
          <div className="text-[0.68rem] font-black uppercase tracking-[0.35em] text-white/45">
            Leaderboard Reset
          </div>

          <div
            className={cx(
              "mt-2 text-sm font-bold uppercase tracking-[0.28em]",
              dangerLevel === "critical" && "text-red-500",
              dangerLevel === "warning" && "text-amber-400",
              dangerLevel === "normal" && "text-sky-300",
            )}
          >
            {statusText}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-3 md:gap-4">
          {items.map((item, index) => (
            <div key={item.key} className="flex items-end justify-center gap-2">
              <div
                className={cx(
                  "font-mono text-2xl font-black leading-none md:text-3xl",
                  dangerLevel === "critical" && item.key === "seconds" && "text-red-500",
                  dangerLevel === "warning" && item.key === "seconds" && "text-amber-400",
                  !(dangerLevel === "critical" || dangerLevel === "warning") && "text-white",
                )}
                style={{
                  textShadow:
                    dangerLevel === "critical" && item.key === "seconds"
                      ? "0 0 10px rgba(239,68,68,0.45)"
                      : dangerLevel === "warning" && item.key === "seconds"
                        ? "0 0 10px rgba(245,158,11,0.35)"
                        : "0 0 12px rgba(255,255,255,0.12)",
                }}
              >
                {String(item.value).padStart(2, "0")}
              </div>

              <div className="pb-0.5 text-xs font-black uppercase tracking-[0.22em] text-white/45 md:text-sm">
                {item.short}
              </div>

              {index < items.length - 1 && (
                <div className="pb-0.5 font-mono text-xl font-black text-white/20 md:text-2xl">
                  :
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}