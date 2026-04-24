type LegacyTournamentOverlayFrameProps = {
  title?: string;
  className?: string;
};

export function LegacyTournamentOverlayFrame({
  title = "Slot tournament overlay",
  className,
}: LegacyTournamentOverlayFrameProps) {
  return (
    <iframe
      title={title}
      src="/slot-tournament-overlay.html"
      className={className ?? "h-full w-full border-0"}
    />
  );
}
