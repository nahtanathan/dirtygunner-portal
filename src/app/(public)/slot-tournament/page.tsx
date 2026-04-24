import { LegacyTournamentOverlayFrame } from "@/components/tournament/LegacyTournamentOverlayFrame";

export default function SlotTournamentPage() {
  return (
    <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center">
      <div className="w-full max-w-[1600px]">
        <div className="mx-auto aspect-[16/9] w-full overflow-hidden border border-white/10 bg-black shadow-[0_24px_80px_rgba(2,8,23,0.45)]">
          <LegacyTournamentOverlayFrame className="h-full w-full border-0" />
        </div>
      </div>
    </div>
  );
}
