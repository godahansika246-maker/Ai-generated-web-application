import { motion } from "motion/react";
import { Music, Gamepad2, Zap, Github, Twitter, Info } from "lucide-react";
import React, { useState } from "react";
import { SnakeGame } from "./SnakeGame";
import { MusicPlayer } from "./MusicPlayer";

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-cyber-black text-white selection:bg-neon-cyan selection:text-black">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-pink/5 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-neon-cyan to-neon-pink rounded-xl flex items-center justify-center p-2 shadow-[0_0_20px_rgba(0,255,255,0.3)]">
            <Zap className="text-black" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold tracking-tighter neon-glow-cyan">SYNTH-STRIKE</h1>
            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.3em]">Neural Interface v2.0</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-[11px] font-mono uppercase tracking-widest text-gray-400">
          <a href="#" className="hover:text-neon-cyan transition-colors flex items-center gap-2 border-b border-neon-cyan pb-1 text-neon-cyan"><Gamepad2 size={14} /> Arcade</a>
          <a href="#" className="hover:text-neon-cyan transition-colors flex items-center gap-2"><Music size={14} /> Playlist</a>
          <a href="#" className="hover:text-neon-cyan transition-colors flex items-center gap-2"><Info size={14} /> About</a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Twitter size={20} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Github size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 h-[calc(100vh-88px)]">
        
        {/* Left Sidebar - Stats & Info */}
        <section className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto pr-2">
          <div className="p-6 glass-morphism rounded-3xl space-y-4">
            <h2 className="text-xs font-mono text-gray-500 uppercase tracking-widest">Pilot Profile</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-neon-cyan p-1">
                <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=pilot" alt="Avatar" className="w-full h-full rounded-full opacity-80" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">CYBER_STRIKER</p>
                <p className="text-[10px] text-neon-cyan font-mono uppercase">Level 42 Admin</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div>
                <p className="text-[10px] text-gray-500 uppercase">High Score</p>
                <p className="text-xl font-display font-bold">12,450</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase">Rank</p>
                <p className="text-xl font-display font-bold">#04</p>
              </div>
            </div>
          </div>

          <div className="p-6 glass-morphism rounded-3xl flex-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Gamepad2 size={120} />
            </div>
            <h2 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">Command Terminal</h2>
            <div className="space-y-3 font-mono text-[11px] leading-relaxed text-gray-400">
              <p className="text-neon-cyan">&gt; INITIALIZING CORE...</p>
              <p className="text-neon-pink">&gt; MUSIC SYNC: ACTIVE</p>
              <p>&gt; LAST SCORE: {score}</p>
              <p>&gt; LATENCY: 4ms</p>
              <p>&gt; WAITING FOR INPUT_</p>
            </div>
          </div>

          <div className="p-4 flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`h-1 flex-1 rounded-full ${i <= 3 ? 'bg-neon-cyan' : 'bg-white/10'}`} />
            ))}
          </div>
        </section>

        {/* Center - Snake Game */}
        <section className="lg:col-span-6 flex items-center justify-center">
          <SnakeGame onScoreChange={setScore} />
        </section>

        {/* Right Sidebar - Music Player */}
        <section className="lg:col-span-3 flex flex-col items-center lg:items-end justify-center">
          <MusicPlayer />
          
          <div className="mt-8 w-full max-w-md hidden md:block">
            <div className="p-4 border border-neon-cyan/20 bg-neon-cyan/5 rounded-2xl flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-neon-cyan/20 flex items-center justify-center">
                <Info size={16} className="text-neon-cyan" />
              </div>
              <p className="text-[10px] italic text-gray-400 leading-tight">
                PRO TIP: Eating the "Neon Fruit" increases sync rate and makes the snake glow brighter.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer / Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-2 bg-black border-t border-white/5 text-[9px] font-mono text-gray-600 uppercase tracking-[0.2em]">
        <div className="flex gap-4">
          <span>Region: Tokyo_Neo_S3</span>
          <span className="text-neon-cyan">System: Nominal</span>
        </div>
        <div className="flex gap-4">
          <span>FPS: 60</span>
          <span>Buffer: 128kb</span>
        </div>
      </footer>
    </div>
  );
}
