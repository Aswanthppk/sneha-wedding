import React, { useRef, useState, useEffect } from 'react';

export default function EnvelopeIntro({ onOpen }) {
  const videoRef = useRef(null);
  const safetyTimeoutRef = useRef(null);
  const stallTimerRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Configure video element for mobile devices without auto-playing
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', 'true');
      video.setAttribute('x5-playsinline', 'true');
      video.pause();
      video.currentTime = 0;
    }

    return () => {
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
      }
      if (stallTimerRef.current) {
        clearTimeout(stallTimerRef.current);
      }
    };
  }, []);

  const handleVideoEnded = () => {
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
    if (stallTimerRef.current) {
      clearTimeout(stallTimerRef.current);
      stallTimerRef.current = null;
    }
    setIsBuffering(false);
    setIsFading(true);
    setTimeout(() => {
      setIsDismissed(true);
    }, 1000);
  };

  const handleWaiting = () => {
    if (hasStarted && !isFading) {
      setIsBuffering(true);
      // If stalled due to slow network for > 3.5s, gracefully reveal invitation
      if (!stallTimerRef.current) {
        stallTimerRef.current = setTimeout(() => {
          console.warn('Network slow: gracefully revealing invitation rather than stalling');
          handleVideoEnded();
        }, 3500);
      }
    }
  };

  const handlePlaying = () => {
    setIsBuffering(false);
    if (stallTimerRef.current) {
      clearTimeout(stallTimerRef.current);
      stallTimerRef.current = null;
    }
  };

  const handleOpen = () => {
    if (!hasStarted) {
      setHasStarted(true);
      const video = videoRef.current;
      if (video) {
        video.defaultMuted = true;
        video.muted = true;
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Mobile video playback prevented:', err);
            // If device policy blocks video, smoothly transition so guest is never stuck
            handleVideoEnded();
          });
        }
      }

      if (onOpen) onOpen();

      // Mobile safety timeout: Ensure transition occurs even if onEnded is delayed
      const maxDuration =
        video?.duration && !isNaN(video.duration) && video.duration > 0
          ? Math.ceil((video.duration + 1.5) * 1000)
          : 11000;

      safetyTimeoutRef.current = setTimeout(() => {
        handleVideoEnded();
      }, maxDuration);
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
      onClick={handleOpen}
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
        poster="/assets/envelope-poster.jpg"
        className="w-full h-full object-cover"
        playsInline
        webkit-playsinline="true"
        x5-playsinline="true"
        x5-video-player-type="h5"
        x5-video-player-fullscreen="false"
        muted
        preload="auto"
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        onEnded={handleVideoEnded}
        onWaiting={handleWaiting}
        onPlaying={handlePlaying}
        onCanPlay={handlePlaying}
        onStalled={handleWaiting}
        onError={() => {
          console.warn('Video failed to load on device, revealing invitation');
          handleVideoEnded();
        }}
      />

      {/* Gentle buffering indicator on slow network */}
      {hasStarted && isBuffering && !isFading && (
        <div
          style={{
            position: 'absolute',
            bottom: '36px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 25,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            borderRadius: '9999px',
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            color: '#ffffff',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '11px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            pointerEvents: 'none'
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f6d365' }} className="animate-ping" />
          <span>Opening...</span>
        </div>
      )}

      {/* Skip button during playback */}
      {hasStarted && !isFading && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleVideoEnded();
          }}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 30,
            padding: '8px 18px',
            borderRadius: '9999px',
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            color: '#ffffff',
            fontSize: '11px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            pointerEvents: 'auto'
          }}
        >
          Skip ✕
        </button>
      )}

      {/* Tap to Open Button before playing */}
      {!hasStarted && (
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            zIndex: 20,
            width: '100%',
            maxWidth: '360px',
            padding: '0 20px',
            boxSizing: 'border-box',
            pointerEvents: 'none'
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpen();
            }}
            style={{
              pointerEvents: 'auto',
              width: '100%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '14px 28px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.22)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.65)',
              color: '#ffffff',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '13px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              fontWeight: 600,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            className="animate-pulse"
          >
            <span>OPEN INVITATION</span>
            <svg
              style={{ width: '16px', height: '16px', color: '#f6d365' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
          <span
            style={{
              color: 'rgba(255, 255, 255, 0.75)',
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 400,
              textShadow: '0 1px 4px rgba(0,0,0,0.6)'
            }}
          >
            Tap anywhere to open
          </span>
        </div>
      )}
    </div>
  );
}

