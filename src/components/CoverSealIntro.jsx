import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

/**
 * CoverSealIntro
 * Full-screen portrait cover using 'Kerala Backwaters Wedding Invitation Seal.png'
 * Features a pixel-perfect interactive burgundy 'S & V' wax seal with 400ms zoom,
 * gold glow hover effect, accessible button overlay, and elegant opening animation.
 */
export default function CoverSealIntro({ onOpen, onEntered }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if opened via URL param
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('open') === 'true') {
        setIsDismissed(true);
        if (onOpen) onOpen();
        if (onEntered) onEntered();
      }
    } catch {
      // Ignore URL parse errors
    }
  }, [onOpen, onEntered]);

  // Lock document scroll while cover is visible
  useEffect(() => {
    if (!isDismissed && !isFading) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isDismissed, isFading]);

  const handleOpen = () => {
    if (isFading || isDismissed) return;

    // Elegant gold & burgundy petal burst on breaking the seal
    try {
      confetti({
        particleCount: 40,
        spread: 65,
        origin: { x: 0.5, y: 0.46 },
        colors: ['#c5a059', '#dfc282', '#fff6e0', '#5b1b24', '#7c2532'],
        ticks: 120,
        gravity: 0.85,
        scalar: 0.95,
        shapes: ['circle'],
      });
    } catch {
      // Confetti optional
    }

    setIsFading(true);

    if (onOpen) {
      onOpen();
    }

    // Dismiss cover after smooth fade-out and enter page
    setTimeout(() => {
      setIsDismissed(true);
      if (onEntered) {
        onEntered();
      }
    }, 900);
  };

  if (isDismissed) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center select-none overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #15263d 0%, #060e18 100%)',
        opacity: isFading ? 0 : 1,
        transform: isFading ? 'scale(1.04)' : 'scale(1)',
        transition: 'opacity 900ms cubic-bezier(0.4, 0, 0.2, 1), transform 900ms cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isFading ? 'none' : 'auto',
      }}
      aria-modal="true"
      role="dialog"
      aria-label="Wedding Invitation Opening Screen"
    >
      {/* 1. MOBILE PORTRAIT ARTWORK (941 x 1672) */}
      <div className="cover-artwork-container-mobile">
        {/* Full-screen portrait cover background image */}
        <picture className="w-full h-full block">
          <source srcSet="/assets/kerala-cover-artwork.webp" type="image/webp" />
          <img
            src="/assets/kerala-cover-artwork.png"
            alt="Kerala Backwaters Wedding Invitation Cover"
            className="w-full h-full object-fill pointer-events-none select-none block"
            draggable={false}
          />
        </picture>

        {/* Mobile Interactive Wax Seal Layer */}
        <div
          className="cover-seal-wrapper"
          style={{
            position: 'absolute',
            left: '49.5218%',
            top: '46.4713%',
            width: '37.1945%',
            aspectRatio: '1 / 1',
            transform: 'translate(-50%, -50%)',
            transformOrigin: 'center center',
            zIndex: 20,
          }}
        >
          {/* Duplicated Mobile Seal Image Layer */}
          <picture className="w-full h-full block">
            <source srcSet="/assets/seal-wax-interactive.webp" type="image/webp" />
            <img
              src="/assets/seal-wax-interactive.png"
              alt=""
              aria-hidden="true"
              className={`cover-seal-image ${!isHovered ? 'cover-seal-pulsing' : ''}`}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                pointerEvents: 'none',
                transformOrigin: 'center center',
                transition: 'transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1), filter 400ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                transform: isHovered ? 'scale(1.10)' : 'scale(1)',
                filter: isHovered
                  ? 'drop-shadow(0 12px 28px rgba(197, 160, 89, 0.65)) drop-shadow(0 4px 14px rgba(68, 18, 25, 0.6))'
                  : 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.25))',
              }}
            />
          </picture>

          {/* Transparent HTML Button over mobile seal */}
          <button
            type="button"
            onClick={handleOpen}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsHovered(true)}
            onBlur={() => setIsHovered(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOpen();
              }
            }}
            aria-label="Open S & V Wedding Invitation"
            title="Open S & V Wedding Invitation"
            className="cover-seal-button"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
              zIndex: 30,
            }}
          />
        </div>
      </div>

      {/* 2. DESKTOP LANDSCAPE ARTWORK (1672 x 941 - Kerala Backwaters Open Invitation) */}
      <div className="cover-artwork-container-desktop">
        {/* Full-screen landscape desktop cover background image */}
        <picture className="w-full h-full block">
          <source srcSet="/assets/kerala-cover-desktop.webp" type="image/webp" />
          <img
            src="/assets/kerala-cover-desktop.png"
            alt="Kerala Backwaters Wedding Invitation Cover"
            className="w-full h-full object-fill pointer-events-none select-none block"
            draggable={false}
          />
        </picture>

        {/* Desktop Interactive Wax Seal Layer (Centered at 49.8505%, 47.7683%) */}
        <div
          className="cover-seal-wrapper"
          style={{
            position: 'absolute',
            left: '49.8505%',
            top: '47.7683%',
            width: '21.5311%',
            aspectRatio: '1 / 1',
            transform: 'translate(-50%, -50%)',
            transformOrigin: 'center center',
            zIndex: 20,
          }}
        >
          {/* Duplicated Desktop Seal Image Layer (Enables real zoom & glow on hover) */}
          <picture className="w-full h-full block">
            <source srcSet="/assets/seal-wax-desktop.webp" type="image/webp" />
            <img
              src="/assets/seal-wax-desktop.png"
              alt=""
              aria-hidden="true"
              className={`cover-seal-image ${!isHovered ? 'cover-seal-pulsing' : ''}`}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                pointerEvents: 'none',
                transformOrigin: 'center center',
                transition: 'transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1), filter 400ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                transform: isHovered ? 'scale(1.10)' : 'scale(1)',
                filter: isHovered
                  ? 'drop-shadow(0 14px 32px rgba(197, 160, 89, 0.70)) drop-shadow(0 5px 16px rgba(68, 18, 25, 0.6))'
                  : 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.25))',
              }}
            />
          </picture>

          {/* Transparent HTML Button positioned directly over desktop seal */}
          <button
            type="button"
            onClick={handleOpen}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsHovered(true)}
            onBlur={() => setIsHovered(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOpen();
              }
            }}
            aria-label="Open S & V Wedding Invitation"
            title="Open S & V Wedding Invitation"
            className="cover-seal-button"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
              zIndex: 30,
            }}
          />
        </div>
      </div>
    </div>
  );
}
