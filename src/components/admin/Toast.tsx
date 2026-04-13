'use client';

export function Toast({ message }: { message: string }) {
  return <div className="fixed bottom-5 right-5 z-[100] rounded-2xl border border-electric/30 bg-[#0d1320] px-4 py-3 text-sm text-white shadow-glow">{message}</div>;
}
