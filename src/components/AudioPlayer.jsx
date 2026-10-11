import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function AudioPlayer({ autoPlayTrigger }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Attempt playback when triggered
    if (autoPlayTrigger && audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay blocked by browser
        setIsPlaying(false);
      });
    }
  }, [autoPlayTrigger]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="https://suraj-libina.invitationmedia.in/__l5e/assets-v1/bcf23206-309d-41ed-9402-c3e6e175a05e/CantHelpFallingInLove.mp3"
        loop
        preload="auto"
      />
      <button
        type="button"
        onClick={toggleAudio}
        aria-label={isPlaying ? 'Mute music' : 'Play music'}
        className="fixed bottom-5 right-5 z-[90] h-11 w-11 rounded-full bg-[var(--primary)]/90 text-white shadow-lg backdrop-blur flex items-center justify-center border border-[var(--gold)]/40 hover:scale-105 transition-transform cursor-pointer"
      >
        {isPlaying ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5 text-white/70" />}
      </button>
    </>
  );
}
