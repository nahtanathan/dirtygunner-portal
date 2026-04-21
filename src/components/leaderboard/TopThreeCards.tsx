// FILE: src/components/leaderboard/TopThreeCards.tsx
"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Crown, Medal, ShieldCheck } from "lucide-react";
import clsx from "clsx";

type Player = {
  username: string;
  wageredTotal?: number;
  wager?: number;
  prize?: number;
};

type Place = 1 | 2 | 3;

type TopThreeCardsProps = {
  entries?: Player[];
  players?: Player[];
};

export function TopThreeCards({ entries, players }: TopThreeCardsProps) {
  const source = entries ?? players ?? [];

  const ordered = useMemo(() => {
    const safe = [...source].slice(0, 3);

    while (safe.length < 3) {
      safe.push({ username: "—", wageredTotal: 0, wager: 0, prize: 0 });
    }

    return {
      first: safe[0],
      second: safe[1],
      third: safe[2],
    };
  }, [source]);

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:items-end">
        <PlaceCard place={2} player={ordered.second} />
        <PlaceCard place={1} player={ordered.first} featured />
        <PlaceCard place={3} player={ordered.third} />
      </div>
    </section>
  );
}

function PlaceCard({
  place,
  player,
  featured = false,
}: {
  place: Place;
  player: Player;
  featured?: boolean;
}) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 20, on: false });

  const icon =
    place === 1 ? (
      <Crown size={20} />
    ) : place === 2 ? (
      <Medal size={20} />
    ) : (
      <ShieldCheck size={20} />
    );

  const wagerValue = player.wageredTotal ?? player.wager ?? 0;
  const prizeValue = player.prize ?? getPrizeForPlace(place);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    setTilt({
      rx: (0.5 - py) * (featured ? 10 : 7),
      ry: (px - 0.5) * (featured ? 10 : 7),
    });

    setGlow({ x: px * 100, y: py * 100, on: true });
  };

  const handleLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    setGlow((g) => ({ ...g, on: false }));
  };

  return (
    <div style={{ perspective: "1400px" }}>
      <div
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={clsx(
          "relative flex min-w-0 overflow-hidden rounded-[10px] border",
          featured
            ? "min-h-[360px] p-5 sm:min-h-[390px] sm:p-6 md:min-h-[460px] md:p-7"
            : "min-h-[330px] p-5 sm:min-h-[350px] sm:p-6 md:min-h-[380px]",
        )}
        style={{
          borderColor: "var(--border-subtle)",
          background:
            "linear-gradient(180deg, rgba(20,26,36,0.98), rgba(11,15,22,0.99))",
          boxShadow: featured
            ? "0 0 42px rgba(109,143,179,0.14)"
            : "0 12px 40px rgba(0,0,0,0.5)",
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: "transform 0.15s ease",
        }}
      >
        <div className="absolute inset-x-0 top-0 h-[50%] overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${getCardArt(place)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: place === 1 ? 0.3 : 0.22,
              filter: "saturate(0.62) brightness(0.82) blur(0.2px)",
              transform: "scale(1.02)",
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                place === 1
                  ? "linear-gradient(180deg, rgba(109,143,179,0.14) 0%, rgba(28,36,48,0.38) 34%, rgba(15,20,28,0.76) 68%, rgba(11,15,22,0.94) 100%)"
                  : "linear-gradient(180deg, rgba(127,147,171,0.08) 0%, rgba(24,31,42,0.34) 34%, rgba(14,18,25,0.80) 68%, rgba(11,15,22,0.95) 100%)",
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 18%, rgba(255,255,255,0.05), transparent 34%), linear-gradient(180deg, rgba(8,11,18,0.00) 0%, rgba(8,11,18,0.18) 55%, rgba(8,11,18,0.46) 100%)",
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.045), transparent 70%)",
              opacity: glow.on ? 0.32 : 0.12,
            }}
          />
        </div>

        <div className="pointer-events-none absolute left-5 top-5 z-20 text-white/90">
          {icon}
        </div>

        <div className="pointer-events-none absolute right-5 top-5 z-20 text-sm font-semibold text-white/40">
          #{place}
        </div>

        <div className="pointer-events-none absolute left-1/2 top-7 z-20 -translate-x-1/2 sm:top-8">
          <div
            className={clsx(
              "relative",
              featured
                ? "h-32 w-32 sm:h-36 sm:w-36 md:h-40 md:w-40"
                : "h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32",
            )}
            style={{
              filter: featured
                ? "drop-shadow(0 0 22px rgba(109,143,179,0.20))"
                : "drop-shadow(0 0 14px rgba(109,143,179,0.12))",
              transform: `translateZ(40px) scale(${glow.on ? 1.05 : 1})`,
              transition: "transform 0.2s ease",
            }}
          >
            <Image
              src="/brand/logo-mark.png"
              alt="DirtyGunner"
              fill
              className="object-contain"
              priority={place === 1}
            />
          </div>
        </div>

        <div
          className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2"
          style={{
            top: featured ? "162px" : "136px",
          }}
        >
          <div className="text-center">
            <div
              className={clsx(
                "whitespace-nowrap font-black leading-none",
                featured
                  ? "text-[20px] sm:text-[22px] md:text-[24px]"
                  : "text-[18px] sm:text-[19px] md:text-[20px]",
              )}
              style={{
                color: place === 1 ? "#c7d3df" : "#e6eaf2",
                textShadow:
                  place === 1 ? "0 0 10px rgba(199,211,223,0.18)" : "none",
              }}
            >
              $
              {prizeValue.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </div>
          </div>
        </div>

        <div className="relative z-10 flex w-full min-w-0 flex-col justify-end">
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[66%]"
            style={{
              background:
                "linear-gradient(180deg, rgba(6,9,16,0.00) 0%, rgba(6,9,16,0.10) 18%, rgba(6,9,16,0.24) 38%, rgba(6,9,16,0.42) 56%, rgba(6,9,16,0.62) 72%, rgba(6,9,16,0.82) 86%, rgba(6,9,16,0.96) 100%)",
            }}
          />

          <div
            className="relative z-10 w-full pt-[175px] sm:pt-[190px] md:pt-[205px]"
            style={{
              transform: "translateZ(24px)",
              marginTop: "auto",
            }}
          >
            <div className="pb-2 min-w-0">
              <div
                className={clsx(
                  "truncate font-black uppercase text-white",
                  featured
                    ? "text-[26px] sm:text-[30px] md:text-[36px]"
                    : "text-[22px] sm:text-[26px] md:text-[30px]",
                )}
              >
                {player.username}
              </div>

              <div className="mt-3 text-[10px] uppercase tracking-[0.3em] text-white/40 sm:text-xs">
                Wagered
              </div>

              <div
                className={clsx(
                  "mt-1 whitespace-nowrap font-black",
                  featured
                    ? "text-[26px] sm:text-[30px] md:text-[36px]"
                    : "text-[22px] sm:text-[26px] md:text-[30px]",
                )}
                style={{
                  color: "#aebdcb",
                  textShadow: "0 0 12px rgba(174,189,203,0.10)",
                }}
              >
                $
                {wagerValue.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getPrizeForPlace(place: Place) {
  if (place === 1) return 300;
  if (place === 2) return 200;
  return 150;
}

function getCardArt(place: Place) {
  if (place === 1) return "/images/leaderboard/top1-card-art.png";
  if (place === 2) return "/images/leaderboard/top2-card-art.png";
  return "/images/leaderboard/top3-card-art.png";
}
