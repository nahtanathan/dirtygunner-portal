"use client";

import { useEffect, useMemo, useState } from "react";

function getTimeLeft(target: string) {
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

export function CountdownTimer({ target }: { target: string }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(target));

  useEffect(() => {
    setTimeLeft(getTimeLeft(target));

    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(target));
    }, 1000);

    return () => clearInterval(timer);
  }, [target]);

  const dangerLevel = useMemo(() => {
    if (timeLeft.totalMs <= 60_000) return "critical";
    if (timeLeft.totalMs <= 5 * 60_000) return "warning";
    return "normal";
  }, [timeLeft.totalMs]);

  const items = useMemo(() => {
    const base = [
      { key: "days", short: "d", value: timeLeft.days },
      { key: "hours", short: "h", value: timeLeft.hours },
      { key: "minutes", short: "m", value: timeLeft.minutes },
      { key: "seconds", short: "s", value: timeLeft.seconds },
    ];

    if (timeLeft.days <= 0) {
      return base.filter((item) => item.key !== "days");
    }

    return base;
  }, [timeLeft]);

  const statusText = useMemo(() => {
    if (timeLeft.totalMs <= 0) return "Ended";
    if (dangerLevel === "critical") return "Ending Now";
    if (dangerLevel === "warning") return "Ending Soon";
    return "Live";
  }, [dangerLevel, timeLeft.totalMs]);

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <div
        className="rounded-2xl border px-4 py-3 md:px-5 md:py-4 text-center"
        style={{
          borderColor:
            dangerLevel === "critical"
              ? "rgba(239,68,68,0.24)"
              : dangerLevel === "warning"
              ? "rgba(251,191,36,0.18)"
              : "rgba(255,255,255,0.08)",
          background:
            "linear-gradient(180deg, rgba(11,11,13,0.92), rgba(6,6,8,0.96))",
          boxShadow:
            dangerLevel === "critical"
              ? "0 10px 30px rgba(0,0,0,0.35), 0 0 18px rgba(239,68,68,0.12), inset 0 1px 0 rgba(255,255,255,0.04)"
              : "0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* HEADER */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <span
              className={cx(
                "h-2 w-2 rounded-full",
                dangerLevel === "critical"
                  ? "animate-pulse bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.9)]"
                  : dangerLevel === "warning"
                  ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.75)]"
                  : "bg-red-600 shadow-[0_0_6px_rgba(220,38,38,0.5)]"
              )}
            />
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-400">
              Leaderboard Reset
            </span>
          </div>

          <div
            className={cx(
              "text-[10px] font-semibold uppercase tracking-[0.22em]",
              dangerLevel === "critical"
                ? "text-red-400"
                : dangerLevel === "warning"
                ? "text-amber-300"
                : "text-zinc-500"
            )}
          >
            {statusText}
          </div>
        </div>

        {/* TIMER */}
        <div className="mt-3 flex flex-wrap items-end justify-center gap-3 sm:gap-4">
          {items.map((item, index) => (
            <div key={item.key} className="flex items-end justify-center gap-2">
              <div
                className={cx(
                  "font-mono text-2xl font-black leading-none md:text-3xl",
                  dangerLevel === "critical" && item.key === "seconds"
                    ? "animate-pulse"
                    : undefined
                )}
                style={{
                  color:
                    dangerLevel === "warning" ? "#FBBF24" : "#EF4444",
                  textShadow:
                    dangerLevel === "critical" && item.key === "seconds"
                      ? "0 0 14px rgba(239,68,68,0.9)"
                      : "0 0 10px rgba(239,68,68,0.45)",
                }}
              >
                {String(item.value).padStart(2, "0")}
              </div>

              <div className="pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                {item.short}
              </div>

              {index < items.length - 1 && (
                <div className="pb-1 font-mono text-lg font-bold text-zinc-600 md:text-xl">
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