import Image from "next/image";

export default function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-10 h-10">
        <Image
          src="/brand/logo-mark.png"
          alt="DirtyGunner"
          fill
          className="object-contain drop-shadow-[0_0_12px_rgba(139,92,246,0.6)]"
        />
      </div>

      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold tracking-wide text-white">
          DIRTYGUNNER
        </span>
        <span className="text-[10px] text-zinc-400 tracking-widest">
          CONTROL PANEL
        </span>
      </div>
    </div>
  );
}