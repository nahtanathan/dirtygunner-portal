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
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(target));
    }, 250);

    return () => clearInterval(timer);
  }, [target]);

  const dangerLevel = useMemo(() => {
    if (timeLeft.totalMs <= 60_000) return "critical";
    if (timeLeft.totalMs <= 5 * 60_000) return "warning";
    return "normal";
  }, [timeLeft.totalMs]);

  const items = useMemo(
    () => [
      { label: "Days", value: timeLeft.days },
      { label: "Hours", value: timeLeft.hours },
      { label: "Minutes", value: timeLeft.minutes },
      { label: "Seconds", value: timeLeft.seconds },
    ],
    [timeLeft]
  );

  return (
    <section
      className="relative overflow-hidden rounded-[28px] border p-5 md:p-6"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        background:
          "linear-gradient(180deg, rgba(11,11,13,0.98) 0%, rgba(6,6,8,0.99) 100%)",
        boxShadow:
          "0 24px 60px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at top left, rgba(255,255,255,0.045), transparent 22%), radial-gradient(circle at top right, rgba(239,68,68,0.08), transparent 24%), linear-gradient(180deg, rgba(255,255,255,0.015), transparent 22%, transparent 78%, rgba(255,255,255,0.01))",
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />

      <div className="relative z-10">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={cx(
                  "h-2.5 w-2.5 rounded-full",
                  dangerLevel === "critical"
                    ? "animate-pulse bg-red-500 shadow-[0_0_14px_rgba(239,68,68,0.95)]"
                    : dangerLevel === "warning"
                    ? "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.75)]"
                    : "bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.55)]"
                )}
              />
              <div
                className="text-xs font-semibold uppercase tracking-[0.34em]"
                style={{ color: "#EF4444" }}
              >
                Armed Countdown
              </div>
            </div>

            <h3
              className="mt-2 text-2xl font-black uppercase tracking-[0.08em] md:text-3xl"
              style={{ color: "var(--text-primary)" }}
            >
              Final Sequence
            </h3>
          </div>

          <p
            className="max-w-xl text-sm md:text-base"
            style={{ color: "var(--text-secondary)" }}
          >
            
          </p>
        </div>

        <div
          className={cx(
            "rounded-[24px] border p-3 md:p-4",
            dangerLevel === "critical" && "animate-[pulse_1s_ease-in-out_infinite]"
          )}
          style={{
            borderColor:
              dangerLevel === "critical"
                ? "rgba(239,68,68,0.28)"
                : "rgba(255,255,255,0.08)",
            background:
              "linear-gradient(180deg, rgba(4,4,5,0.98), rgba(8,8,10,0.98))",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.03), inset 0 0 30px rgba(255,0,0,0.04), 0 14px 30px rgba(0,0,0,0.3)",
          }}
        >
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.label}
                className={cx(
                  "relative overflow-hidden rounded-[22px] border p-4 md:p-5",
                  dangerLevel === "critical" &&
                    item.label === "Seconds" &&
                    "animate-[pulse_0.8s_ease-in-out_infinite]"
                )}
                style={{
                  borderColor:
                    dangerLevel === "critical"
                      ? "rgba(239,68,68,0.18)"
                      : "rgba(255,255,255,0.07)",
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.96), rgba(10,10,12,0.98))",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.02), inset 0 0 28px rgba(255,0,0,0.05), 0 12px 26px rgba(0,0,0,0.24)",
                }}
              >
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent_30%,transparent_70%,rgba(255,255,255,0.015))]" />
                <div className="pointer-events-none absolute inset-x-3 top-1/2 h-px -translate-y-1/2 bg-red-900/25" />

                <div
                  className={cx(
                    "relative font-mono text-[36px] font-black leading-none tracking-[0.08em] md:text-[48px]",
                    dangerLevel === "critical" && item.label === "Seconds"
                      ? "animate-[pulse_0.75s_ease-in-out_infinite]"
                      : undefined
                  )}
                  style={{
                    color: "#EF4444",
                    textShadow:
                      dangerLevel === "critical"
                        ? "0 0 18px rgba(239,68,68,1), 0 0 34px rgba(239,68,68,0.45)"
                        : "0 0 12px rgba(239,68,68,0.85), 0 0 24px rgba(239,68,68,0.25)",
                  }}
                >
                  {String(item.value).padStart(2, "0")}
                </div>

                <div
                  className="relative mt-3 text-[10px] font-bold uppercase tracking-[0.34em]"
                  style={{ color: "var(--text-muted)" }}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="flex gap-1.5">
              <span className="block h-1.5 w-10 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
              <span
                className={cx(
                  "block h-1.5 w-10 rounded-full",
                  dangerLevel !== "normal"
                    ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]"
                    : "bg-white/5"
                )}
              />
              <span
                className={cx(
                  "block h-1.5 w-10 rounded-full",
                  dangerLevel === "critical"
                    ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]"
                    : "bg-white/5"
                )}
              />
            </div>

            <div
              className="text-[10px] font-semibold uppercase tracking-[0.28em]"
              style={{ color: "#6B7280" }}
            >
              {timeLeft.totalMs <= 0 ? "Sequence Ended" : "System Live"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}