"use client";

import { useMemo, useState } from "react";
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
      safe.push({ username: "-", wageredTotal: 0, wager: 0, prize: 0 });
    }

    return {
      first: safe[0],
      second: safe[1],
      third: safe[2],
    };
  }, [source]);

  return (
    <section className="w-full">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <div className="vault-label">Top 3</div>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.03em] text-[#f5f7fa] sm:text-3xl">
            Quiet at the top.
          </h2>
        </div>
        <div className="hidden text-sm text-[#6f7986] sm:block">Updated live as wagers settle.</div>
      </div>

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

  const wagerValue = player.wageredTotal ?? player.wager ?? 0;
  const prizeValue = player.prize ?? getPrizeForPlace(place);

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    setTilt({
      rx: (0.5 - py) * 4,
      ry: (px - 0.5) * 5,
    });
  };

  const handleLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <div className={clsx("md:relative", featured && "md:-translate-y-4")}>
      <div
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={clsx(
          "vault-panel-quiet panel-hover relative overflow-hidden rounded-[22px] border border-white/7 p-6",
          featured ? "min-h-[320px] sm:min-h-[340px]" : "min-h-[290px] sm:min-h-[300px]",
        )}
        style={{
          transform: `perspective(1400px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: "transform 180ms ease, border-color 220ms ease, box-shadow 220ms ease",
        }}
      >
        <div className="pointer-events-none absolute inset-0 metal-pattern opacity-[0.05]" />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[42%]"
          style={{
            background:
              featured
                ? "linear-gradient(180deg, rgba(199,207,218,0.08) 0%, rgba(199,207,218,0.02) 34%, transparent 100%)"
                : "linear-gradient(180deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.015) 36%, transparent 100%)",
          }}
        />

        <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f5f7fa]">
          #{place}
        </div>

        <div
          className={clsx(
            "absolute right-5 top-5 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em]",
            featured
              ? "border-[#c2a56c]/30 bg-[#c2a56c]/10 text-[#c2a56c]"
              : "border-white/10 bg-white/[0.03] text-[#a1acb8]",
          )}
        >
          {place === 1 ? "Lead" : place === 2 ? "Chasing" : "In reach"}
        </div>

        <div className="relative flex h-full flex-col justify-between">
          <div>
            <div className="vault-label">Position {place}</div>
            <div className="mt-6 font-display text-3xl font-semibold tracking-[-0.04em] text-[#f5f7fa] sm:text-4xl">
              {player.username}
            </div>
          </div>

          <div className="space-y-4">
            <div className="vault-divider" />

            <div className="grid grid-cols-2 gap-3">
              <Metric label="Prize" value={formatDollar(prizeValue)} accent={featured} />
              <Metric label="Wagered" value={formatDollar(wagerValue)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-[18px] border border-white/7 bg-black/20 px-4 py-4">
      <div className="text-[10px] uppercase tracking-[0.24em] text-[#6f7986]">{label}</div>
      <div
        className={clsx(
          "mt-3 font-display text-[1.4rem] font-semibold tracking-[-0.04em]",
          accent ? "text-[#c2a56c]" : "text-[#f5f7fa]",
        )}
      >
        {value}
      </div>
    </div>
  );
}

function getPrizeForPlace(place: Place) {
  if (place === 1) return 300;
  if (place === 2) return 200;
  return 150;
}

function formatDollar(value: number) {
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}
