import React, { useState, useRef } from 'react';

// Tasteful, sacred minimal Lord Ganesha icon in antique gold
function MinimalGaneshaIcon({ className = "", style = {} }) {
  return (
    <svg
      viewBox="0 0 40 45"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Auspicious Tilak / Trishul mark */}
      <path d="M20 3v8" />
      <path d="M17 6c0 3 3 5 3 5s3-2 3-5" />
      <circle cx="20" cy="11.5" r="0.9" fill="currentColor" />
      {/* Graceful Ears */}
      <path d="M13 16c-4-2-7 1-7 6s5 7 8 6" />
      <path d="M27 16c4-2 7 1 7 6s-5 7-8 6" />
      {/* Crown / Head curve */}
      <path d="M13 16c3-1 11-1 14 0" />
      {/* Trunk curve flowing gracefully */}
      <path d="M17 19c2 4 4 9 1 14-2 3-4 4-5 6 0 2 2 3 4 3 4 0 6-3 7-5" />
      {/* Sacred Modak */}
      <circle cx="27" cy="34" r="1.4" fill="currentColor" />
      {/* Single auspicious tusk */}
      <path d="M14 24l-3 1.5" />
    </svg>
  );
}

// Elegant gold map pin icon
function GoldPinIcon({ className = "", style = {} }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style} aria-hidden="true">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  );
}

// Delicate flying golden bird silhouette
function FlyingBirdIcon({ className = "", style = {} }) {
  return (
    <svg viewBox="0 0 32 20" fill="currentColor" className={className} style={style} aria-hidden="true">
      <path d="M2 13 C 8 7, 15 2, 22 4 C 26 5, 29 3, 31 1 C 28 6, 25 10, 20 11 C 16 12, 12 15, 10 19 C 9 15, 6 13, 2 13 Z" opacity="0.9" />
    </svg>
  );
}

// Traditional ornamental palmette / floral crest above & below the button
function TraditionalFloralCrest({ className = "", style = {}, flip = false }) {
  return (
    <svg
      viewBox="0 0 120 18"
      fill="currentColor"
      className={`${className} ${flip ? 'rotate-180' : ''}`}
      style={style}
      aria-hidden="true"
    >
      {/* Center petal */}
      <path d="M60 2 C 58.5 6, 57.5 9, 58 13 C 59.5 12, 60.5 12, 62 13 C 62.5 9, 61.5 6, 60 2 Z" />
      {/* Left petal */}
      <path d="M59 7 C 54 9, 49 11, 51 14 C 54 13, 57 13.5, 58.5 14 C 58 11.5, 58.5 9, 59 7 Z" />
      {/* Right petal */}
      <path d="M61 7 C 66 9, 71 11, 69 14 C 66 13, 63 13.5, 61.5 14 C 62 11.5, 61.5 9, 61 7 Z" />
      {/* Left hairline flourish */}
      <path d="M48 13 C 38 12, 28 10, 18 12 C 14 13, 10 14, 6 13 C 12 12, 22 10.5, 34 11.5 C 40 12, 45 12.5, 48 13 Z" />
      <circle cx="5" cy="13" r="1.2" />
      {/* Right hairline flourish */}
      <path d="M72 13 C 82 12, 92 10, 102 12 C 106 13, 110 14, 114 13 C 108 12, 98 10.5, 86 11.5 C 80 12, 75 12.5, 72 13 Z" />
      <circle cx="115" cy="13" r="1.2" />
    </svg>
  );
}

// Traditional auspicious golden Lotus blossom
function TraditionalLotusIcon({ className = "", style = {} }) {
  return (
    <svg viewBox="0 0 28 20" fill="currentColor" className={className} style={style} aria-hidden="true">
      {/* Central petal */}
      <path d="M14 1 C 12 5, 11.5 10, 14 15 C 16.5 10, 16 5, 14 1 Z" />
      {/* Left inner petal */}
      <path d="M12.5 5 C 9 8, 8 12, 11.5 16 C 10.5 13, 11 9, 12.5 5 Z" />
      {/* Right inner petal */}
      <path d="M15.5 5 C 19 8, 20 12, 16.5 16 C 17.5 13, 17 9, 15.5 5 Z" />
      {/* Left outer petal */}
      <path d="M9 9 C 4 11, 3 14.5, 8 16.5 C 5.5 14.5, 7 11.5, 9 9 Z" />
      {/* Right outer petal */}
      <path d="M19 9 C 24 11, 25 14.5, 20 16.5 C 22.5 14.5, 21 11.5, 19 9 Z" />
      {/* Base blossom stand */}
      <path d="M10 16.5 C 12 18, 16 18, 18 16.5 C 16.5 17.5, 11.5 17.5, 10 16.5 Z" />
    </svg>
  );
}

