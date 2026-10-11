import React, { useRef, useState, useEffect } from 'react';

export default function EnvelopeIntro({ onOpen }) {
  const videoRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Ensure video is properly muted at DOM level for mobile browsers (iOS Safari / Android Chrome)
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', 'true');
      // Attempt muted initial playback so first frame decodes immediately
      video.play().catch(() => {
        // Autoplay can wait for user tap, which is expected
      });
    }
  }, []);

  const handleVideoEnded = () => {
    setIsFading(true);
    setTimeout(() => {
      setIsDismissed(true);
    }, 1000);
  };

  const handleClick = () => {
    if (!hasStarted) {
      setHasStarted(true);
      const video = videoRef.current;
      if (video) {
        // Keep video muted so mobile OS does not block playback
        video.defaultMuted = true;
        video.muted = true;
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Mobile video playback prevented:', err);
            // If mobile blocks video, smoothly transition so guest is never stuck
            handleVideoEnded();
          });
        }
      }

      if (onOpen) onOpen();

      // Mobile safety timeout: Ensure transition occurs even if onEnded is delayed or blocked
      setTimeout(() => {
        handleVideoEnded();
      }, 6500);
    } else {
      // Tap again while playing dismisses intro smoothly
      handleVideoEnded();
    }
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
      className="fixed inset-0 z-[100] bg-[#0c1929] cursor-pointer flex items-center justify-center select-none overflow-hidden"
      style={{
        opacity: isFading ? 0 : 1,
        transition: 'opacity 1000ms ease-in-out',
        pointerEvents: isFading ? 'none' : 'auto'
      }}
    >
      <video
        ref={videoRef}
        src="/assets/intro-video.mp4"
        poster="/assets/hero-bg-BoJZa16A.webp"
        className="w-full h-full object-cover"
        playsInline
        webkit-playsinline="true"
        x5-playsinline="true"
        autoPlay
        muted
        preload="auto"
        onEnded={handleVideoEnded}
        onError={() => {
          console.warn('Video failed to load on device, revealing invitation');
          handleVideoEnded();
        }}
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
