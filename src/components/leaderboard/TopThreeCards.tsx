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
          "relative flex overflow-hidden rounded-[28px] border",
          featured ? "min-h-[420px] p-7 md:min-h-[460px]" : "min-h-[380px] p-6",
        )}
        style={{
          borderColor: "var(--border-subtle)",
          background:
            "linear-gradient(180deg, rgba(25,31,40,0.98), rgba(14,18,24,0.98))",
          boxShadow: featured
            ? "0 0 42px rgba(109,143,179,0.14)"
            : "0 12px 40px rgba(0,0,0,0.5)",
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: "transform 0.15s ease",
        }}
      >
        <div className="absolute inset-x-0 top-0 h-[46%] overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${getCardArt(place)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: place === 1 ? 0.34 : 0.24,
              filter: "saturate(0.65) brightness(0.88)",
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                place === 1
                  ? "linear-gradient(180deg, rgba(109,143,179,0.16), rgba(14,18,24,0.84))"
                  : "linear-gradient(180deg, rgba(127,147,171,0.10), rgba(14,18,24,0.92))",
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.05), transparent 70%)",
              opacity: glow.on ? 0.4 : 0.16,
            }}
          />
        </div>

        <div className="pointer-events-none absolute left-5 top-5 z-20 text-white/90">
          {icon}
        </div>

        <div className="pointer-events-none absolute right-5 top-5 z-20 text-sm font-semibold text-white/40">
          #{place}
        </div>

        <div className="pointer-events-none absolute left-1/2 top-8 z-20 -translate-x-1/2">
          <div
            className={clsx("relative", featured ? "h-40 w-40" : "h-32 w-32")}
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
            top: place === 1 ? "170px" : "142px",
          }}
        >
          <div className="text-center">
            <div className="text-[10px] font-bold uppercase tracking-[0.26em] text-white/40">
              Payout
            </div>
            <div
              className={clsx(
                "mt-1 font-black leading-none",
                featured ? "text-[24px]" : "text-[20px]",
              )}
              style={{
                color: place === 1 ? "#c7d3df" : "#e6eaf2",
                textShadow:
                  place === 1 ? "0 0 10px rgba(199,211,223,0.18)" : "none",
              }}
            >
              ${prizeValue.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="relative z-10 flex w-full flex-col justify-end">
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%]"
            style={{
              background:
                "linear-gradient(180deg, rgba(5,8,18,0) 0%, rgba(5,8,18,0.10) 20%, rgba(5,8,18,0.35) 45%, rgba(5,8,18,0.55) 65%, rgba(5,8,18,0.65) 75%, rgba(5,8,18,0.50) 85%, rgba(5,8,18,0.25) 92%, rgba(5,8,18,0.0) 100%)",
            }}
          />

          <div
            className="relative z-10 w-full pt-[180px]"
            style={{
              transform: "translateZ(24px)",
              marginTop: "auto",
            }}
          >
            <div className="pb-2">
              <div
                className={clsx(
                  "font-black uppercase text-white",
                  featured ? "text-[36px]" : "text-[30px]",
                )}
              >
                {player.username}
              </div>

              <div className="mt-3 text-xs uppercase tracking-[0.3em] text-white/40">
                Wagered
              </div>

              <div
                className={clsx(
                  "mt-1 font-black",
                  featured ? "text-[36px]" : "text-[30px]",
                )}
                style={{
                  color: "#aebdcb",
                  textShadow: "0 0 12px rgba(174,189,203,0.10)",
                }}
              >
                ${wagerValue.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getCardArt(place: number) {
  if (place === 1) return "/art/top1.jpg";
  if (place === 2) return "/art/top2.jpg";
  return "/art/top3.jpg";
}

function getPrizeForPlace(place: Place) {
  if (place === 1) return 300;
  if (place === 2) return 200;
  return 150;
}