// Decorative divider underneath heading (navy blue or antique gold)
function FloralFlourishDivider({ className = "", style = {} }) {
  return (
    <svg viewBox="0 0 240 24" fill="currentColor" className={className} style={style} aria-hidden="true">
      {/* Center diamond & blossom */}
      <circle cx="120" cy="12" r="2.2" />
      <path d="M120 7c-1.5 2.5-1.5 3.5 0 5 1.5-1.5 1.5-2.5 0-5z" />
      <path d="M120 17c-1.5-2.5-1.5-3.5 0-5 1.5 1.5 1.5 2.5 0 5z" />
      {/* Left wing hairlines & petals */}
      <path d="M112 12H30" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M95 12c-3-2.5-8-4-12-3 4.5 1.5 8 2.5 12 3z" />
      <path d="M95 12c-3 2.5-8 4-12 3 4.5-1.5 8-2.5 12-3z" />
      <path d="M68 12c-2.5-2-6-3-9-2.5 3.5 1 6 2 9 2.5z" />
      <path d="M68 12c-2.5-2-6-3-9-2.5 3.5 1 6 2 9 2.5z" />
      <circle cx="28" cy="12" r="1.2" />
      {/* Right wing hairlines & petals */}
      <path d="M128 12h82" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M145 12c3-2.5 8-4 12-3-4.5 1.5-8 2.5-12 3z" />
      <path d="M145 12c3 2.5 8 4 12 3-4.5-1.5-8-2.5-12-3z" />
      <path d="M172 12c2.5-2 6-3 9-2.5-3.5 1-6 2-9 2.5z" />
      <path d="M172 12c2.5 2 6 3 9 2.5-3.5-1-6-2-9-2.5z" />
      <circle cx="212" cy="12" r="1.2" />
    </svg>
  );
}

