"use client";

import { CSSProperties, useEffect, useRef } from "react";
import { CountdownTimer } from "@/components/leaderboard/CountdownTimer";

type LeaderboardHeroSlabProps = {
  title: string;
  subtitle: string;
  prizePool: number;
  countdownTarget: string;
};

type CSSVarStyle = CSSProperties & {
  "--pointer-x"?: string;
  "--pointer-y"?: string;
  "--shimmer-x"?: string;
};

const platforms = [
  { label: "Roobet", active: true },
  { label: "Kick", active: false },
  { label: "Vault", active: false },
];

export function LeaderboardHeroSlab({
  title,
  subtitle,
  prizePool,
  countdownTarget,
}: LeaderboardHeroSlabProps) {
  const slabRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = slabRef.current;

    if (!node) return;

    let raf = 0;
    const current = { x: 50, y: 36, shimmer: 50 };
    const target = { x: 50, y: 36, shimmer: 50 };

    const tick = () => {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      current.shimmer += (target.shimmer - current.shimmer) * 0.06;

      node.style.setProperty("--pointer-x", `${current.x}%`);
      node.style.setProperty("--pointer-y", `${current.y}%`);
      node.style.setProperty("--shimmer-x", `${current.shimmer}%`);

      raf = window.requestAnimationFrame(tick);
    };

    const handleMove = (event: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      target.x = Math.min(100, Math.max(0, x));
      target.y = Math.min(100, Math.max(0, y));
      target.shimmer = Math.min(110, Math.max(-10, x));
    };

    const handleLeave = () => {
      target.x = 50;
      target.y = 36;
      target.shimmer = 50;
    };

    node.addEventListener("mousemove", handleMove);
    node.addEventListener("mouseleave", handleLeave);

    raf = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(raf);
      node.removeEventListener("mousemove", handleMove);
      node.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  const style: CSSVarStyle = {
    "--pointer-x": "50%",
    "--pointer-y": "36%",
    "--shimmer-x": "50%",
  };

  return (
    <section
      ref={slabRef}
      className="relative isolate overflow-hidden rounded-[32px] border border-white/8 px-6 py-6 shadow-[0_40px_90px_rgba(0,0,0,0.36)] sm:px-8 sm:py-8 lg:px-10 lg:py-10"
      style={style}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(32,39,52,0.82) 0%, rgba(17,22,29,0.96) 46%, rgba(10,14,20,1) 100%)",
        }}
      />

      <div className="absolute inset-0 metal-pattern opacity-[0.07]" />

      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(120% 75% at 50% 0%, rgba(255,255,255,0.07), transparent 38%), linear-gradient(180deg, rgba(255,255,255,0.028), transparent 22%, transparent 78%, rgba(0,0,0,0.18) 100%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.55]"
        style={{
          background:
            "repeating-linear-gradient(104deg, rgba(255,255,255,0.014) 0, rgba(255,255,255,0.014) 1px, transparent 1px, transparent 16px)",
          maskImage:
            "radial-gradient(48% 42% at var(--pointer-x) var(--pointer-y), rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.28) 34%, transparent 72%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.28]"
        style={{
          background:
            "linear-gradient(106deg, transparent 22%, rgba(255,255,255,0.055) 46%, rgba(255,255,255,0.015) 52%, transparent 70%)",
          transform: "translateX(calc((var(--shimmer-x) - 50%) * 0.22))",
          mixBlendMode: "screen",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          background:
            "radial-gradient(48% 22% at var(--pointer-x) var(--pointer-y), rgba(255,255,255,0.085), rgba(255,255,255,0.03) 26%, transparent 68%)",
          mixBlendMode: "screen",
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/12" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-black/40" />

      <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.72fr)] xl:items-end">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="vault-chip vault-chip-active">Soaked GG</span>
            <span className="vault-chip">Leaderboard</span>
          </div>

          <h1 className="mt-8 max-w-4xl font-display text-responsive-title font-semibold tracking-[-0.055em] text-[#f5f7fa]">
            {title}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-[#a1acb8] sm:text-lg">
            {subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-6">
            <div>
              <div className="vault-label">Prize pool</div>
              <div className="mt-3 font-display text-[2.75rem] font-semibold leading-none tracking-[-0.06em] text-[#f5f7fa] sm:text-[3.75rem]">
                {formatCurrency(prizePool)}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {platforms.map((platform) => (
                <span
                  key={platform.label}
                  className={platform.active ? "vault-chip vault-chip-active" : "vault-chip"}
                >
                  {platform.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <CountdownTimer target={countdownTarget} />
        </div>
      </div>
    </section>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
