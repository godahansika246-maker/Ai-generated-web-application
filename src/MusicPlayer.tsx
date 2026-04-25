import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Music as MusicIcon } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { Track } from "./types";

const TRACKS: Track[] = [
  {
    id: "1",
    title: "Cyber Dreams",
    artist: "Synthwave Collective",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&h=300&auto=format&fit=crop",
    duration: 372
  },
  {
    id: "2",
    title: "Neon Pulse",
    artist: "Digital Drifter",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=300&h=300&auto=format&fit=crop",
    duration: 425
  },
  {
    id: "3",
    title: "Midnight Drive",
    artist: "Retrowave Records",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://images.unsplash.com/photo-1514525253344-7814d9994a47?q=80&w=300&h=300&auto=format&fit=crop",
    duration: 388
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play();
    }
  }, [currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md p-6 glass-morphism rounded-3xl shadow-[0_20px_50px_rgba(255,0,255,0.1)]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={skipForward}
      />
      
      <div className="flex flex-col gap-6">
        <div className="relative group overflow-hidden rounded-2xl aspect-square">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentTrack.id}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.5 }}
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
          
          {isPlaying && (
            <div className="absolute bottom-4 right-4 flex items-end gap-1 h-6">
              {[0.6, 1, 0.4, 0.8].map((v, i) => (
                <motion.div
                  key={i}
                  animate={{ height: ["20%", "100%", "20%"] }}
                  transition={{ duration: v, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1 bg-neon-cyan"
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-bold tracking-tight text-white">{currentTrack.title}</h3>
          <p className="text-sm text-gray-400 font-mono uppercase tracking-widest">{currentTrack.artist}</p>
        </div>

        <div className="space-y-2">
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={false}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-neon-pink to-neon-cyan"
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-gray-500 uppercase">
            <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : "0:00"}</span>
            <span>{audioRef.current ? formatTime(audioRef.current.duration || 0) : "0:00"}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button onClick={skipBackward} className="p-2 text-gray-400 hover:text-white transition-colors">
            <SkipBack size={24} />
          </button>
          
          <button
            onClick={togglePlay}
            className="w-16 h-16 flex items-center justify-center bg-white text-black rounded-full hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>

          <button onClick={skipForward} className="p-2 text-gray-400 hover:text-white transition-colors">
            <SkipForward size={24} />
          </button>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Volume2 size={16} className="text-gray-500" />
          <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-white/20" />
          </div>
        </div>
      </div>
    </div>
  );
};