export default function CeremonyGlassCard() {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0.6, rotateY: -0.4, glareX: 50, glareY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
      return;
    }
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * 2.5;
    const rotateY = ((x - centerX) / centerX) * 2.5;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glareX, glareY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0.6, rotateY: -0.4, glareX: 50, glareY: 50 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      className="w-full max-w-[480px] mx-auto relative z-10 flex flex-col items-center select-none px-2 sm:px-0"
      style={{ perspective: '1200px' }}
    >
      {/* 
        ========================================================================
        Traditional Kerala Wedding Stationery Card
        Background Artwork: Elegant Watercolour Wedding Stationery Landscape (1).png
        - High-resolution watercolor paper texture
        - Powder-blue watercolor blossoms & hanging wisteria
        - Antique gold arched frame with corner palmettes
        - Illustrated Kerala riverside with houseboats, palms & nilavilakku
        - ALL content fitted strictly inside the gold inner decorative border
        ========================================================================
      */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transformStyle: 'preserve-3d',
          transition: isHovered ? 'transform 0.15s ease-out' : 'transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
        className="wedding-card-canvas relative overflow-hidden"
      >
        {/* Subtle Pearl Shimmer on hover */}
        <div
          className="pointer-events-none absolute inset-0 opacity-25 transition-opacity duration-500 z-10"
          style={{
            background: `radial-gradient(circle 420px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.65), transparent 70%)`,
          }}
        />

        {/* 
          Inner Typographical Content Container:
          Positioned strictly within the gold inner decorative border:
          - Top: 13.5% (comfortably below top arch and hanging floral cluster)
          - Bottom: 23% (comfortably above the riverside illustration and water lilies)
          - Left & Right: 11% (safely inside vertical side borders)
        */}
        <div
          style={{
            position: 'absolute',
            top: '12.5%',
            bottom: '22%',
            left: '11%',
            right: '11%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'center',
            transform: 'translateZ(20px)',
            pointerEvents: 'auto',
          }}
          className="select-none z-20"
        >
          {/* ==============================================================
              SECTION 1: TOP HEADER & DATE
              1. Traditional decorative emblem at the top
              2. 27 DECEMBER, 2026
              3. Sunday
              4. A delicate gold ornamental divider
             ============================================================== */}
          <div className="flex flex-col items-center w-full">
            {/* 1. Traditional decorative emblem at the top */}
            <div className="flex items-center justify-center">
              <MinimalGaneshaIcon
                className="text-gold-antique drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                style={{ width: '5.8cqw', height: '6.8cqw' }}
              />
            </div>

            {/* 2. 27 DECEMBER, 2026 */}
            <h2
              className="font-serif-display font-semibold uppercase text-navy-deep tracking-[0.18em]"
              style={{ fontSize: '3.8cqw', lineHeight: 1.2, marginTop: '1cqw' }}
            >
              27 DECEMBER, 2026
            </h2>

            {/* 3. Sunday */}
            <p
              className="font-cormorant italic font-medium text-navy-deep"
              style={{ fontSize: '3.3cqw', opacity: 0.85, marginTop: '0.4cqw', lineHeight: 1.15 }}
            >
              Sunday
            </p>

            {/* 4. A delicate gold ornamental divider */}
            <div className="flex items-center justify-center gap-1.5" style={{ marginTop: '1cqw' }}>
              <span className="h-[1px]" style={{ width: '12cqw', background: 'linear-gradient(to right, transparent, rgba(197, 160, 89, 0.75))' }} />
              <span className="text-gold-antique" style={{ fontSize: '1.8cqw', lineHeight: 1 }}>♦</span>
              <span className="h-[1px]" style={{ width: '12cqw', background: 'linear-gradient(to left, transparent, rgba(197, 160, 89, 0.75))' }} />
            </div>
          </div>

          {/* ==============================================================
              SECTION 2: CEREMONY TITLE & TIME
              5. Wedding Ceremony
              6. A decorative navy-blue divider
              7. 11:00 AM — 11:30 AM
             ============================================================== */}
          <div className="flex flex-col items-center w-full">
            {/* 5. Wedding Ceremony */}
            <h1
              className="font-script text-navy-deep font-normal tracking-wide drop-shadow-[0_1px_2px_rgba(21,42,74,0.06)]"
              style={{ fontSize: '8.8cqw', lineHeight: 1.05 }}
            >
              Wedding Ceremony
            </h1>

            {/* 6. A decorative navy-blue divider */}
            <div className="flex items-center justify-center" style={{ marginTop: '0.8cqw' }}>
              <FloralFlourishDivider
                style={{ width: '36cqw', color: '#152a4a', opacity: 0.85 }}
              />
            </div>

            {/* 7. 11:00 AM — 11:30 AM */}
            <div
              className="font-serif-display font-semibold text-navy-deep tracking-[0.14em]"
              style={{ fontSize: '3.8cqw', marginTop: '0.8cqw', lineHeight: 1.2 }}
            >
              11:00 AM — 11:30 AM
            </div>
          </div>

          {/* ==============================================================
              SECTION 3: VENUE & GOOGLE MAPS ACTION
              8. Venue (with golden bird accent)
              9. SREE GOKULAM CONVENTION CENTRE
              10. BALUSSERY, KOZHIKODE
              11. The existing Google Maps button
             ============================================================== */}
          <div className="flex flex-col items-center w-full">
            {/* 8. Venue */}
            <div className="relative inline-flex items-center justify-center">
              <p
                className="font-cormorant italic text-gold-antique font-normal tracking-wide"
                style={{ fontSize: '4.8cqw', lineHeight: 1.15 }}
              >
                Venue
              </p>
              {/* Subtle flying golden bird silhouette */}
              <div className="absolute -right-[5.2cqw] -top-[0.2cqw] opacity-85">
                <FlyingBirdIcon style={{ width: '5cqw', height: '4cqw', color: '#c5a059' }} />
              </div>
            </div>

            {/* 9. SREE GOKULAM CONVENTION CENTRE */}
            <div
              className="font-montserrat uppercase font-semibold text-navy-deep tracking-[0.15em] mt-1"
              style={{ fontSize: '2.6cqw', lineHeight: 1.35 }}
            >
              SREE GOKULAM CONVENTION CENTRE
            </div>

            {/* 10. BALUSSERY, KOZHIKODE */}
            <div
              className="font-montserrat uppercase font-semibold text-navy-deep tracking-[0.16em]"
              style={{ fontSize: '2.4cqw', lineHeight: 1.35, opacity: 0.9 }}
            >
              BALUSSERY, KOZHIKODE
            </div>

            {/* 11. The existing Google Maps button with top & bottom palmettes */}
            <div className="flex flex-col items-center" style={{ marginTop: '1.4cqw' }}>
              {/* Top gold palmette */}
              <TraditionalFloralCrest
                style={{ width: '19cqw', color: '#c5a059', opacity: 0.9, marginBottom: '0.6cqw' }}
              />

              {/* Maroon Pill Button */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=Sree+Gokulam+Convention+Centre+Balussery+Kozhikode"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Sree Gokulam Convention Centre in Google Maps"
                className="traditional-maroon-btn group select-none"
                style={{
                  padding: '1.6cqw 4.8cqw',
                  gap: '2cqw',
                }}
              >
                {/* Gold Pin Icon */}
                <GoldPinIcon style={{ width: '3.4cqw', height: '3.8cqw', color: '#c5a059' }} className="shrink-0" />

                {/* Thin vertical separator */}
                <span style={{ height: '3.8cqw', width: '1px', backgroundColor: 'rgba(197, 160, 89, 0.5)' }} />

                {/* Two-line white text */}
                <span
                  className="font-montserrat uppercase font-bold text-[#f7f1e5] tracking-[0.14em] text-center"
                  style={{ fontSize: '2.2cqw', lineHeight: 1.15 }}
                >
                  OPEN GOOGLE<br />MAPS
                </span>

                {/* Gold arrow */}
                <span
                  className="text-gold-antique group-hover:translate-x-0.5 transition-transform duration-200 font-bold"
                  style={{ fontSize: '2.6cqw', lineHeight: 1 }}
                >
                  →
                </span>
              </a>

              {/* Bottom gold palmette */}
              <TraditionalFloralCrest
                flip={true}
                style={{ width: '19cqw', color: '#c5a059', opacity: 0.9, marginTop: '0.6cqw' }}
              />
            </div>
          </div>

          {/* ==============================================================
              SECTION 4: INVITATION MESSAGE & ADDITIONAL INFORMATION
              12. Invitation message
              13. 1202 DHANU 27 · KOZHIKODE
             ============================================================== */}
          <div className="flex flex-col items-center w-full">
            {/* Top decorative quotation mark */}
            <div className="flex items-center justify-center gap-1.5 opacity-80 text-gold-antique" style={{ marginBottom: '0.4cqw' }}>
              <span className="h-[1px]" style={{ width: '8cqw', background: 'linear-gradient(to right, transparent, rgba(197, 160, 89, 0.65))' }} />
              <span className="font-cormorant italic select-none leading-none" style={{ fontSize: '3.4cqw' }}>“</span>
              <span className="h-[1px]" style={{ width: '8cqw', background: 'linear-gradient(to left, transparent, rgba(197, 160, 89, 0.65))' }} />
            </div>

            {/* 12. Invitation message */}
            <p
              className="font-cormorant italic font-normal text-navy-deep leading-relaxed mx-auto"
              style={{
                fontSize: '3.1cqw',
                maxWidth: '70cqw',
                lineHeight: 1.45,
                textShadow: '0 1px 1px rgba(255, 255, 255, 0.9)',
              }}
            >
              “We cordially invite you and your family to grace this auspicious occasion with your presence and blessings.”
            </p>

            {/* 13. Additional information: 1202 DHANU 27 · KOZHIKODE */}
            {/* <div
              className="flex items-center justify-center"
              style={{ marginTop: '1cqw' }}
            >
              <span
                className="font-montserrat uppercase font-semibold text-navy-deep tracking-[0.20em]"
                style={{
                  fontSize: '2.5cqw',
                  padding: '1cqw 3.6cqw',
                  borderRadius: '9999px',
                  background: 'rgba(197, 160, 89, 0.14)',
                  border: '1px solid rgba(197, 160, 89, 0.45)',
                  boxShadow: '0 1px 4px rgba(197, 160, 89, 0.12)',
                }}
              >
                1202 DHANU 27 · KOZHIKODE
              </span>
            </div> */}

            {/* Delicate lotus accent above riverside scenery */}
            <div className="flex items-center justify-center opacity-85 text-gold-antique" style={{ marginTop: '0.8cqw' }}>
              <TraditionalLotusIcon style={{ width: '4.2cqw', height: '3.2cqw', color: '#c5a059' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
