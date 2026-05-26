/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { musicConfig } from "../musicConfig";

export default function RetroMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Attempt autoplay when mounted
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.45; // Smooth ambient volume
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.log("Autoplay blocked or waiting for user interaction: ", err);
            setIsPlaying(false);
          });
      }
    }
  }, []);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Could not play audio:", err));
    }
  };

  return (
    <div className="flex items-center">
      <audio 
        ref={audioRef}
        src={musicConfig.audioUrl}
        loop
      />
      
      <button
        onClick={togglePlayback}
        className={`px-3 py-1.5 rounded-xs border text-xs font-mono font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
          isPlaying 
            ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold" 
            : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
        }`}
        title={isPlaying ? "Click to Pause Music" : "Click to Play Music"}
      >
        {isPlaying ? (
          <>
            <Pause size={12} className="shrink-0" />
            <span>Pause</span>
          </>
        ) : (
          <>
            <Play size={12} className="shrink-0 text-emerald-500" />
            <span>Music</span>
          </>
        )}
      </button>
    </div>
  );
}
