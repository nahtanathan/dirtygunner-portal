"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#0b0b0e] p-8 md:p-12">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-purple-600/20 blur-[120px]" />
        <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-red-600/20 blur-[120px]" />
      </div>

      <div className="relative grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Dominate the
            <span className="block bg-gradient-to-r from-purple-400 to-red-500 bg-clip-text text-transparent">
              Leaderboard
            </span>
          </h1>

          <p className="mt-4 text-zinc-400 max-w-md">
            Compete, earn, and climb. DirtyGunner raffles, challenges, and bonus hunts — all in one place.
          </p>

          <div className="mt-6 flex gap-4">
            <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-red-500 text-white font-medium shadow-lg hover:scale-[1.02] transition">
              View Leaderboard
            </button>

            <button className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition">
              Watch on Kick
            </button>
          </div>
        </div>

        {/* RIGHT LOGO */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-[320px]"
        >
          <Image
            src="/brand/logo-full.png"
            alt="DirtyGunner"
            fill
            className="object-contain drop-shadow-[0_0_40px_rgba(139,92,246,0.5)]"
          />
        </motion.div>
      </div>
    </section>
  );
}