import React, { useRef, useState, useEffect } from 'react';

export default function EnvelopeIntro({ onOpen }) {
  const videoRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const handleClick = () => {
    if (!hasStarted) {
      setHasStarted(true);
      const video = videoRef.current;
      if (video) {
        video.muted = false;
        video.currentTime = 0;
        video.play().catch(() => {
          // Fallback for browser autoplay audio policy
          video.muted = true;
          video.play().catch(() => {});
        });
      }
      if (onOpen) onOpen();
    } else {
      // Tapping while playing dismisses intro smoothly
      handleVideoEnded();
    }
  };

  const handleVideoEnded = () => {
    setIsFading(true);
    setTimeout(() => {
      setIsDismissed(true);
    }, 1000);
  };

  useEffect(() => {
    // Lock scroll while intro is visible
    if (!isDismissed) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isDismissed]);

  if (isDismissed) return null;

  return (
    <div
      onClick={handleClick}
      className="fixed inset-0 z-[100] bg-black cursor-pointer flex items-center justify-center select-none"
      style={{
        opacity: isFading ? 0 : 1,
        transition: 'opacity 1000ms ease-in-out',
        pointerEvents: isFading ? 'none' : 'auto'
      }}
    >
      <video
        ref={videoRef}
        src="/assets/intro-video.mp4"
        className="w-full h-full object-cover"
        playsInline
        preload="auto"
        muted
        onEnded={handleVideoEnded}
      />
      
      {!hasStarted && (
        <div className="absolute inset-0 flex items-end justify-center pb-20 sm:pb-24 pointer-events-none">
          <div className="inline-flex items-center justify-center px-16 sm:px-20 md:px-24 py-4 sm:py-4.5 rounded-full bg-white/25 backdrop-blur-lg border border-white/50 text-white font-caps text-xs sm:text-sm tracking-[0.35em] uppercase font-semibold whitespace-nowrap animate-pulse shadow-[0_8px_32px_rgba(0,0,0,0.35)] ring-1 ring-white/30">
            TAP TO OPEN
          </div>
        </div>
      )}
    </div>
  );
}
