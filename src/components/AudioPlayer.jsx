import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const AUDIO_SRC = "https://suraj-libina.invitationmedia.in/__l5e/assets-v1/bcf23206-309d-41ed-9402-c3e6e175a05e/CantHelpFallingInLove.mp3";

export default function AudioPlayer({ autoPlayTrigger }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    // Only attempt playback when explicitly triggered after entering the page
    if (!autoPlayTrigger || hasStartedRef.current) return;

    const audio = audioRef.current;
    if (!audio) return;

    const playAudio = () => {
      if (!audio || hasStartedRef.current) return;

      // Ensure no concurrent playback on this element
      if (!audio.paused) {
        audio.pause();
      }

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            hasStartedRef.current = true;
            setIsPlaying(true);
          })
          .catch(() => {
            // Autoplay blocked by browser policy without initial user interaction in this tab:
            // listen for the first user click/touch inside the page to begin playback
            setIsPlaying(false);

            const onUserGesture = () => {
              if (audio && !hasStartedRef.current) {
                audio.play()
                  .then(() => {
                    hasStartedRef.current = true;
                    setIsPlaying(true);
                  })
                  .catch(() => {});
              }
              window.removeEventListener('click', onUserGesture);
              window.removeEventListener('touchstart', onUserGesture);
            };

            window.addEventListener('click', onUserGesture, { once: true, passive: true });
            window.addEventListener('touchstart', onUserGesture, { once: true, passive: true });
          });
      }
    };

    playAudio();

    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [autoPlayTrigger]);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        hasStartedRef.current = true;
        setIsPlaying(true);
      }).catch(() => {});
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        preload="metadata"
      />
      {autoPlayTrigger && (
        <button
          type="button"
          onClick={toggleAudio}
          aria-label={isPlaying ? 'Mute music' : 'Play music'}
          className="fixed bottom-5 right-5 z-[90] h-11 w-11 rounded-full bg-[var(--primary)]/90 text-white shadow-lg backdrop-blur flex items-center justify-center border border-[var(--gold)]/40 hover:scale-105 transition-transform cursor-pointer"
        >
          {isPlaying ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5 text-white/70" />}
        </button>
      )}
    </>
  );
}

